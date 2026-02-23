import { authOptions } from "@/lib/auth";
import { getKhatmaPlan } from "@/server/db/khatmaPlan";
import { getServerSession } from "next-auth";
import KhatmaCardClient from "./KhatmaCardClient";

const RecentKhatma = async () => {
  const session = await getServerSession(authOptions);

  // Only fetch if authenticated
  if (!session?.user?.id) return null;

  const khatma = await getKhatmaPlan(session.user.id);
  // No active plan — render nothing so the grid fills gracefully
  if (!khatma || khatma.isCompleted) return null;

  return <KhatmaCardClient plan={khatma} />;
};

export default RecentKhatma;
