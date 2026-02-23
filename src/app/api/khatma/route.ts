import { authOptions } from "@/lib/auth";
import { TOTAL_QURAN_PAGES } from "@/lib/constants/khatma";
import { prisma } from "@/lib/prisma";
import { calculateDaysAndTarget } from "@/lib/utils/khatma";
import { getKhatmaSchema } from "@/lib/validations/khatmaSchema";
import { getServerSession } from "next-auth";
import { getLocale, getTranslations } from "next-intl/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

const unauthorized = () =>
  NextResponse.json({ error: "Unauthorized" }, { status: 401 });

const serverError = (action: string, error: unknown) => {
  console.error(`Error ${action} khatma plan:`, error);
  return NextResponse.json(
    { error: "Internal Server Error" },
    { status: 500 },
  );
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return unauthorized();

    const plans = await prisma.khatmaPlan.findMany({
      where: { userId: session.user.id },
      orderBy: [{ isActive: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(plans, { status: 200 });
  } catch (error) {
    return serverError("fetching", error);
  }
}

export async function POST(request: Request) {
  try {
    const locale = await getLocale();
    const t = await getTranslations({ locale, namespace: "KhatmaValidation" });
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return unauthorized();

    // Only one plan allowed at a time
    const existing = await prisma.khatmaPlan.findFirst({
      where: { userId: session.user.id },
    });
    if (existing) {
      return NextResponse.json(
        { error: "An active Khatma plan already exists." },
        { status: 400 },
      );
    }

    // Validate input
    const body = await request.json();
    const validation = getKhatmaSchema(t).safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation Error", details: validation.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { pagesPerDay, title, notes } = validation.data;
    const startDate = new Date();
    const { targetDate } = calculateDaysAndTarget(pagesPerDay, TOTAL_QURAN_PAGES);

    const newPlan = await prisma.khatmaPlan.create({
      data: {
        userId: session.user.id,
        pagesPerDay,
        totalPages: TOTAL_QURAN_PAGES,
        startDate,
        targetEndDate: targetDate,
        title: title || null,
        notes: notes || null,
      },
    });

    revalidateTag("khatmaPlans");
    revalidatePath(`/${locale}/khatma`);
    return NextResponse.json(newPlan, { status: 201 });
  } catch (error) {
    return serverError("creating", error);
  }
}
