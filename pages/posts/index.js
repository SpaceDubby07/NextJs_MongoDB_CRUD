import React, { useEffect, useState } from 'react';
import clientPromise from '../../lib/mongodb';
import PostForm from '../../components/PostForm';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { BsFillTrashFill } from 'react-icons/bs';
import { BiInfoCircle } from 'react-icons/bi';

export default function PostsHome({ posts, users }) {
  const { data: session } = useSession();
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
        <div className="mx-4 relative">
          <PostForm onSubmit={handlePostSubmit} />
        </div>
      ) : (
        <div className="text-center font-bold text-xl my-10 col-span-3">
          Please sign in to create a post
        </div>
      )}
      <div className="mx-4">
        {postList.map((post) => (
          <div
            key={post._id}
            className="border-b border-gray-300 pb-2 mb-2 flex justify-between"
          >
            <div className="flex items-center space-x-2">
              <img
                src={post.userImageURL}
                className="rounded-full h-10"
                alt={post.username}
              />
              <div className="ml-4">
                <p className="text-sm font-semibold">{post.username}</p>
                <p className="text-sm">{post.message}</p>
              </div>
            </div>
            <div className="relative flex items-center">
              <Link
                href={`/posts/${post._id}`}
                className="pt-2 hover:text-blue-400"
              >
                <BiInfoCircle className="mr-2" /> {/* Add the icon */}
                {/* Remove the text */}
              </Link>
              {users.some(
                (user) =>
                  user.uid === session?.user?.uid &&
                  (user.isAdmin || user.uid === post.uid)
              ) && (
                <button
                  className="pt-2 hover:text-red-400"
                  onClick={() => handlePostDelete(post._id)}
                >
                  <BsFillTrashFill />
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
      .sort({ timestamp: 1 })
      .toArray();
    // Convert ObjectId to string for serialization
    const serializedPosts = allPosts.map((post) => ({
      ...post,
      _id: post._id.toString(),
    }));

    const allUsers = await db.collection('users').find({}).toArray();
    const serializedUser = allUsers.map((user) => ({
      ...user,
      _id: user._id.toString(),
      accountCreationDate: user.accountCreationDate.toString(),
      lastLogin: user.lastLogin.toString(),
    }));

    return {
      props: {
        posts: serializedPosts,
        users: serializedUser,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        posts: [],
        users: [],
      },
    };
  }
}
