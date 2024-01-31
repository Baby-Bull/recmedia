import React from "react";

import LayoutComponent from "src/components/community/LayoutComponent";
import FormComponent from "src/components/community/post/FormComponent";

const EditPostComponent = () => (
  <LayoutComponent>
    <FormComponent editable />
  </LayoutComponent>
);
export default EditPostComponent;
