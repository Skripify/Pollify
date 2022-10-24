import * as trpc from "@trpc/server";
import { z } from "zod";
import { prisma } from "../utils/prisma";

export const questionRouter = trpc
  .router()
  .query("getAll", {
    input: z
      .object({
        id: z.string(),
      })
      .nullish(),
    async resolve({ input }) {
      return await prisma.pollQuestion.findMany({
        where: {
          id: input?.id,
        },
      });
    },
  })
  .mutation("create", {
    input: z.object({
      question: z.string(),
    }),
    async resolve({ input }) {
      return await prisma.pollQuestion.create({
        data: {
          question: input.question,
        },
      });
    },
  });
