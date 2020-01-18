export enum ToastTypes {
  NOT_APPROVED,
  APPOINTMENT_CANCELED
}

export const ToastConfigs = {
  [ToastTypes.NOT_APPROVED]: {
    message: 'אינך מאושר - פנה לבעל העסק',
    duration: 3000,
    buttons: [
      {
        role: 'cancel',
        text: 'טוב'
      }
    ]
  },
  [ToastTypes.APPOINTMENT_CANCELED]: {
    message: 'התור בוטל בהצלחה',
    duration: 3000,
    buttons: [
      {
        role: 'cancel',
        text: 'טוב'
      }
    ]
  }
};
