import React from "react";
import Link from "next/link";
import { PollQuestion } from "@prisma/client";

const QuestionCard: React.FC<{
  question: PollQuestion;
}> = ({ question }) => {
  return (
    <div key={question.id} className="card bg-base-200 shadow-xl">
      <div className="card-body">
        <h1 key={question.id} className="card-title">
          {question.question}
        </h1>
        <p className="text-sm text-white/30">
          Created on{" "}
          {question.createdAt.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
        <div className="card-actions mt-5 items-center justify-between">
          <Link href={`/question/${question.id}`}>
            <a className="">View</a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
