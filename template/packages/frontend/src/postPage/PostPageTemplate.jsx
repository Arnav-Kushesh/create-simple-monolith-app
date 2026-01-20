import PostItem from "./PostItem";

function PostPageTemplate() {
  return <PostItem title="{{title}}" body="{{body}}" isLoading={false} />;
}

export default PostPageTemplate;
