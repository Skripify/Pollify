import * as trpc from "@trpc/server";
import { z } from "zod";
import { prisma } from "../utils/prisma";

export const voteRouter = trpc
  .router()
  .mutation("add", {
    input: z.object({
      id: z.string(),
      choice: z.number(),
      token: z.string(),
    }),
    async resolve({ input }) {
      await prisma.vote.create({
        data: {
          questionId: input.id,
          voterToken: input.token,
          choice: input.choice,
        },
      });

      return await prisma.vote.groupBy({
        where: {
          questionId: input.id,
        },
        by: ["choice"],
        _count: true,
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
      return count > 0;
    },
  });
