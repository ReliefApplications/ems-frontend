/**
 * Converts days, months, years to minutes.
 *
 * @param value number value
 * @param unit days, months, years
 * @returns days in minutes.
 */
export const convertToMinutes = (value: number, unit: string): number => {
  const currentDate = new Date();
  let minutes;

  switch (unit) {
    case 'hours':
      minutes = value * 60;
      break;
    case 'days':
      minutes = value * 24 * 60;
      break;
    case 'weeks':
      minutes = value * 7 * 24 * 60;
      break;
    case 'months':
      const monthsAgo = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - value,
        currentDate.getDate()
      );
      minutes = Math.floor(
        (currentDate.getTime() - monthsAgo.getTime()) / (1000 * 60)
      );
      break;
    case 'years':
      const yearsAgo = new Date(
        currentDate.getFullYear() - value,
        currentDate.getMonth(),
        currentDate.getDate()
      );
      minutes = Math.floor(
        (currentDate.getTime() - yearsAgo.getTime()) / (1000 * 60)
      );
      break;
    default:
      throw new Error(`Unsupported unit: ${unit}`);
  }

  return minutes;
};

export default convertToMinutes;
