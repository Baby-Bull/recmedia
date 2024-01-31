export const listThreadsMockData = [
  {
    id: 1,
    avatar: "/assets/images/chat/avatar_1.svg",
    name: "名前がここに入ります",
    messageHide: "text",
    status: 1,
  },
  {
    id: 2,
    avatar: "/assets/images/chat/avatar_2.svg",
    name: "名前がここに入ります",
    messageHide: "text",
    status: 2,
  },
  {
    id: 3,
    avatar: "/assets/images/chat/avatar_3.svg",
    name: "名前がここに入ります",
    messageHide: "text",
    status: 1,
  },
  {
    id: 4,
    avatar: "/assets/images/chat/avatar_4.svg",
    name: "名前がここに入ります",
    messageHide: "テキストテキストテキストテキステキストテキストテキストテキス",
    status: 1,
  },
  {
    id: 5,
    avatar: "/assets/images/chat/avatar_5.svg",
    name: "名前がここに入ります",
    messageHide: "text",
    status: 1,
  },
  {
    id: 6,
    avatar: "/assets/images/chat/avatar_6.svg",
    name: "名前がここに入ります",
    messageHide: "text",
    status: 1,
  },
  {
    id: 7,
    avatar: "/assets/images/chat/avatar_7.svg",
    name: "Tom & 名前がここに入ります",
    messageHide: "text",
    status: 1,
  },
];

export const listMessagesMockData = {
  id: 1,
  name: "名前がここに入ります",
  nameCommunity: "コミュニティ名がここに入りますコミュニティ名がここに入りますコミュニティ名がここに入ります",
  members: 30,
  avatar: "/assets/images/chat/avatar_chat.svg",
  messages: [
    {
      message:
        "先日、条件の記載された内定通知書をいただいたので、後ほどまたメールで送付しておきます。\n\nご確認よろしくお願いいたします。",
      time: "23:54",
      isMe: false,
    },
    {
      message: "了解ですー",
      time: "23:54",
      isMe: true,
    },
    {
      message: "他の企業様の選考いかがされますか？",
      time: "01:54",
      isMe: false,
    },
    {
      message:
        "ちょっと考えさせていただけますか？\n今回の企業は志望度も高くかなりいいなとは思ってるんですが、条件次第ではって感じなので、、、",
      time: "23:54",
      isMe: true,
      hasOption: true,
    },
    {
      message: "承知いたしました！",
      time: "01:58",
      isMe: false,
    },
    {
      message:
        "ちょっと考えさせていただけますか？\n今回の企業は志望度も高くかなりいいなとは思ってるんですが、条件次第ではって感じなので、、、",
      time: "23:54",
      isMe: true,
      isStartOfDay: true,
    },
    {
      message:
        "ちょっと考えさせていただけますか？\n今回の企業は志望度も高くかなりいいなとは思ってるんですが、条件次第ではって感じなので、、、",
      time: "23:54",
      isMe: true,
      isErrorMessage: true,
    },
  ],
};

export const listThreadsCommunityMockData = [
  {
    id: 1,
    avatar: "/assets/images/chat/community_avatar_1.svg",
    name: "コミュニティ名がここに入...　(30)",
    messageHide: "text",
    members: 30,
    status: 1,
  },
  {
    id: 2,
    avatar: "/assets/images/chat/community_avatar_2.svg",
    name: "コミュニティ名がここに...　(1220)",
    messageHide: "text",
    members: 1220,
    status: 2,
  },
];
export const nameUser = "佐藤太郎さんを運営に通報する";
