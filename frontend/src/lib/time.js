import moment from "moment";

const TZ_REGEX = /(Z|[+-]\d{2}:\d{2}|[+-]\d{4})$/;

/**
 * Normalize backend timestamps to local time.
 * If the string has no timezone suffix, treat it as UTC.
 */
export function localMoment(value) {
  if (!value) return moment.invalid();
  if (typeof value === "string" && !TZ_REGEX.test(value)) {
    return moment.utc(value).local();
  }
  return moment(value).local();
}
