import OfflineExperience from "./_components/OfflineExperience";
export const dynamic = "force-static";

export function generateStaticParams() {
  return [{ locale: "ar" }, { locale: "en" }];
}
export default function OfflinePage() {
  return <OfflineExperience />;
}
