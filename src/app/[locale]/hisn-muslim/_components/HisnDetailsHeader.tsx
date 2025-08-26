"use client";
import React, { useCallback, useMemo } from "react";
import {
  getItemCountText,
  hisnCategoryIconMap,
  hisnUnitMap,
} from "@/lib/utils/hisn";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "@/i18n/navigation";
import { useAppDispatch } from "@/lib/store/hooks";
import { AthkarSlug, resetCustomAthkar } from "@/lib/store/slices/athkar-slice";
import { RiResetLeftFill } from "react-icons/ri";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface HisnDetailsHeaderProps {
  categoryName: string;
  totalCount: number;
  categorySlug: AthkarSlug;
  goToFirstCard: () => void;
}

const HisnDetailsHeader = ({
  categoryName,
  totalCount,
  categorySlug,
  goToFirstCard,
}: HisnDetailsHeaderProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const units = hisnUnitMap[categorySlug] || {
    singular: "عنصر",
    dual: "عنصران",
    plural: "عناصر",
  };
  const Icon = useMemo(
    () => hisnCategoryIconMap[categorySlug] || hisnCategoryIconMap.default,
    [categorySlug]
  );

  const handleResetCount = useCallback(() => {
    dispatch(resetCustomAthkar(categorySlug));
    goToFirstCard();
    toast.success("تمت إعادة تعيين جميع العدادات بنجاح");
  }, [dispatch, categorySlug, goToFirstCard]);

  const handleGoBack = useCallback(() => {
    router.push("/hisn-muslim");
  }, [router]);

  return (
    <header className="my-10 relative">
      <AlertDialog>
        <AlertDialogTrigger
          asChild
          className="cursor-pointer absolute left-4 top-4"
        >
          <RiResetLeftFill size={24} />
        </AlertDialogTrigger>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader className="!text-right">
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم إعادة ضبط تقدمك في هذه المجموعة من الأذكار. لا يمكن التراجع
              عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col-reverse sm:flex-row sm:justify-start">
            <AlertDialogCancel className="cursor-pointer">
              إلغاء
            </AlertDialogCancel>
            <AlertDialogAction
              className="cursor-pointer"
              onClick={handleResetCount}
            >
              نعم، إعادة الضبط
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* <div
        title="إعادة تعيين جميع العدادات"
        aria-label="إعادة تعيين جميع العدادات"
        onClick={handleResetCount}
        className="cursor-pointer absolute left-4 top-4"
      >
        <RiResetLeftFill size={24} />
      </div> */}
      <div
        onClick={handleGoBack}
        className="cursor-pointer absolute right-4 top-4 bg-secondary shadow-md w-10 h-10 rounded-full flex items-center justify-center z-20"
      >
        <FaArrowLeft />
      </div>
      <div className="bg-card p-6 rounded-xl shadow-lg text-center pt-16">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 text-white gradient-purple rounded-full flex items-center justify-center shadow-lg border-4 border-card">
          <Icon />
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold ">
          {categoryName}
        </h1>
        <p className="text-slate-500 mt-1">
          {getItemCountText(totalCount, units)}
        </p>
      </div>
    </header>
  );
};

export default HisnDetailsHeader;
