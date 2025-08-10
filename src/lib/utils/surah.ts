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
export const toArabicNumber = (num: number) => {
  const arabicNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return String(num)
    .split("")
    .map((digit) => arabicNumbers[parseInt(digit)])
    .join("");
};
