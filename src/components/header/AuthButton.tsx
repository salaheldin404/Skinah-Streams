"use client";

import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppDispatch } from "@/lib/store/hooks";
import { resetToDefaultState } from "@/lib/store/root-actions";
import { cancelPendingSave } from "@/lib/store/store";
import { useCallback } from "react";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";

const AuthButton = () => {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();
  const locale = useLocale()
  const t = useTranslations("AuthButton");

  const handleLogout = useCallback(() => {
    // 1. Cancel any pending debounced save to prevent stale data
    //    from being written to the DB after sign-out.
    cancelPendingSave();

    // 2. Clear localStorage so the next guest session starts fresh.
    localStorage.removeItem("userSettings");

    // 3. Reset Redux store to initial defaults.
    dispatch(resetToDefaultState());

    // 4. Sign out via NextAuth (redirects to "/").
    signOut({ callbackUrl: "/" });
  }, [dispatch]);

  if (status === "loading") {
    return (
      <Button 
        variant="ghost" 
        size="icon" 
        disabled
        className="h-8 w-8 rounded-full"
        aria-label="Loading..."
      >
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    );
  }

  if (status === "authenticated" && session?.user) {
    const { user } = session;
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="relative h-8 w-8 rounded-full
                       hover:ring-2 hover:ring-primary/20
                       transition-all duration-200
                       focus-visible:ring-2 focus-visible:ring-primary
                       active:scale-95"
            aria-label="User menu"
          >
            <Avatar className="h-8 w-8 border-2 border-transparent hover:border-primary/20 transition-colors">
              <AvatarImage
                src={user.image || ""}
                alt={user.name || "User"}
              />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {user.name?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-48 p-2"
        
        >
          <DropdownMenuItem 
            onClick={handleLogout}
            className="cursor-pointer min-h-[25px] rounded-md
                       focus:bg-destructive/10 focus:text-destructive
                       transition-colors"
                       dir={locale === "ar" ? "rtl" : "ltr"}
          >
            {t("sign-out")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Link href="/auth/signin" className="w-full min-[500px]:w-auto">
      <Button 
        variant="outline" 
        className="cursor-pointer w-full min-[500px]:w-auto
                   min-h-[36px] px-4
                   hover:bg-primary/5 hover:border-primary/50
                   active:scale-95
                   transition-all duration-200
                   focus-visible:ring-2 focus-visible:ring-primary
                   text-sm font-medium"
        size="sm"
      >
        {t("sign-in")}
      </Button>
    </Link>
  );
};

export default AuthButton;
