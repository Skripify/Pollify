import { trpc } from "@/utils/trpc";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function QuestionPage() {
  const { data: session } = useSession({ required: true });
  let totalVotes = 0;

  const router = useRouter();
  const { id } = router.query;
  if (!id || typeof id !== "string") return null;

  const { data } = trpc.useQuery(["questions.getOne", id]);
  const { data: votes } = trpc.useQuery(["questions.getVotes", id]);
  console.log(votes);

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
      id: session?.user.id as string,
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

  if (!data || !session)
    return <h1 className="text-4xl font-bold">Loading...</h1>;

  if (data && data != undefined) getTotalVotes(votes);

  return (
    <main className="max-w-2xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-10 text-center">{data?.question}</h1>
      <div className="flex flex-col gap-4">
        {(data.options as string[])?.map((option, index) => {
          if (voted)
            return (
              <div key={index}>
                <div className="flex justify-between">
                  <p className="font-bold">{option}</p>
                  <p>{getPercent(votes?.[index]?._count)?.toFixed()}%</p>
                </div>
                <progress
                  className="progress progress-info w-full"
                  value={votes?.[index]?._count ?? 0}
                  max={totalVotes}
                />
              </div>
            );
          return (
            <button
              type="button"
              key={index}
              onClick={() =>
                vote({ id, choice: option, token: session.user.id })
              }
              className="btn btn-outline"
            >
              {option}
            </button>
          );
        })}
      </div>
    </main>
  );
}
