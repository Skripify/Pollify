import { trpc } from "@/utils/trpc";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import QuestionCard from "@/components/QuestionCard";
import Loading from "@/components/Loading";
import { PollQuestion } from "@prisma/client";
import getBaseUrl from "@/utils/getBaseUrl";
import { useState } from "react";

export default function Home() {
  const [showToast, setShowToast] = useState(false);
  const { data: session } = useSession({ required: true });
  const { data } = trpc.useQuery([
    "questions.getAll",
    // {
    //   id: session?.user.id as string,
    // },
  ]);

  const url = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : `http://localhost:${process.env.PORT ?? 3000}`;

  const copyToClipboard = (question: PollQuestion) => {
    navigator.clipboard.writeText(`${url}/question/${question.id}`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1500);
  };

  if (!data) return <Loading />;

  return (
    <>
      <header className="p-4 flex w-full justify-between items-center">
        <h1 className="text-4xl font-bold">Pollify</h1>
        <Link href="/question/create">
          <a className="btn btn-outline rounded-md">Create New Question</a>
        </Link>
      </header>
      <main className="px-4">
        <div className="grid grid-cols-1 gap-y-5 md:grid-cols-3 md:gap-x-5 mt-10">
          {data?.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              copyToClipboard={copyToClipboard}
            />
          ))}
        </div>
      </main>

      {showToast && (
        <div className="absolute bottom-5 right-10 flex items-center justify-center bg-base-200 p-3 rounded-md w-1/5">
          <span className="text-xs font-semibold">
            Link copied to the clipboard!
          </span>
        </div>
      )}
    </>
  );
}
