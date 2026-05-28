import { STRINGS } from "./constants";

export const lookupString = (key) => STRINGS.en[key] || key;

export const getRelativeTimelineStringRepresentation = (isoTimestampString) => {
  const inputDate = new Date(isoTimestampString);
  const now = new Date();
  const dayDiff = Math.floor((now - inputDate) / 86400000);

  if (dayDiff === 0)
    return (
      "Today · " +
      inputDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    );
  if (dayDiff === 1) return "Yesterday";
  if (dayDiff < 7) return `${dayDiff} days ago`;
  return inputDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const getExtendedLongDateRepresentation = (isoTimestampString) =>
  new Date(isoTimestampString).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

export const renderFormattedTimelineHeaderString = () => {
  const h = new Date().getHours();
  if (h < 12) return lookupString("greeting_morning");
  if (h < 17) return lookupString("greeting_afternoon");
  if (h < 21) return lookupString("greeting_evening");
  return lookupString("greeting_night");
};
