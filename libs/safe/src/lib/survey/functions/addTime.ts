/**
 * Adds time to a certain date
 *
 * @param params the date, the number of units and the unit
 * @returns the new date
 */
const addTime = (params: any[]) => {
  const [dateStr, num, paramUnit] = params;
  const unit = paramUnit.toLowerCase() || 'days';
  if (!dateStr) {
    return null;
  }
  if (!num) {
    return dateStr;
  }

  const date = new Date(dateStr);

  switch (unit) {
    case 'days':
      date.setDate(date.getDate() + num);
      break;
    case 'weeks':
      date.setDate(date.getDate() + num * 7);
      break;
    case 'months':
      date.setMonth(date.getMonth() + num);
      break;
    case 'years':
      date.setFullYear(date.getFullYear() + num);
      break;
    default:
      break;
  }

  return date;
};

export default addTime;
