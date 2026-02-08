export const todayISO = () => new Date().toISOString().slice(0, 10);

export const diffDaysFromToday = (isoDate: string) => {
  const today = new Date();
  const target = new Date(isoDate);
  const diff = today.getTime() - target.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};
