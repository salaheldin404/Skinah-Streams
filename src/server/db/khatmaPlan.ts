import { prisma } from "@/lib/prisma";
import { KhatmaPlan } from "@/types/khatma";

export const getKhatmaPlans = async (userId: string): Promise<KhatmaPlan[]> => {
  const plans = await prisma.khatmaPlan.findMany({
    where: { userId },
    orderBy: [{ isActive: "desc" }, { createdAt: "desc" }],
  });

  return plans.map((plan) => ({
    ...plan,
    startDate: plan.startDate.toISOString(),
    targetEndDate: plan.targetEndDate.toISOString(),
    completedAt: plan.completedAt?.toISOString() ?? null,
    createdAt: plan.createdAt.toISOString(),
    updatedAt: plan.updatedAt.toISOString(),
    pausedAt: plan.pausedAt?.toISOString() ?? null,
  }));
};
// ["khatma-list"],
// { revalidate: 3600, tags: ["khatmaPlans"] },

export const getKhatmaPlan = async (
  userId: string,
): Promise<KhatmaPlan | null> => {
  const plan = await prisma.khatmaPlan.findFirst({
    where: { userId, isCompleted: false },
  });
  if (!plan) return null;

  return {
    ...plan,
    startDate: plan.startDate.toISOString(),
    targetEndDate: plan.targetEndDate.toISOString(),
    completedAt: plan.completedAt?.toISOString() ?? null,
    createdAt: plan.createdAt.toISOString(),
    updatedAt: plan.updatedAt.toISOString(),
    pausedAt: plan.pausedAt?.toISOString() ?? null,
  };
};

export const getKhatmaPlanById = async (
  planId: string,
): Promise<KhatmaPlan | null> => {
  const plan = await prisma.khatmaPlan.findUnique({
    where: { id: planId },
  });
  if (!plan) return null;

  return {
    ...plan,
    startDate: plan.startDate.toISOString(),
    targetEndDate: plan.targetEndDate.toISOString(),
    completedAt: plan.completedAt?.toISOString() ?? null,
    createdAt: plan.createdAt.toISOString(),
    updatedAt: plan.updatedAt.toISOString(),
    pausedAt: plan.pausedAt?.toISOString() ?? null,
  };
};
