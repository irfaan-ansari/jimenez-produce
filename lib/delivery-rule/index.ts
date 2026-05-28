import { addDays, format, isBefore, set } from "date-fns";

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
const ITEM_SET = new Set(ITEMS.map((code) => code.toLowerCase()));

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const DELIVERY_OFFSETS: Record<number, number> = {
  0: 3, // Sunday -> This Wednesday (+3 days)
  2: 8, // Tuesday -> Next Wednesday (+8 days)
  3: 7, // Wednesday -> Next Wednesday (+7 days)
  4: 6, // Thursday -> Next Wednesday (+6 days)
  5: 5, // Friday -> Next Wednesday (+5 days)
  6: 4, // Saturday -> This Wednesday (+4 days)
};

export function getNextDeliveryLabel(itemCode: string, mockDate?: Date) {
  if (!ITEM_SET.has(itemCode.toLowerCase())) {
    return null;
  }

  const now = mockDate || new Date();
  const currentDay = now.getDay();
  let daysToAdd = 0;

  if (currentDay === 1) {
    const mondayCutoff = set(now, {
      hours: 11,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    });

    daysToAdd = isBefore(now, mondayCutoff) ? 2 : 9;
  } else {
    daysToAdd = DELIVERY_OFFSETS[currentDay];
  }

  const deliveryDate = addDays(now, daysToAdd);

  return {
    dayName: DAY_NAMES[deliveryDate.getDay()],
    date: deliveryDate,
    formattedDate: format(deliveryDate, "EEE, MMM d"),
  };
}
