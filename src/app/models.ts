export interface HoursMinutesPair {
  hours: number | string;
  minutes: number | string;
}

export interface WorkingHours {
  from?: HoursMinutesPair | string;
  to?: HoursMinutesPair | string;
}

export interface Customer {
  name: string;
  id: string;
  email: string;
  phone: string;
  approved?: boolean;
  isAdmin?: boolean;
}

export interface Settings {
  appointmentTime: number;
  workingHours: WorkingHours;
  workingDays: number[];
}

export interface Appointment {
  id?: string;
  length?: number;
  date?: Date;
  uid?: string;
  name?: string;
  phone?: string;
}
