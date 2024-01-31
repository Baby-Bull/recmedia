import React, { useEffect, useState } from "react";

import ContentComponent from "src/components/layouts/ContentComponent";
import BlockChatComponent from "src/components/chat/Community/Blocks/ChatComponent";

const CommunityChatComponent = () => {
  const [isRenderRightSide, setIsRenderRightSide] = useState(false);

  useEffect(() => {
    if (!document.body.classList.contains("overflow-hidden")) {
      document.body.classList.add("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  return (
    <ContentComponent showFooter={false} showHeader={!isRenderRightSide}>
      <BlockChatComponent isRenderRightSide={isRenderRightSide} setIsRenderRightSide={setIsRenderRightSide} />
    </ContentComponent>
  );
};

export default CommunityChatComponent;
