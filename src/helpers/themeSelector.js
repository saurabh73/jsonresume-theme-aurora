export default function () {
  console.log(process.env);
  return `theme-${process.env.THEME_NO}`;
};