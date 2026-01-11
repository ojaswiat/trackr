import { getLocalTimeZone, today } from "@internationalized/date";

const thisDay = today(getLocalTimeZone());
const thisDate = new Date(thisDay.toString());

console.info(thisDate.toISOString());
