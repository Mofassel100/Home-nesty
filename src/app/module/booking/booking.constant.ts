export const generateBookingNumber = (): string => {
  const number = Math.floor(10000000 + Math.random() * 90000000);

  return `BK-${number}`;
};