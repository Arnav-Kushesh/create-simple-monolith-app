import { Link } from "react-router-dom";
import PostList from "./PostList";
import { css } from "../../styled-system/css";

const gridStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  marginTop: "-15px",
});

const cardStyle = css({
  background: "white",
  borderBottom: "1px solid #d2d2d7",
  // borderRadius: "5px",
  padding: "15px",
  paddingLeft: "0",
});

const title = css({
  textTransform: "uppercase",
  fontSize: "42px",
  margin: 0,
  marginBottom: "10px",
  filter: " invert(1)",
  background: "white",
  padding: "20px",
  fontWeight: "900",
  borderRadius: "5px",
});

const cardTitle = css({
  margin: 0,
});

function HomePage() {
  return (
    <div>
      <header>
        <h1 className={title}>start-simple-JS</h1>
        <p>
          One of the most minimal way to create fullstack project that supports
          SSR, SSG & Sitemap Generation out of the box
        </p>
      </header>

      <h2>Benefits</h2>
      <div className={gridStyle}>
        <div className={cardStyle}>
          <h3 className={cardTitle}>Minimal learning curve</h3>
          <p>You only require knowledge of react & express</p>
        </div>
        <div className={cardStyle}>
          <h3 className={cardTitle}>Minimal need to change frontend code</h3>
          <p>Frontend is a standard react app</p>
        </div>
        <div className={cardStyle}>
          <h3 className={cardTitle}>Works with any frontend technology</h3>
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
    </div>
  );
}

export default HomePage;
