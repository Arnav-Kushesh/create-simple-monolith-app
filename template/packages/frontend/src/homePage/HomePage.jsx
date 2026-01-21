import { Link } from "react-router-dom";
import PostList from "./PostList";
import { css } from "../../styled-system/css";

const gridStyle = css({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "2rem",
  marginTop: "2rem"
});

const cardStyle = css({
  background: "white",
  border: "1px solid #d2d2d7",
  borderRadius: "12px",
  padding: "2rem",
});

const title = css({
  textTransform: "uppercase",
  fontSize: "42px",
  margin: 0,
  marginBottom: "10px",
  fontWeight: "900"
});

function HomePage() {
  return (
    <div>
      <header>
        <h1 className={title} >create-simple-fullstack-project</h1>
        <p >
          One of the most minimal way to create fullstack project that supports
          SSR, SSG & Sitemap Generation out of the box
        </p>
      </header>

      <h2>Benefits</h2>
      <div className={gridStyle}>
        <div className={cardStyle}>
          <h3>Minimal learning curve</h3>
          <p>You only require knowledge of react & express</p>
        </div>
        <div className={cardStyle}>
          <h3>Minimal need to change frontend code</h3>
          <p>Frontend is a standard react app</p>
        </div>
        <div className={cardStyle}>
          <h3>Works with any frontend technology</h3>
          <p>
            You can replace the frontend folder with any other technology and it
            will still work
          </p>
        </div>
      </div>
      <br />
      <br />
      <PostList />
      <br />
      <br />
      <br />
      <br />
      <Link to="/post/1">Open Post 1</Link>
      <br />
      <a target="_blank" href="/post/1">
        Open Post 1 (New Tab)
      </a>
    </div>
  );
}

export default HomePage;
