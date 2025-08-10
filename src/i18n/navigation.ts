import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

export const localePrefix = "always"; // or 'as-needed'

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
