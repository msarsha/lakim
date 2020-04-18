import {HoursMinutesPair, WorkingHours} from '../models';

/// convert pair in UTC to local hours pair
export const fromUTCPair = (utcPair: HoursMinutesPair): HoursMinutesPair => {
  const timeOffsetMinutes = new Date().getTimezoneOffset();
  const timeOffsetHours = timeOffsetMinutes / 60;

  return {
    booked: utcPair.booked,
    hours: Number(utcPair.hours) - timeOffsetHours,
    minutes: utcPair.minutes
  };
};

export const fromUTCWorkingHours = (workingHours: WorkingHours): WorkingHours => {
  const from = fromUTCPair(workingHours.from as HoursMinutesPair);
  const to = fromUTCPair(workingHours.to as HoursMinutesPair);

  return {
    from,
    to
  };
};
