export const toIsoString = (value: Date | string): string => {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
};

export const toBoolean = (value: boolean | number): boolean => {
  return Boolean(value);
};
