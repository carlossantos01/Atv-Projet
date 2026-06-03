export const parseDate = (value: string): Date => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error('Data inválida.');
  }

  return date;
};

export const addMinutes = (date: Date, minutes: number): Date => {
  return new Date(date.getTime() + minutes * 60_000);
};

export const isPastDate = (date: Date, now = new Date()): boolean => {
  return date.getTime() < now.getTime();
};

export const hasTimeOverlap = (
  startA: Date,
  endA: Date,
  startB: Date,
  endB: Date
): boolean => {
  return startA.getTime() < endB.getTime() && endA.getTime() > startB.getTime();
};

export const getDayRange = (dateText: string): { start: Date; end: Date } => {
  const [dateOnly] = dateText.split('T');
  const start = parseDate(`${dateOnly}T00:00:00.000`);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return { start, end };
};
