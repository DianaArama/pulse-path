export interface DatedStressCheckIn {
  recordDate: string;
}

export function replaceStressCheckInForDate<T extends DatedStressCheckIn>(
  checkIns: readonly T[],
  updatedCheckIn: T,
): T[] {
  const existingIndex = checkIns.findIndex(
    (checkIn) => checkIn.recordDate === updatedCheckIn.recordDate,
  );

  if (existingIndex === -1) return [...checkIns, updatedCheckIn];

  return checkIns.map((checkIn, index) =>
    index === existingIndex ? updatedCheckIn : checkIn,
  );
}
