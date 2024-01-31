export const jobs = [
  {
    label: "職種",
    value: 0,
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
];

export const employeeStatus = [
  {
    label: "雇用状態",
    value: 0,
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

export const typeTimeLogin = {
  login: 1,
  one_hour: 2,
  one_day: 3,
  on_day_to_week: 4,
  week_to_two_week: 5,
  two_week_to_month: 6,
  month_or_than: 7,
};

export const lastLogins = [
  {
    label: "最終ログイン",
    value: 0,
  },
  {
    label: "ログイン中",
    value: 1,
  },
  {
    label: "1時間以内",
    value: 2,
  },
  {
    label: "24時間以内",
    value: 3,
  },
  {
    label: "1日〜1週間",
    value: 4,
  },
  {
    label: "週間〜2週間",
    value: 5,
  },
  {
    label: "2週間〜1ヶ月",
    value: 6,
  },
  {
    label: " 1ヶ月以上",
    value: 7,
  },
];

export const reviews = [
  {
    label: "レビュー",
    value: 0,
  },
  {
    label: "レビュー0件を除く",
    value: 1,
  },
  {
    label: "10件未満",
    value: 2,
  },
  {
    label: "11〜50件",
    value: 3,
  },
  {
    label: "51〜100件",
    value: 4,
  },
  {
    label: " 100件以上",
    value: 5,
  },
];

export const typeReview = {
  no_0: 1,
  less_than_10: 2,
  from_11_to_50: 3,
  from_51_to_100: 4,
  more_than_100: 5,
};

export const typeMatchingStatus = {
  REJECTED: "rejected",
  SENT_PENDING: "sent_pending",
  RECEIVED_PENDING: "received_pending",
  CONFIRMED: "confirmed",
  NULL: null,
}