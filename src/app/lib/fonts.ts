import { useLanguage } from "../i18n";

export function useFonts() {
  const { isArabic } = useLanguage();
  const fontBody = isArabic ? "'Baloo Bhaijaan 2', 'Hacen Algeria', sans-serif" : "'Space Grotesk', sans-serif";
  const fontMono = isArabic ? "'Baloo Bhaijaan 2', 'Hacen Algeria', sans-serif" : "'Space Mono', monospace";
  return { fontBody, fontMono };
}
