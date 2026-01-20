import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function PostItem({ title, body, isLoading }) {
  return (
    <section>
      {isLoading ? (
        <div className="loading">Loading amazing content...</div>
      ) : (
        <>
          <h2>{title}</h2>
          <p className="subtitle">{body}</p>
        </>
      )}
    </section>
  );
}

export default PostItem;
