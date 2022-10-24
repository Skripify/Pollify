import * as trpc from "@trpc/server";
import { z } from "zod";
import { prisma } from "../utils/prisma";

export const voteRouter = trpc
  .router()
  .mutation("add", {
    input: z.object({
      id: z.string(),
      choice: z.string(),
      token: z.string(),
    }),
    async resolve({ input }) {
      const question = await prisma.pollQuestion.findFirst({
        where: {
          id: input.id,
        },
      });
      return await prisma.vote.create({
        data: {
          questionId: input.id,
          voterToken: input.token,
          choice: (question?.options as string[])?.findIndex(
            (v) => v.toLowerCase() === input.choice.toLowerCase()
          ),
        },
      });
    },
  })
  .query("check", {
    input: z.object({
      id: z.string(),
      question: z.string(),
    }),
    async resolve({ input }) {
      const count = await prisma.vote.count({
        where: {
          voterToken: input.id,
          questionId: input.question,
        },
      });
      console.log(count);
      return count > 0;
    },
  });
