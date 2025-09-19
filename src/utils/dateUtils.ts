import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";

/**
 * Converts a Gregorian date string to Persian date format
 * @param dateString - ISO date string (Gregorian)
 * @returns Persian date string in format "DD MMMM YYYY"
 */
export const formatToPersianDate = (dateString?: string): string => {
  if (!dateString) return "";

  try {
    const gregorianDate = new Date(dateString);
    if (isNaN(gregorianDate.getTime())) return "";

    const persianDate = new DateObject(gregorianDate);
    persianDate.calendar = persian;
    persianDate.locale = persian_fa;

    return persianDate.format("DD MMMM YYYY");
  } catch (error) {
    console.error("Error converting date to Persian:", error);
    return "";
  }
};

/**
 * Converts a Gregorian date string to Persian date with age calculation
 * @param dateString - ISO date string (Gregorian)
 * @returns Persian date string with age in format "DD MMMM YYYY (X سال)"
 */
export const formatToPersianDateWithAge = (dateString?: string): string => {
  if (!dateString) return "";

  try {
    const gregorianDate = new Date(dateString);
    if (isNaN(gregorianDate.getTime())) return "";

    // Calculate age
    const today = new Date();
    let age = today.getFullYear() - gregorianDate.getFullYear();
    const monthDiff = today.getMonth() - gregorianDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < gregorianDate.getDate())
    ) {
      age--;
    }

    // Format Persian date
    const persianDate = new DateObject(gregorianDate);
    persianDate.calendar = persian;
    persianDate.locale = persian_fa;

    const persianDateString = persianDate.format("DD MMMM YYYY");
    return `${persianDateString} (${age} سال)`;
  } catch (error) {
    console.error("Error converting date to Persian with age:", error);
    return "";
  }
};
