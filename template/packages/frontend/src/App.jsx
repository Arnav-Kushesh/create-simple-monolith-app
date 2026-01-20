import { Routes, Route } from "react-router-dom";
import HomePage from "./homePage/HomePage";
import PostPage from "./postPage/PostPage";
import PostPageTemplate from "./postPage/PostPageTemplate";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/post/:id" element={<PostPage />} />
      <Route path="/post-page-template" element={<PostPageTemplate />} />
    </Routes>
  );
}

export default App;
