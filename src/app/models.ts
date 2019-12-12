export interface HoursMinutesPair {
  hours: number;
  minutes: number;
}

export interface WorkingHours {
  from?: HoursMinutesPair | string;
  to?: HoursMinutesPair | string;
}

export interface Customer {
  name: string;
  id?: string;
  email: string;
  approved?: boolean;
}

export interface Settings {
  appointmentTime: number;
  workingHours: WorkingHours;
  workingDays: number[];
}
