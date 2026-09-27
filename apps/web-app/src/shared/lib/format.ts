import dayjs from "dayjs";

export const formatDate = (value: string) =>
  dayjs(value).format("ddd, MMM D, YYYY · h:mm A");

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
export const formatMoney = (value: number) => currency.format(value);
