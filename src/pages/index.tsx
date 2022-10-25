import { trpc } from "@/utils/trpc";
import React from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import QuestionCard from "@/components/QuestionCard";
import Loading from "@/components/Loading";

export default function Home() {
  const { data: session } = useSession({ required: true });
  const { data } = trpc.useQuery(["questions.getAll"]);

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
            <QuestionCard key={question.id} question={question} />
          ))}
        </div>
        <div className="p-2" />
      </main>
    </>
  );
}
