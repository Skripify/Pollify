import { createQuestionValidator } from "@/utils/createQuestionValidator";
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
          ownerToken: input?.id,
        },
      });
    },
  })
  .query("isOwner", {
    input: z.object({
      id: z.string().nullish(),
      question: z.string(),
    }),
    async resolve({ input }) {
      return await prisma.pollQuestion.findFirst({
        where: {
          id: input.question,
          ownerToken: {
            equals: input.id,
          },
        },
      });
    },
  })
  .query("getOne", {
    input: z.string(),
    async resolve({ input }) {
      return await prisma.pollQuestion.findFirst({
        where: {
          id: input,
        },
      });
    },
  })
  .mutation("create", {
    input: createQuestionValidator,
    async resolve({ input }) {
      return await prisma.pollQuestion.create({
        data: {
          ownerToken: input.id,
          question: input.question,
          options: input.options,
        },
      });
    },
  })
  .mutation("delete", {
    input: z.string(),
    async resolve({ input }) {
      return await prisma.pollQuestion.delete({
        where: {
          id: input,
        },
      });
    },
  })
  .query("getVotes", {
    input: z.string(),
    async resolve({ input }) {
      return await prisma.vote.groupBy({
        where: {
          questionId: input,
        },
        by: ["choice"],
        _count: true,
      });
    },
  });
