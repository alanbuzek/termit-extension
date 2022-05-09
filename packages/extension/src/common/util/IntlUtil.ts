export function getShortLocale(language: string): string {
  // hardcoded for now, was causing crashes before
  return "cs";
//   const i = language.indexOf("-");
//   if (i > 0) {
//     return language.substring(0, language.indexOf("-"));
//   } else {
//     return language;
//   }
// }

export default {
  getShortLocale,
};
