/**
 * Formats a given date into a localized string based on the specified options.
 *
 * @param dateString - The date to be formatted.
 * @returns A string representing the formatted date in 'en-IN' locale.
 *
 * The formatted date includes:
 * - Day: Numeric
 * - Month: Short (e.g., Jan, Feb)
 * - Year: Numeric
 * - Hour: Numeric (12-hour format)
 * - Minute: Numeric
 * - Hour12: true (AM/PM)
 */
const formatDate = (dateString: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };

  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', options);
};

/**
 * Formats a given date to a string with no time component.
 * The formatted date string will be in the format "dd-MMM-yyyy" (e.g., "01-Jan-2023").
 *
 * @param dateString - The date to format. It should be a valid Date object.
 * @returns The formatted date string in "dd-MMM-yyyy" format.
 */
const formatDateNoTime = (dateString: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  };

  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', options);
};

/**
 * Formats a given date into a string with the format 'DD/MM/YYYY, hh:mm AM/PM'.
 * The date is formatted using the 'en-IN' locale.
 *
 * @param dateString - The date to format.
 * @returns The formatted date string with slashes and time in 12-hour format.
 *
 * @example
 * ```typescript
 * const formattedDate = formatDateSlash(new Date('2023-10-05T14:48:00'));
 * console.log(formattedDate); // Output: "05/10/2023, 02:48 PM"
 * ```
 */
const formatDateSlash = (dateString: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };

  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', options).replace(/-/g, '/');
};

/**
 * Formats a given date into a string with the format "DD/MM/YYYY".
 *
 * @param dateString - The date to be formatted.
 * @returns A string representing the formatted date in "DD/MM/YYYY" format.
 */
const formatDateSlashNoTime = (dateString: Date): string => {
  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', options).replace(/-/g, '/');
};

export {
  formatDate as formatD,
  formatDateNoTime as formatDNT,
  formatDateSlash as formatDS,
  formatDateSlashNoTime as formatDSNT,
};
