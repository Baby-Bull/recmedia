import { TYPE_OF_NOTIFICATIONS } from "src/constants/constants";

export const replaceLabelByTranslate = (message: string, textReplace: string | number) =>
  message.replace("%s", textReplace.toString());

export const notify = (title: string, body: any, image: any) => {
  // eslint-disable-next-line no-new
  new Notification(title, {
    body,
    icon: image,
  });
};

export const customizeContentNotificationBrowser = (
  typeOfNotification: string,
  userName: string,
  postName: string,
  label1: string,
  label2: string,
) => {
  // add labels or other arguments for this function if have more than 2 labels to create string content
  // add other cases to modify notifications's content
  switch (typeOfNotification) {
    case TYPE_OF_NOTIFICATIONS[4]:
      return userName + label1 + postName + label2;
    default:
      return label1;
  }
};
