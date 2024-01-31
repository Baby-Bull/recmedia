import React, { FC } from "react";

type Props = {
  tags: string[];
  // eslint-disable-next-line no-unused-vars
  onClick: (tag: string) => void;
};

const UserTag: FC<Props> = ({ tags, onClick }) => (
  <ul>
    {tags?.map((tag, index) => (
      // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
      <li onClick={() => onClick(tag)} key={index}>
        {tag}
      </li>
    ))}
  </ul>
);

export default UserTag;
