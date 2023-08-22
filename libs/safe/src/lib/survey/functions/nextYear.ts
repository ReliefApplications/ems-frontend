/** @returns a date object set to next year */
export default () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  return date;
};
