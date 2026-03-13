"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import KhatmaCompletionContent from "@/components/khatma/KhatmaCompletionContent";
import { useCallback, startTransition } from "react";
import { useRouter } from "@/i18n/navigation";

const KhatmaFinishModal = () => {
  const t = useTranslations("KhatmaFinish");
  const router = useRouter();
  const handleDismiss = useCallback(() => {
    startTransition(() => {
      router.replace("/khatma");
    });
  }, [router]);

  return (
    <Dialog defaultOpen onOpenChange={(open) => !open && handleDismiss()}>
      <DialogContent className="overflow-hidden p-0 max-h-[90vh] lg:!max-w-none !w-[92%] md:!w-[80%] lg:!w-[760px] flex flex-col rounded-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto  flex-1">
          <KhatmaCompletionContent mode="dialog" />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KhatmaFinishModal;
