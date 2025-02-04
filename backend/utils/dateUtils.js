export function getISOWeek(date) {
    const tmpDate = new Date(date.getTime());
    tmpDate.setHours(0, 0, 0, 0);
    tmpDate.setDate(tmpDate.getDate() + 4 - (tmpDate.getDay() || 7));
    const yearStart = new Date(tmpDate.getFullYear(), 0, 1);
    const weekNo = Math.ceil((((tmpDate - yearStart) / 86400000) + 1) / 7);
    return [weekNo, tmpDate.getFullYear()];
  }
  