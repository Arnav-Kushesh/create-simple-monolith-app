import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { css } from "../../styled-system/css";

const loadingStyle = css({
  color: "#86868b",
  fontSize: "1.2rem",
  padding: "2rem 0"
});

const gridStyle = css({
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)", // Strict 2 columns
  gap: "2rem",
  marginTop: "2rem"
});

const cardStyle = css({
  background: "white",
  border: "1px solid #040404ff",
  borderRadius: "12px",
  padding: "2rem",
  transition: "all 0.3s cubic-bezier(0,0,0.5,1)",
});

const buttonGroupStyle = css({
  display: "flex",
  gap: "1rem",
  marginTop: "1.5rem"
});

const btnBaseStyle = {
  display: "inline-block",
  padding: "0.5rem 1rem",
  fontSize: "0.9rem",
  fontWeight: "400",
  borderRadius: "6px",
  cursor: "pointer",
  textDecoration: "none",
  transition: "all 0.2s ease",
  fontFamily: "inherit",
};

const secondaryBtnStyle = css({
  ...btnBaseStyle,
  backgroundColor: "transparent",
  color: "#1d1d1f",
  border: "1px solid #1d1d1f",
  "&:hover": {
    backgroundColor: "#f5f5f7",
    color: "#000"
  }
});

const primaryBtnStyle = css({
  ...btnBaseStyle,
  backgroundColor: "#1d1d1f",
  color: "white",
  border: "1px solid #1d1d1f",
  "&:hover": {
    backgroundColor: "#333",
    transform: "translateY(-1px)"
  }
});

function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  let data = posts;
  let isLoading = loading;
  let dataAlreadyLoaded = false;

  let preLoadedData = window.getPreLoadedData
    ? window.getPreLoadedData()
    : null;

  if (preLoadedData) {
    data = preLoadedData;
    isLoading = false;
    dataAlreadyLoaded = true;
  }

  window.EXPORT_STATIC_PAGE_DATA = data;

  useEffect(() => {
    if (!dataAlreadyLoaded) {
      fetch("https://jsonplaceholder.typicode.com/posts?_limit=6")
        .then((response) => response.json())
        .then((data) => {
          setPosts(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [dataAlreadyLoaded]);

  return (
    <section>
      <h2>Posts</h2>
      <p className="subtitle">
        This section loads data from an external API on the client side.
        <br />
        Do right click and select view page source. Data was rendered on the
        initial paint itself

        <br />
        If the server is running the frontend-optimized version then you can see SSR in action if the post is opened in a new tab. Don't forget to run the build command
      </p>

      {isLoading ? (
        <div className={loadingStyle}>
          Loading amazing content...
        </div>
      ) : (
        <div className={gridStyle}>
          {data.map((post) => (
            <div key={post.id} className={cardStyle}>
              <h3>{post.title.substring(0, 30)}...</h3>
              <p>{post.body.substring(0, 100)}...</p>
              <div className={buttonGroupStyle}>
                <a
                  href={`/post/${post.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className={secondaryBtnStyle}
                >
                  Open in new tab
                </a>
                <Link to={`/post/${post.id}`} className={primaryBtnStyle}>
                  Open
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default PostList;
