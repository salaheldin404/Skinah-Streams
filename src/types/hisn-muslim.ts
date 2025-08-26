import { AthkarSlug } from "@/lib/store/slices/athkar-slice";

export interface HisnData {
  // category: string;
  count: string;
  description?: string;
  reference?: string;
  content: string;
}
export interface Hisn {
  categoryName: string;
  slug: AthkarSlug;
  items: HisnData[];
}
