export const MONTHS = [
  {
    label: 0,
    value: 0,
  },
  {
    label: 1,
    value: 1,
  },
  {
    label: 2,
    value: 2,
  },
  {
    label: 3,
    value: 3,
  },
  {
    label: 4,
    value: 4,
  },
  {
    label: 5,
    value: 5,
  },
  {
    label: 6,
    value: 6,
  },
  {
    label: 7,
    value: 7,
  },
  {
    label: 8,
    value: 8,
  },
  {
    label: 9,
    value: 9,
  },
  {
    label: 10,
    value: 10,
  },
  {
    label: 11,
    value: 11,
  },
];

export const AUTH_PAGE_PATHS = ["/login", "/register", "/register/form", "/_error"];

const JAPAN_PROVINCES = [
  "北海道",
  "青森県",
  "岩手県",
  "宮城県",
  "秋田県",
  "山形県",
  "福島県",
  "茨城県",
  "栃木県",
  "群馬県",
  "埼玉県",
  "千葉県",
  "東京都",
  "神奈川県",
  "新潟県",
  "富山県",
  "石川県",
  "福井県",
  "山梨県",
  "長野県",
  "岐阜県",
  "静岡県",
  "愛知県",
  "三重県",
  "滋賀県",
  "京都府",
  "大阪府",
  "兵庫県",
  "奈良県",
  "和歌山県",
  "鳥取県",
  "島根県",
  "岡山県",
  "広島県",
  "山口県",
  "徳島県",
  "香川県",
  "愛媛県",
  "高知県",
  "福岡県",
  "佐賀県",
  "長崎県",
  "熊本県",
  "大分県",
  "宮崎県",
  "鹿児島県",
  "沖縄県",
];

export const JAPAN_PROVINCE_OPTIONS = [
  // {
  //   label: "選択してください",
  //   value: "",
  // },
  ...JAPAN_PROVINCES.map((item) => ({
    label: item,
    value: item,
  })),
];

export const PROFILE_JAPAN_PROVINCE_OPTIONS = [
  {
    label: "選択してください",
    value: "",
  },
  ...JAPAN_PROVINCES.map((item) => ({
    label: item,
    value: item,
  })),
];

export const MATCHING_PURPOSE_OPTIONS = [
  {
    label: "選択してください",
    value: "",
  },
  {
    label: "カジュアルにお話ししたい",
    value: "talk-casually",
  },
  {
    label: "技術的な相談がしたい",
    value: "technical-consultation",
  },
  {
    label: "一緒に働けるエンジニアを探している",
    value: "work-with",
  },
  {
    label: "その他",
    value: "other",
  },
];

export const USER_REPORT_OPTIONS = [
  {
    label: "選択してください",
    value: "",
  },
  {
    label: "他の利用者のなりすましをしている",
    value: "impersonate",
  },
  {
    label: "暴言、脅迫、差別的な発言を行っている",
    value: "abuse",
  },
  {
    label: "案件の仲介業者である",
    value: "project-broker",
  },
  {
    label: "その他　",
    value: "other",
  },
];

export const LIMIT_ROOMS_PER_PAGE = 15;
export const LIMIT_MESSAGES_PER_PAGE = 20;

export const MESSAGE_CONTENT_TYPES = {
  TEXT: "text",
  IMAGE: "image",
  FILE: "file",
};

export const REACT_QUERY_KEYS = {
  HOMEPAGE_GET_USER_PROVINCES: "HOMEPAGE_GET_USER_PROVINCES",
  HOMEPAGE_GET_USER_RECENT_LOGIN: "HOMEPAGE_GET_USER_RECENT_LOGIN",
  HOMEPAGE_GET_USER_NEW_MEMBERS: "HOMEPAGE_GET_USER_NEW_MEMBERS",
  HOMEPAGE_GET_USER_FAVORITE_TAGS: "HOMEPAGE_GET_USER_FAVORITE_TAGS",
  HOMEPAGE_GET_USER_STATS: "HOMEPAGE_GET_USER_STATS",
  LIST_ROOMS: "PERSONAL_AND_COMMUNITY_CHAT_ROOMS",
  LIST_NOTIFICATIONS: "LIST_NOTIFICATIONS",

  HANDLE_SETTING_USER_FAVORITE: "HANDLE_SETTING_USER_FAVORITE",

  PERSONAL_CHAT: {
    LIST_CHAT_ROOMS_FIRST: "PERSONAL_CHAT_LIST_CHAT_ROOMS_FIRST",
    LIST_CHAT_ROOMS: "PERSONAL_CHAT_LIST_CHAT_ROOMS",
    LIST_MESSAGES: "PERSONAL_CHAT_LIST_MESSAGES",
  },
  COMMUNITY_CHAT: {
    LIST_CHAT_ROOMS_FIRST: "COMMUNITY_CHAT_LIST_CHAT_ROOMS_FIRST",
    LIST_CHAT_ROOMS: "COMMUNITY_CHAT_LIST_CHAT_ROOMS",
    LIST_MESSAGES: "COMMUNITY_CHAT_LIST_MESSAGES",
  },
};

