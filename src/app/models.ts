export interface Costumer {
  name: string;
  id?: string;
  email: string;
  approved?: boolean;
}

export interface TimeRange {
  from: string;
  to: string;
}

export interface Settings {
  appointmentTime: number;
  workingHours: TimeRange;
  workingDays: number[];
}
