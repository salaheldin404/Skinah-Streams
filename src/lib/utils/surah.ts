export const getGradientClass = (number: number) => {
  const gradients = [
    "gradient-green",
    "gradient-blue",
    "gradient-purple",
    "gradient-orange",
    "gradient-teal",
    "gradient-rose",
    "gradient-amber",
    "gradient-emerald",
  ];
  return gradients[number % gradients.length];
};

export const getGradientOverlayClass = (number: number) => {
  const overlays = [
    "from-green-500/20",
    "from-blue-600/20",
    "from-purple-600/20",
    "from-orange-500/20",
    "from-teal-600/20",
    "from-rose-600/20",
    "from-amber-500/20",
    "from-emerald-600/20",
  ];
  return overlays[number % overlays.length];
};
export const toArabicNumber = (num: number) => {
  const arabicNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return String(num)
    .split("")
    .map((digit) => arabicNumbers[parseInt(digit)])
    .join("");
};
