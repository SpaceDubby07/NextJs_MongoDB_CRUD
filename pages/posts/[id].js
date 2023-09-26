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

  const timestamp = new Date(post.timestamp);
  const year = timestamp.getFullYear();
  const month = timestamp.getMonth() + 1; // Note: Months are zero-based (0 = January)
  const day = timestamp.getDate();

  const formattedDate = `${year}-${month < 10 ? '0' : ''}${month}-${
    day < 10 ? '0' : ''
  }${day}`;

  return (
    <div className="p-4 text-center ">
      <h1 className="m-2 font-bold">Post Details</h1>
      <img
        src={post.userImageURL}
        className="h-10 w-10 rounded-full m-2 mx-auto"
      />
      <p className="m-2">Username: {post.username}</p>
      <p className="m-2">Message: {post.message}</p>
      <p className="m-2">Date Created: {formattedDate}</p>
    </div>
  );
}
