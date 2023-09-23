import React, { useState } from 'react';
import clientPromise from '../../lib/mongodb';
import PostForm from './components/PostForm';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function PostsHome({ posts }) {
  const { data: session } = useSession();
  console.log(session);
  const [postList, setPostList] = useState(posts); // Initialize the local state with the initial posts data

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
        // setNewPosts((prevNewPosts) => [...prevNewPosts, newPostData]);
        setPostList((prevPostList) => [...prevPostList, newPostData]);
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

  return (
    <div>
      {session ? (
        <PostForm onSubmit={handlePostSubmit} />
      ) : (
        <div className="text-center font-bold text-xl my-10">
          Please sign in to create a post
        </div>
      )}

      {postList.map((post) => (
        <div key={post._id} className="border p-4 rounded-md m-4">
          <p className="p-1">Username: {post.username}</p>
          <p className="p-1">Email: {post.email}</p>
          <p className="p-1">Message: {post.message}</p>
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
  );
}

export async function getServerSideProps() {
  const client = await clientPromise;
  const db = client.db('nextjs-db');

  try {
    const allPosts = await db.collection('posts').find({}).toArray();

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
