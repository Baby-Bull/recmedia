export const REGEX_RULES = {
  username_register:
    // eslint-disable-next-line max-len
    /^([\u3000-\u3000]|[\u3040-\u309F]|[\u30A0-\u30FF]|[\u4E00-\u9FAF]|[\uFF10-\uFF19]|[\uFF41-\uFF5A]|[\uFF21-\uFF3A]|[a-zA-Z0-9_ ])+$/u,
  only_japanese: /^[一-龯ぁ-んァ-ン]+$/,
  email: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
  username_profile: /^[一-龯ぁ-んァ-ンa-zA-Z0-9\w ]+$/,
  text_input: /^[一-龯ぁ-んァ-ンa-zA-Z0-9\w ]+$/,
  url: /^(ftp|http|https):\/\/[^ "]+$/,
};

export const VALIDATE_MESSAGE_FORM_REGISTER = {
  username: {
    required: "ユーザー名を入力してください",
    invalid: "ひらがな、カタカナ、漢字、a〜zの文字、0〜9の数字を含むユーザー名を入力してください。",
    max_length: "文字数オーバーです。50文字以内で入力してください。",
  },
  birthday: {
    required: "生年月日を入力してください",
    future_input: "今日より前の日付を入力してください（今日は選択できません）",
    invalid_date: "無効な日付 (yyyy/MM/dd)",
  },
  status: {
    required: "ステータスを選択してください",
  },
  email: {
    required: "「tanakataro@rebase.co.jp」の形式でメールアドレスを入力してください",
    invalid:
      // "メールアドレスの形式は正しくありません。「tanakataro@rebase.co.jp」の形式でメールアドレスを入力してください",
      "入力に誤りがあるため、ご確認ください。",
  },
  address: {
    required: "お住まいの地域を選択してください",
  },
  tags: {
    required: "タグを入力してください",
    max_length: "1タグにつき20文字以内で入力してください",
    min_count: "タグの数は2以上である必要があります",
  },
  checkbox: "利用規約に同意してください",
};

export const VALIDATE_FORM_MATCHING_REQUEST = {
  purpose: {
    required: "選択してください",
  },
  message: {
    max_length: "文字数の制限を超えています。1000文字以内で入力してください",
    required: "メッセージを入力してください",
  },
  desired_match_date: {
    invalid_date: "日付値が無効です",
    required_date: "時間の入力が必要です",
  },
  meeting_link: {
    required: "リンクを入力してください。",
    invalid_url: "正しいURL形式を入力してください",
  },
};

export const VALIDATE_FORM_USER_PORT = {
  reason: {
    required: "通報理由を選択してください。",
  },
  detail: {
    max_length: "1タグにつき1000文字以内で入力してください",
    required: "空白のままにしないでください",
  },
};

export const VALIDATE_FORM_USER_REVIEW = {
  comment: {
    max_length: "400文字以内で入力してください。",
    required: "レビューメッセージを入力してください",
  },
};

export const VALIDATE_FORM_UPDATE_PROFILE = {
  username: {
    required: "お名前を入力してください。",
    max_length: "50文字以内で入力してください。",
  },
  hitokoto: {
    max_length: "40文字以内で入力してください。",
  },
  self_description: {
    max_length: "1000文字以内で記入してください。",
  },
  discussion_topic: {
    max_length: "100文字以内で記入してください。",
  },
  job_position: {
    max_length: "1000文字以内で記入してください。",
  },
  upstream_process: {
    max_length: "200文字以内で記入してください。",
  },
  other_language_level: {
    max_length: "200文字以内で記入してください。",
  },
  tags: {
    min_tag: "2種類以上設定してください。",
    max_size: "1つのタグは20文字以内で記入してください。",
  },
  job: {
    select: "選択してください。",
  },
  status: {
    select: "選択してください。",
  },
  employment_status: {
    select: "選択してください。",
  },
  address: {
    select: "選択してください。",
  },
  english_level: {
    select: "選択してください。",
  },
  experience_year: {
    min: "負の値は入力できません。",
  },
  facebook_url: {
    format: "https://www.facebook.com/user_idの形式のFacebookリンクを入力してください。",
  },
  twitter_url: {
    format: "https://twitter.com/user_idの形式のTwitterリンクを入力してください。",
  },
  github_url: {
    format: "https://github.com/user_idの形式のGithubリンクを入力してください。",
  },
  image_profile: {
    format: "png, jpg形式の画像を選択してください。",
    max_size: "2MB以下のファイルを選択してください。",
  },
  max_length_name_skill: "40文字以内で記入してください。",
  max_length_year_skill: "2文字以内で記入してください。",
  required_name_skill: "入力してください。",
  format: "ユーザ名は無効です。ひらがな、カタカナ、漢字、a-zのアルファベット、0-9の文字を入力してください。",
};

export const VALIDATE_FORM_COMMUNITY = {
  name: {
    max_length: "40文字以内で入力してください。",
    required: "コミュニティ名を入力してください。",
  },
  description: {
    max_length: "1000文字以内で入力してください。",
    required: "コミュニティ詳細を入力してください。",
  },
  post_permission: {
    required: "選択してください。",
  },
  profile_image: {
    format: "png, jpg形式の画像を選択してください。",
    max_size: "2MB以下のファイルを選択してください。",
  },
  gather_url: {
    format: "正しいURL形式を入力してください",
  },
};

export const VALIDATE_FORM_COMMUNITY_POST = {
  title: {
    max_length: "60文字以内で入力してください。",
    required: "コミュニティタイトルを入力してください。",
  },
  content: {
    max_length: "1000文字以内で入力してください。",
    required: "コミュニティ詳細を入力してください。",
  },
  reference_url: {
    format: "https://www.〇〇.jpの形式の URL を入力してください。",
  },
  address: {
    max_length: "100文字以内で入力してください。",
  },
  content_comment: {
    max_length: "1000文字以内で入力してください。",
  },
};
