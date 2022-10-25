import {
  CreateQuestionInputType,
  createQuestionValidator,
} from "@/utils/createQuestionValidator";
import { useRouter } from "next/router";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@/utils/trpc";
import Loading from "@/components/Loading";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Create() {
  const { data: session } = useSession();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateQuestionInputType>({
    resolver: zodResolver(createQuestionValidator),
    defaultValues: {
      options: [{ text: "Yes" }, { text: "No" }],
    },
  });

  const { fields, append, prepend, remove, swap, move, insert } =
    useFieldArray<CreateQuestionInputType>({
      name: "options",
      control,
    });

  const { mutate, isLoading, data } = trpc.useMutation(["questions.create"], {
    onSuccess: (data) => {
      router.push(`/question/${data.id}`);
    },
  });

  if (isLoading || data || !session) return <Loading />;

  return (
    <>
      <header className="p-4 flex w-full justify-between items-center">
        <Link href="/">
          <a className="text-4xl font-bold">Pollify</a>
        </Link>
      </header>
      <div className="max-w-xl mx-auto py-12 md:max-w-2xl">
        <h2 className="text-2xl font-bold">Create a new poll</h2>

        <form
          onSubmit={handleSubmit((data) => {
            mutate(data);
          })}
          className="w-full"
        >
          <div className="mt-8 w-full">
            <div className="form-control my-10 w-full">
              <label className="label">
                <span className="label-text font-semibold text-base">
                  Your Question
                </span>
              </label>
              <input
                {...register("question")}
                type="text"
                className="input input-bordered w-full block text-gray-300 rounded-md"
                placeholder="Are you subscribed to Graphify?"
              />
              {errors.question && (
                <p className="text-red-400">{errors.question.message}</p>
              )}
            </div>
            <div className="grid grid-cols-1 w-full gap-x-5 gay-y-3 md:grid-cols-2">
              {fields.map((field, index) => (
                <div key={index}>
                  <section className="flex items-center space-x-3">
                    <input
                      defaultValue="name"
                      {...register(`options.${index}.text`, {
                        required: true,
                      })}
                      className="input input-bordered w-full text-gray-300 font-medium rounded-md"
                    ></input>
                    <button type="button" onClick={() => remove(index)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-neutral-content"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </section>
                </div>
              ))}
            </div>
            <div className="flex items-center my-3">
              <button
                type="button"
                value="Add more options"
                className="btn btn-ghost"
                onClick={() => append({ text: "Another Option" })}
              >
                Add options
              </button>
            </div>
            <div className="w-full mt-10">
              <input
                type="submit"
                className="btn btn-outline rounded-md w-full"
                value="Create question"
              />
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
