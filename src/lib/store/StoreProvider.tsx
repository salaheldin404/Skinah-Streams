"use client";

import { Provider } from "react-redux";
import { store } from "./store";
import { ReactNode, useEffect } from "react";
import { KhatmaPlan } from "@/types/khatma";
import { setKhatmaData } from "./slices/khatma-slice";
import { getKhatmaRange } from "../utils/khatma";
import { useSession } from "next-auth/react";
import { setIsAuthenticated } from "./slices/sync-slice";

const StoreProvider = ({
  children,
  initialKhatma,
}: {
  children: ReactNode;
  initialKhatma: KhatmaPlan | null;
}) => {
  const session = useSession();

  useEffect(() => {
    if (session.status === "authenticated") {
      store.dispatch(setIsAuthenticated(true));
    } else {
      store.dispatch(setIsAuthenticated(false));
    }
  }, [session.status]);
  useEffect(() => {
    if (initialKhatma) {
      const range = getKhatmaRange(
        initialKhatma.currentPage,
        initialKhatma.pagesPerDay,
      );
      store.dispatch(
        setKhatmaData({
          bookmarkIndex: initialKhatma.bookMarkIndex ?? 0,
          pagesRange: range,
          khatmaId: initialKhatma.id,
          isKhatmaActive: initialKhatma.isActive,
        }),
      );
    }
  }, [initialKhatma]);

  return <Provider store={store}>{children}</Provider>;
};
export default StoreProvider;
