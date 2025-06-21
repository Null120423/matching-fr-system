export const toDict = <T>(array: T[], key: keyof T): Record<string, T> => {
  return array.reduce(
    (acc, item) => {
      acc[item[key] as string] = item;
      return acc;
    },
    {} as Record<string, T>,
  );
};
