/* eslint-disable import/prefer-default-export */
const itemCommunityMockData = {
  image: "/assets/images/participating_community/community_sample.png",
  numberOfRegister: 6,
  name: "コミュニティの名前がここに入ります。最大文字数40文字です。コミュニティの名前が",
  numberOfMembers: 0,
  tags: ["#タグ", "#タグ", "#タグタグ", "#タグタグ", "#タグ", "#タグ", "#タグタグ", "#タグタグ"],
  description:
    "概要が数行表示されます。概要が数行表示されます。概要が数行表示されます。概要が数行表示されます。概要が数行表示されます。概要が数行表示概要が数行表示概要が数行表示",
};

export const resultSearchMockData = () => {
  const dataReturn = [];
  for (let i = 0; i < 15; i++) {
    dataReturn.push({
      ...itemCommunityMockData,
      // eslint-disable-next-line no-nested-ternary
      status: i === 1 || i === 4 ? 3 : i === 8 ? 2 : 1,
    });
  }
  return dataReturn;
};
