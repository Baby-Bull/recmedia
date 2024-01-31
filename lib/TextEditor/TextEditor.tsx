import React, { FC, memo } from "react";
import "react-quill/dist/quill.snow.css";
import "highlight.js/styles/github-dark.css";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import hljs from "highlight.js/lib/common";
import { styled } from "@mui/material/styles";
import dynamic from "next/dynamic";

import theme from "src/theme";

import styles from "./textEditor.module.scss";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

const BoxTextValidate = styled(Box)({
  color: "#FF9458",
  lineHeight: "20px",
  fontWeight: "400",
  fontSize: "14px",
});

const modules = {
  syntax: {
    highlight: (text) => hljs.highlightAuto(text).value,
  },
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
    ["link"],
  ],
};

const format = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "code-block",
  "list",
  "bullet",
  "indent",
  "link",
];

interface Props {
  value: any;
  // eslint-disable-next-line no-unused-vars
  onChange?: (value: any, textLength) => void;
  placeholder?: string;
  readOnly?: boolean;
  error?: string;
}
const TextEditor: FC<Props> = memo(({ value, placeholder, error, onChange = null, readOnly = false }) => (
  <Box>
    <Box
      sx={{
        flexGrow: 1,
        backgroundColor: "white",
        color: theme.navy,
        borderRadius: "12px",
        width: "100%",
      }}
    >
      <Grid container>
        <Grid item xs={12} sm={12}>
          <ReactQuill
            theme="snow"
            className={readOnly ? styles.quillContainerReadonly : styles.quillContainerEditable}
            formats={format}
            readOnly={readOnly}
            modules={modules}
            defaultValue={value}
            placeholder={placeholder}
            onChange={(content, delta, source, editor) => onChange && onChange(editor.getHTML(), editor.getLength())}
          />
        </Grid>
      </Grid>
    </Box>
    {error ? <BoxTextValidate>{error}</BoxTextValidate> : null}
  </Box>
));
export default TextEditor;
