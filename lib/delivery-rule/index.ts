const DELIVERY_DAYS = [3, 5, 6];

const ITEMS = [
  "8BP061",
  "8BP041",
  "8BP04",
  "8BP03",
  "8BL001",
  "8BB09",
  "8BB08",
  "8BB07",
  "8BB053",
  "8BB051",
  "8BB05",
  "8BB04",
  "8BB028",
  "8BB013",
  "8BB012",
  "8BB011",
  "8BB010",
  "8BB01",
];

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function getNextDeliveryLabel(itemCode: string) {
  const isMatched = ITEMS.some(
    (code) => code.toLowerCase() === itemCode.toLowerCase(),
  );

  if (!isMatched) {
    return null;
  }

  const today = new Date();
  const currentDay = today.getDay();

  for (let i = 0; i < 14; i++) {
    const day = (currentDay + i) % 7;

    if (DELIVERY_DAYS.includes(day)) {
      const nextDate = new Date(today);

      nextDate.setDate(today.getDate() + i);

      return {
        dayName: DAY_NAMES[day],
        date: nextDate,
        formattedDate: nextDate.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
      };
    }
  }

  return null;
}
