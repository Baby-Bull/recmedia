export const HOMEPAGE_RECOMMEND_COMMUNITY_STATUS = {
  1: {
    label: "コミュニティに参加する",
    mode: "green",
    allowJoinCommunity: true,
  },
  2: {
    label: "申請中",
    mode: "default",
  },
  3: {
    label: "参加申請を送る",
    mode: "orange",
  },
  4: {
    label: "メッセージを開",
    mode: "info",
  },
};

export const HOMEPAGE_MEMBER_RECOMMEND_CHAT_STATUS = {
  1: {
    label: "今すぐ話せます",
    mode: "orange",
  },
  2: {
    label: "友達募集しています",
    mode: "cleam",
  },
  3: {
    label: "相談に乗って欲しいです",
    mode: "info",
  },
};

export const HOMEPAGE_RECOMMEND_MEMBER_STATUS = {
  1: {
    label: "リクエスト送信済み",
    mode: "default",
  },
  2: {
    label: "メッセージを開く",
    mode: "info",
  },
  3: {
    label: "承認する",
    mode: "orange",
  },
  4: {
    label: "マッチングのリクエストを送る",
    mode: "green",
  },
};

export const USER_SEARCH_STATUS = {
  "can-talk": {
    label: "今すぐ話せます",
    mode: "orange",
  },
  "looking-for-friend": {
    label: "友達募集しています",
    mode: "cleam",
  },
  "need-consult": {
    label: "相談に乗って欲しいです",
    mode: "info",
  },
};

export const JOBS = {
  frontend: { label: "フロントエンドエンジニア" },
  backend: { label: "バックエンドエンジニア" },
  "data-scientist": { label: "データサイエンティスト" },
  "project-manager": { label: "プロジェクトマネージャー" },
  "project-leader": { label: "プロジェクトリーダー" },
  "test-engineer": { label: "テストエンジニア" },
  "database-engineer": { label: "データベースエンジニア" },
  "security-engineer": { label: "セキュリティエンジニア" },
  "infrastructure-engineer": { label: "インフラエンジニア" },
  "network-engineer": { label: "ネットワークエンジニア" },
  "server-engineer": { label: "サーバーエンジニア" },
  "support-engineer": { label: "サポートエンジニア" },
  "help-desk": { label: "ヘルプデスク" },
  "markup-engineer": { label: "マークアップエンジニア" },
  "mobile-engineer": { label: "モバイルアプリエンジニア " },
};

export const EMPLOYEES = {
  fulltime: { label: "正社員" },
  contract: { label: "契約社員" },
  temporary: { label: "派遣社員" },
  freelance: { label: "フリーランス" },
  president: { label: "社長" },
  officer: { label: "役員" },
  "part-time": { label: "転職活動中" },
  intern: { label: "アルバイト" },
  "during-job-change": { label: "インターン" },
};

export const USER_STATUS_OPTIONS = [
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

export const USER_STATUS = {
  "can-talk": {
    label: "今すぐ話せます",
    mode: "orange",
    bg: "#FF9458",
    color: "#FFFFFF",
  },
  "looking-for-friend": {
    label: "友達募集しています",
    mode: "cleam",
    bg: "rgb(255, 249, 229)",
    color: "rgb(26, 41, 68)",
  },
  "need-consult": {
    label: "相談に乗って欲しいです",
    mode: "info",
    bg: "#03BCDB",
    color: "#FFFFFF",
  },
};
