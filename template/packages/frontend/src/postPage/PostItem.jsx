import React from "react";
import { css } from "../../styled-system/css";

const sectionStyle = css({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "60vh"
});

const loadingStyle = css({
  color: "#86868b",
  fontSize: "1.2rem"
});

const retroCardStyle = css({
  backgroundColor: "#fff",
  border: "4px solid #000",
  boxShadow: "8px 8px 0px #000",
  padding: "3rem",
  maxWidth: "600px",
  width: "100%",
  fontFamily: "'Courier New', Courier, monospace"
});

const retroTitleStyle = css({
  fontFamily: "var(--font-doto)",
  marginTop: "0",
  borderBottom: "2px solid #000",
  paddingBottom: "1rem",
  marginBottom: "1.5rem"
});

const retroBodyStyle = css({
  fontFamily: "'Courier New', Courier, monospace",
  fontSize: "1rem"
});

function PostItem({ title, body, isLoading }) {
  return (
    <section className={sectionStyle}>
      {isLoading ? (
        <div className={loadingStyle}>Loading amazing content...</div>
      ) : (
        <div className={retroCardStyle}>
          <h2 className={retroTitleStyle}>{title}</h2>
          <p className={retroBodyStyle}>{body}</p>
        </div>
      )}
    </section>
  );
}

export default PostItem;
