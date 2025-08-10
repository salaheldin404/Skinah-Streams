export const normalizeArabic = (str?: string) => {
  if (!str) return "";
  return str.normalize("NFD").replace(/\p{M}/gu, "");
};