export const STATUS_OPTIONS = [
  {
    label: "選択してください",
    value: "",
  },
  {
    label: "今すぐ話せます",
    value: "can-talk",
  },
  {
    label: "友達募集しています",
    value: "looking-for-friend",
  },
  {
    label: "相談に乗って欲しいです",
    value: "need-consult",
  },
];

export const MY_PROFILE_STATUS_OPTIONS = [
  {
    label: "今すぐ話せます",
    value: "can-talk",
  },
  {
    label: "友達募集しています",
    value: "looking-for-friend",
  },
  {
    label: "相談に乗って欲しいです",
    value: "need-consult",
  },
];

export const JOBS = [
  {
    label: "職種",
    value: "",
  },
  {
    label: "フロントエンドエンジニア",
    value: "frontend",
  },
  {
    label: "バックエンドエンジニア",
    value: "backend",
  },
  {
    label: "データサイエンティスト",
    value: "data-scientist",
  },
  {
    label: "プロジェクトマネージャー",
    value: "project-manager",
  },
  {
    label: " プロジェクトリーダー",
    value: "project-leader",
  },
  {
    label: "テストエンジニア",
    value: "test-engineer",
  },
  {
    label: "データベースエンジニア",
    value: "database-engineer",
  },
  {
    label: "セキュリティエンジニア",
    value: "security-engineer",
  },
  {
    label: "インフラエンジニア",
    value: "infrastructure-engineer",
  },
  {
    label: "ネットワークエンジニア",
    value: "network-engineer",
  },
  {
    label: "サーバーエンジニア",
    value: "server-engineer",
  },
  {
    label: "サポートエンジニア",
    value: "support-engineer",
  },
  {
    label: "ヘルプデスク",
    value: "help-desk",
  },
  {
    label: "マークアップエンジニア",
    value: "markup-engineer",
  },
  {
    label: "モバイルアプリエンジニア ",
    value: "mobile-engineer",
  },
];

export const EMPLOYEE_STATUS = [
  {
    label: "雇用状態",
    value: "",
  },
  {
    label: "正社員",
    value: "fulltime",
  },
  {
    label: "契約社員",
    value: "contract",
  },
  {
    label: "派遣社員",
    value: "temporary",
  },
  {
    label: "フリーランス",
    value: "freelance",
  },
  {
    label: "社長",
    value: "president",
  },
  {
    label: "役員",
    value: "officer",
  },
  {
    label: " 転職活動中",
    value: "part-time",
  },
  {
    label: "アルバイト",
    value: "intern",
  },
  {
    label: "インターン",
    value: "during-job-change",
  },
];

export const LEVELS = [
  {
    label: "触れた程度",
    value: 1,
  },
  {
    label: "独学で経験あり",
    value: 2,
  },
  {
    label: "他者に補助を受けながらコーディングが可能",
    value: 3,
  },
  {
    label: "独力でコーディング可能",
    value: 4,
  },
  {
    label: "他者のコードをレビュー可能",
    value: 5,
  },
];

export const ENGLISH_LEVEL_OPTIONS = [
  {
    label: "選択してください",
    value: "",
  },
  {
    label: "ネイティブ ",
    value: "native_speaker",
  },
  {
    label: "ビジネス会話レベル",
    value: "communicate_at_work",
  },
  {
    label: "日常会話レベル",
    value: "day_communication",
  },
  {
    label: "話せない",
    value: "can_not_use",
  },
];

export const TEXT_ENGLISH_LEVEL_OPTIONS = {
  native_speaker: { label: "ネイティブ" },
  communicate_at_work: { label: "ビジネス会話レベル" },
  day_communication: { label: "日常会話レベル" },
  can_not_use: { label: "話せない" },
};

export const TYPE_OF_NOTIFICATIONS = [
  "new_matching_request",
  "matching_request_accepted",
  "new_community_join_request",
  "community_join_request_accepted",
  "new_comment_in_post",
  "new_recommend_user",
  "community_join_request_rejected",
  "tagged_in_comment",
];
export const CONTENT_OF_NOTIFICATIONS = {
  new_matching_request: { label: "さんからマッチングリクエストが届きました。", label2: "" },
  matching_request_accepted: { label: "さんとのマッチングが成立しました🎉メッセージを送ってみましょう。", label2: "" },
  new_community_join_request: { label: " さんからコミュニティ参加申請が届きました", label2: "" },
  community_join_request_accepted: { label: "コミュニティ参加申請が承認されました。", label2: "" },
  new_comment_in_post: { label: " さんが", label2: "にコメントしました。" },
  new_recommend_user: { label: "さんがgoodhubに参加しました。コンタクトをとってみましょう！", label2: "" },
  community_join_request_rejected: { label: "コミュニティ加が承認されませんでした。", label2: "" },
  tagged_in_comment: { label: "さんがコメントであなたをメンションしました。", label2: "" },
};

export const USER_ONLINE_STATUS = "online";
export const USER_OFFLINE_STATUS = "offline";

export const MODE_ROOM_CHAT = {
  personal: "personal",
  community: "community",
};

// eslint-disable-next-line no-shadow
export enum SearchFormStatus {
  // eslint-disable-next-line no-unused-vars
  Init = "init",
  // eslint-disable-next-line no-unused-vars
  Cached = "cached",
}