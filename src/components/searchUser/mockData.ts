/* eslint-disable import/prefer-default-export */
const itemMemberMockData = {
  image: "/assets/images/home_page/recommend_member.svg",
  lastLogin: "6分前",
  name: "名前がここに入ります。名前が名前が名前が",
  career: "フロントエンドエンジニア",
  review: 1364,
  introduce: "エンジニアしてます！色んな人と話したいです。",
  tags: ["#タグ", "#タグ", "#タグタグ", "#タグタグ", "#タグ", "#タグ", "#タグタグ", "#タグタグ"],
  description:
    "PHPの技術についてお話しできます。技術交換ができたら嬉しいです。また、新しい技術を習得したいと考えているので、他言語のエンジニアの方とお話しができたらと思っています。！",
};

export const resultSearchMockData = () => {
  const dataReturn = [];
  for (let i = 0; i < 15; i++) {
    dataReturn.push({
      ...itemMemberMockData,
      status: Math.floor(Math.random() * 2) + 1,
      isLiked: false,
      chatStatus: Math.floor(Math.random() * 3) + 1,
    });
  }
  return dataReturn;
};
