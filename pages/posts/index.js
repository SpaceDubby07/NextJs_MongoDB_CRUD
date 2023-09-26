import React, { useEffect, useState } from 'react';
import clientPromise from '../../lib/mongodb';
import PostForm from './components/PostForm';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function PostsHome({ posts }) {
  const { data: session } = useSession();
  const [postList, setPostList] = useState(posts); // Initialize the local state with the initial posts data
  console.log(postList);

  // Function to handle form submission
  const handlePostSubmit = async (formData) => {
    try {
      const res = await fetch('/api/posts/posts', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 201) {
        const newPostData = await res.json();
        // get the new post data first, then populate the previous post list
        setPostList((prevPostList) => [newPostData, ...prevPostList]);
      } else {
        // Handle errors
      }
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };

  // Function to handle post deletion
  const handlePostDelete = async (postId) => {
    try {
      const res = await fetch(`/api/posts/posts?id=${postId}`, {
        method: 'DELETE',
      });

      if (res.status === 204) {
        // Post deleted successfully, remove it from the local state
        const updatedPosts = postList.filter((post) => post._id !== postId);
        setPostList(updatedPosts);
      } else if (res.status === 404) {
        // Post not found, handle accordingly
        console.error('Post not found');
      } else {
        // Handle other errors
        console.error('Error deleting post:', res.statusText);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  // Periodically fetch new data every 10 seconds
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/posts/posts`, {
          method: 'GET',
        });

        if (res.status === 200) {
          const result = await res.json();
          const newPostData = result.data; // Access the 'data' property

          // Ensure that newPostData is an array
          if (Array.isArray(newPostData)) {
            // Check if there are new posts by comparing with the existing data
            const hasNewPosts = newPostData.some(
              (newPost) =>
                !postList.some(
                  (existingPost) => existingPost._id === newPost._id
                )
            );

            // Check if any posts have been removed by comparing with the new data
            const removedPosts = postList.filter(
              (existingPost) =>
                !newPostData.some((newPost) => newPost._id === existingPost._id)
            );

            // If there are new posts or removed posts, update the state
            if (hasNewPosts || removedPosts.length > 0) {
              setPostList(newPostData);
            }
          } else {
            // Handle the case where newPostData is not an array
            console.error('Fetched data is not an array:', newPostData);
          }
        } else {
          // Handle errors
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const interval = setInterval(fetchData, 3000); // Fetch data every 10 seconds

    return () => clearInterval(interval); // Clean up the interval when the component unmounts
  }, [postList]); // Include postList as a dependency to compare with the new data

  return (
    <div>
      {session ? (
        <div className="mx-4">
          <PostForm onSubmit={handlePostSubmit} />
        </div>
      ) : (
        <div className="text-center font-bold text-xl my-10 col-span-3">
          Please sign in to create a post
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mx-4">
        {postList.map((post) => (
          <div key={post._id} className="border p-4 rounded-md">
            <img
              src={post.userImageURL}
              className="p-1 rounded-full h-14"
              alt={post.username}
            ></img>
            <p className="p-1 font-semibold">{post.username}</p>
            <p className="p-1 font-bold">{post.message}</p>
            <div className="flex justify-between my-4 items-center">
              <Link
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                href={`/posts/${post._id}`}
              >
                View Details
              </Link>
              {session && session.user && session.user.uid === post.uid && (
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={() => handlePostDelete(post._id)}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const client = await clientPromise;
  const db = client.db('nextjs-db');

  try {
    const allPosts = await db
      .collection('posts')
      .find({})
      .sort({ timestamp: -1 })
      .toArray();
    // Convert ObjectId to string for serialization
    const serializedPosts = allPosts.map((post) => ({
      ...post,
      _id: post._id.toString(),
    }));

    return {
      props: {
        posts: serializedPosts,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        posts: [],
      },
    };
  }
}
