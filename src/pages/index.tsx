import { trpc } from "@/utils/trpc";
import React from "react";

const QuestionForm: React.FC = () => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const client = trpc.useContext();
  const { mutate, isLoading } = trpc.useMutation("questions.create", {
    onSuccess: (data) => {
      console.log("did we succeed?", data);
      client.invalidateQueries(["questions.getAll"]);
      if (!inputRef.current) return;
      inputRef.current.value = "";
    },
  });

  return (
    <input
      ref={inputRef}
      disabled={isLoading}
      onKeyDown={(event) => {
        if (event.key === "Enter")
          mutate({ question: event.currentTarget.value });
      }}
      className="text-black w-full"
    ></input>
  );
};

export default function Home() {
  const { data } = trpc.useQuery(["questions.getAll"]);

  if (!data) return <h1 className="text-4xl font-bold">Loading...</h1>;

  return (
    <>
      <div className="p-4">
        <h1 className="text-4xl font-bold">Questions</h1>
        <ul>
          {data.map((q) => (
            <li key={q.id}>{q.question}</li>
          ))}
        </ul>
        <div className="p-2" />
        <QuestionForm />
      </div>
    </>
  );
}
