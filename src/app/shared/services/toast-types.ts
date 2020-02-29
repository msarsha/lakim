export enum ToastTypes {
  SWAP_REJECTED,
  SWAP_CANCELED,
  NOT_APPROVED,
  APPOINTMENT_CANCELED
}

const DURATION = 3000;

export const ToastConfigs = {
  [ToastTypes.NOT_APPROVED]: {
    message: 'אינך מאושר - פנה לבעל העסק',
    duration: DURATION,
    buttons: [
      {
        role: 'cancel',
        text: 'טוב'
      }
    ]
  },
  [ToastTypes.APPOINTMENT_CANCELED]: {
    message: 'התור בוטל בהצלחה',
    duration: DURATION,
    buttons: [
      {
        role: 'cancel',
        text: 'טוב'
      }
    ]
  },
  [ToastTypes.SWAP_REJECTED]: {
    message: 'הבקשה נדחתה',
    duration: DURATION,
    buttons: [
      {
        role: 'cancel',
        text: 'טוב'
      }
    ]
  },
  [ToastTypes.SWAP_REJECTED]: {
    message: 'הבקשה בוטלה',
    duration: DURATION,
    buttons: [
      {
        role: 'cancel',
        text: 'טוב'
      }
    ]
  }
};
