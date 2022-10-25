import Document from "@/components/Document";
import Loading from "@/components/Loading";
import { trpc } from "@/utils/trpc";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { unstable_getServerSession } from "next-auth";
import { GetServerSideProps } from "next";
import { authOptions } from "../api/auth/[...nextauth]";
import { hasCookie, getCookie, setCookie } from "cookies-next";
import cuid from "cuid";
import NotFound from "../404";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await unstable_getServerSession(
    ctx.req,
    ctx.res,
    authOptions
  );
  if (session) return { props: { userId: session.user.id } };
  if (hasCookie("token", { req: ctx.req, res: ctx.res }))
    return {
      props: { userId: getCookie("token", { req: ctx.req, res: ctx.res }) },
    };
  else {
    setCookie("token", cuid(), { req: ctx.req, res: ctx.res });
    return {
      props: { userId: getCookie("token") },
    };
  }
};

export default function QuestionPage({ userId }: { userId: string }) {
  let totalVotes = 0;

  const router = useRouter();
  const { id } = router.query;
  if (!id || typeof id !== "string") return null;

  const { data, isLoading } = trpc.useQuery(["questions.getOne", id]);
  const { data: votes } = trpc.useQuery(["questions.getVotes", id]);

  const client = trpc.useContext();
  const { mutate: vote } = trpc.useMutation(["vote.add"], {
    onSuccess: (data) => {
      data?.map((choice: { _count: number }) => {
        totalVotes += choice._count;
      });
      client.invalidateQueries(["vote.check"]);
    },
  });
  const { data: voted } = trpc.useQuery([
    "vote.check",
    {
      id: userId,
      question: id,
    },
  ]);
  const { data: isOwner } = trpc.useQuery([
    "questions.isOwner",
    {
      id: userId,
      question: id,
    },
  ]);

  const getTotalVotes = (votes: any) => {
    votes?.map((choice: { _count: number }) => {
      totalVotes += choice._count;
    });
  };

  const getPercent = (voteCount?: number) => {
    if (voteCount !== undefined && totalVotes > 0)
      return (voteCount / totalVotes) * 100;
    else if (voteCount == undefined) return 0;
  };

  if (isLoading) return <Loading title="Question" />;
  if (!data) return <NotFound type="question" />;

  if (data && data != undefined) getTotalVotes(votes);

  return (
    <>
      <Document title="Question" />
      <header className="p-4 flex w-full justify-between items-center">
        <Link href="/">
          <a className="text-4xl font-bold">Pollify</a>
        </Link>
      </header>
      <main className="max-w-2xl mx-auto mt-10">
        <h1 className="text-2xl font-bold mb-10 text-center">
          {data?.question}
        </h1>
        <div className="flex flex-col gap-4">
          {(data.options as { text: string }[])?.map((option, index) => {
            if (isOwner || voted)
              return (
                <div key={index}>
                  <div className="flex justify-between">
                    <p className="font-bold">{option.text}</p>
                    <p>
                      {getPercent(
                        votes?.[votes?.findIndex((v) => v.choice === index)]
                          ?._count
                      )?.toFixed()}
                      %
                    </p>
                  </div>
                  <progress
                    className="progress progress-info w-full"
                    value={
                      votes?.[votes?.findIndex((v) => v.choice === index)]
                        ?._count ?? 0
                    }
                    max={totalVotes}
                  />
                </div>
              );
            return (
              <button
                type="button"
                key={index}
                onClick={() => vote({ id, choice: index, token: userId })}
                className="btn btn-outline rounded-md normal-case"
              >
                {option.text}
              </button>
            );
          })}
        </div>
      </main>
    </>
  );
}
