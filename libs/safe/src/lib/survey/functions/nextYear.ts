/** @returns a date object set to next year */
const nextYear = () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  return date;
};

export default nextYear;
