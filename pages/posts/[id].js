// pages/posts/[id].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function PostPage() {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState(null);

  useEffect(() => {
    if (id) {
      // Fetch the data for the specific post using the `id` from the URL
      fetch(`/api/posts/getById?id=${id}`) // Use the getById API route
        .then((res) => {
          if (res.status === 200) {
            return res.json();
          } else {
            // Handle errors
            throw new Error('Post not found');
          }
        })
        .then((postData) => {
          setPost(postData);
        })
        .catch((error) => {
          console.error('Error fetching post:', error);
        });
    }
  }, [id]);

  if (!post) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Post Details</h1>
      <p>Username: {post.username}</p>
      <p>Email: {post.email}</p>
      <p>Message: {post.message}</p>
      {/* Add any other post details you want to display */}
    </div>
  );
}
