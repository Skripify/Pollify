import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";

export default function QuestionPage() {
  const router = useRouter();
  const { id } = router.query;
  if (!id || typeof id !== "string") return null;

  const { data } = trpc.useQuery(["questions.getOne", id]);

  if (!data) return <h1 className="text-4xl font-bold">Loading...</h1>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">{data.question}</h1>
      <div className="flex flex-col items-center text-center">
        {(data.options as string[])?.map((option) => (
          <p key={option}>{option}</p>
        ))}
      </div>
    </div>
  );
}
