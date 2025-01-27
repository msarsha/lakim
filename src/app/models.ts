export interface HoursMinutesPair {
  hours: number | string;
  minutes: number | string;
  booked?: boolean;
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
  devices?: string[];
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
  canCancel?: boolean;
}

export interface Swap {
  id: string;
  appointment: Appointment;
  swapWith: Appointment;
  createDate: number | Date;
  approved?: boolean;
  isRejected?: boolean;
}
