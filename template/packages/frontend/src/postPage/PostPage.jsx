import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostItem from "./PostItem";

function PostPage() {
  const { id } = useParams();
  const [item, setItem] = useState([]);
  const [loading, setLoading] = useState(true);

  let data = item;
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

  useEffect(() => {
    if (!dataAlreadyLoaded) {
      fetch("https://jsonplaceholder.typicode.com/posts/" + id)
        .then((response) => response.json())
        .then((data) => {
          setItem(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [dataAlreadyLoaded, id]);

  return <PostItem isLoading={isLoading} title={data.title} body={data.body} />;
}

export default PostPage;
