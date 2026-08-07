/**
 * Solar event calculations based on the NOAA sunrise equation.
 *
 * All times are returned as JavaScript Date objects in UTC; formatting into a
 * local wall-clock time is left to the caller so that daylight saving is
 * handled by the Intl API rather than by hand.
 */

const RAD = Math.PI / 180;
const J2000 = 2451545.0;
const EARTH_TILT = 23.4397;

/** Sun altitude in degrees that defines each phase boundary. */
export const ALTITUDE = {
  civilTwilight: -6,
  blueHourEdge: -4,
  horizon: -0.833,
  goldenHourEdge: 6,
};

export type SunTimes = {
  blueHourMorningStart: Date | null;
  blueHourMorningEnd: Date | null;
  sunrise: Date | null;
  goldenHourMorningEnd: Date | null;
  solarNoon: Date;
  goldenHourEveningStart: Date | null;
  sunset: Date | null;
  blueHourEveningStart: Date | null;
  blueHourEveningEnd: Date | null;
  daylightMinutes: number | null;
};

function toJulian(date: Date): number {
  return date.valueOf() / 86400000 - 0.5 + 2440588;
}

function fromJulian(julian: number): Date {
  return new Date((julian + 0.5 - 2440588) * 86400000);
}

type SolarPass = {
  rise: number | null;
  set: number | null;
  transit: number;
};

function solarPass(
  date: Date,
  latitude: number,
  longitude: number,
  altitudeDeg: number
): SolarPass {
  const dayNumber = Math.round(toJulian(date) - J2000 - 0.0009 + longitude / 360);
  const meanSolarNoon = J2000 + 0.0009 - longitude / 360 + dayNumber;

  const meanAnomaly = (357.5291 + 0.98560028 * (meanSolarNoon - J2000)) % 360;
  const anomalyRad = meanAnomaly * RAD;

  const equationOfCentre =
    1.9148 * Math.sin(anomalyRad) +
    0.02 * Math.sin(2 * anomalyRad) +
    0.0003 * Math.sin(3 * anomalyRad);

  const eclipticLongitude = (meanAnomaly + equationOfCentre + 180 + 102.9372) % 360;
  const eclipticRad = eclipticLongitude * RAD;

  const transit =
    meanSolarNoon +
    0.0053 * Math.sin(anomalyRad) -
    0.0069 * Math.sin(2 * eclipticRad);

  const sinDeclination = Math.sin(eclipticRad) * Math.sin(EARTH_TILT * RAD);
  const declination = Math.asin(sinDeclination);

  const cosHourAngle =
    (Math.sin(altitudeDeg * RAD) - Math.sin(latitude * RAD) * sinDeclination) /
    (Math.cos(latitude * RAD) * Math.cos(declination));

  // Outside [-1, 1] the sun never reaches this altitude on this date.
  if (cosHourAngle > 1 || cosHourAngle < -1) {
    return { rise: null, set: null, transit };
  }

  const hourAngle = Math.acos(cosHourAngle) / RAD;
  return {
    rise: transit - hourAngle / 360,
    set: transit + hourAngle / 360,
    transit,
  };
}

function asDate(julian: number | null): Date | null {
  return julian === null ? null : fromJulian(julian);
}

export function getSunTimes(
  date: Date,
  latitude: number,
  longitude: number
): SunTimes {
  const horizon = solarPass(date, latitude, longitude, ALTITUDE.horizon);
  const golden = solarPass(date, latitude, longitude, ALTITUDE.goldenHourEdge);
  const blueEdge = solarPass(date, latitude, longitude, ALTITUDE.blueHourEdge);
  const civil = solarPass(date, latitude, longitude, ALTITUDE.civilTwilight);

  const sunrise = asDate(horizon.rise);
  const sunset = asDate(horizon.set);

  const daylightMinutes =
    sunrise && sunset
      ? Math.round((sunset.valueOf() - sunrise.valueOf()) / 60000)
      : null;

  return {
    blueHourMorningStart: asDate(civil.rise),
    blueHourMorningEnd: asDate(blueEdge.rise),
    sunrise,
    goldenHourMorningEnd: asDate(golden.rise),
    solarNoon: fromJulian(horizon.transit),
    goldenHourEveningStart: asDate(golden.set),
    sunset,
    blueHourEveningStart: asDate(blueEdge.set),
    blueHourEveningEnd: asDate(civil.set),
    daylightMinutes,
  };
}

/** Formats a date as HH:MM in the given IANA time zone. */
export function formatTime(date: Date | null, timeZone = "Europe/Dublin"): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-IE", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

/** Position of a time within its local day, expressed as 0–1. */
export function dayFraction(date: Date | null, timeZone = "Europe/Dublin"): number | null {
  if (!date) return null;
  const parts = new Intl.DateTimeFormat("en-IE", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? "0");
  return (hour * 60 + minute) / 1440;
}

export function formatDuration(minutes: number | null): string {
  if (minutes === null) return "—";
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return hours + "h " + String(rest).padStart(2, "0") + "m";
}
