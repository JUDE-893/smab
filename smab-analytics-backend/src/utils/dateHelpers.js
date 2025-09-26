import AppError from './AppError.js';

/**
 * Parses a time range string into a start and end Date object in UTC.
 *
 * @param {string} timeRange - A comma-separated string of two dates in `YYYY-MM-DD` format. ex : "2023-01-01,2023-01-31"
 * @throws {AppError} If `timeRange` is missing, incorrectly formatted, or contains invalid dates.
 * @returns {{ startDate: Date, endDate: Date }} An object containing the parsed start and end dates. ex : {startDate: 2023-01-01T00:00:00.000Z, endDate: 2023-01-31T23:59:59.999Z}
 */
export function getTimeRange(timeRange) {
  if (!timeRange) {
    throw new AppError(
      'timeRange query param is required. Expected format: date1,date2 (YYYY-MM-DD,YYYY-MM-DD)',
      400
    );
  }

  const dates = String(timeRange).split(',').map((d) => d.trim());
  if (dates.length !== 2 || !dates[0] || !dates[1]) {
    throw new AppError('Invalid timeRange. Expected two dates separated by a comma.', 400);
  }

  // Create inclusive day range in UTC
  const startDate = new Date(dates[0]);
  const endDate = new Date(dates[1]);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new AppError('Invalid date format. Use YYYY-MM-DD.', 400);
  }

  startDate.setUTCHours(0, 0, 0, 0);
  endDate.setUTCHours(23, 59, 59, 999);

  return { startDate, endDate };
}
