export enum ToastTypes {
  NOT_APPROVED
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
  }
};
