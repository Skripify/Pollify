import { trpc } from "@/utils/trpc";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function QuestionPage() {
  const { data: session } = useSession({ required: true });

  const router = useRouter();
  const { id } = router.query;
  if (!id || typeof id !== "string") return null;

  const { data } = trpc.useQuery(["questions.getOne", id]);

  const client = trpc.useContext();
  const { mutate: vote } = trpc.useMutation(["vote.add"], {
    onSuccess: () => {
      client.invalidateQueries(["vote.check"])
    }
  });
  const { data: voted } = trpc.useQuery([
    "vote.check",
    {
      id: session?.user.id as string,
      question: id,
    },
  ]);

  if (!data || !session)
    return <h1 className="text-4xl font-bold">Loading...</h1>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">{data.question}</h1>
      <div className="flex flex-col items-center text-center">
        {(data.options as string[])?.map((option) => (
          <button
            type="button"
            key={option}
            onClick={() => vote({ id, choice: option, token: session.user.id })}
            className={!voted ? "hover:underline cursor-pointer" : ""}
            disabled={voted}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
