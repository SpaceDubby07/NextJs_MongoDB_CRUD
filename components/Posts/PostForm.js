import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { AiOutlineSend } from 'react-icons/ai';
import { BsCardImage } from 'react-icons/bs';

export default function PostForm({ onSubmit }) {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    username: session?.user?.name,
    email: session?.user?.email,
    message: '',
    uid: session?.user?.uid,
    userImageURL: session?.user?.image,
    timestamp: new Date(), // Update the timestamp when the form is submitted
  });
  const [isEmailValid, setIsEmailValid] = useState(true); // State to track email validation

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Email validation using regex
    if (name === 'email') {
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      setIsEmailValid(emailRegex.test(value));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Pass the form data to the onSubmit function
    setFormData({
      username: session?.user?.name,
      email: session?.user?.email,
      message: '',
      uid: session?.user?.uid,
      userImageURL: session?.user?.image,
      timestamp: new Date(),
    });
  };

  return (
    <div className="z-30 fixed bottom-0 right-0 left-0 p-2 lightbg darkbg">
      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-between"
      >
        <input
          name="message"
          value={formData.message}
          onChange={handleChange}
          className="flex-grow mr-2 rounded-sm px-2 py-1"
          placeholder="Type your message..."
          rows={1}
          autoComplete="off"
        />
        <div className="flex space-x-2">
          <button
            type="submit"
            className="bg-blue-400 text-white px-4 py-2 rounded"
            disabled={!formData.username || !isEmailValid || !formData.message}
          >
            <AiOutlineSend /> {/* Use the icon directly */}
          </button>
        </div>
      </form>
    </div>
  );
}
