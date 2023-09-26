import React, { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function PostForm({ onSubmit }) {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    username: session.user.name,
    email: session.user.email,
    message: '',
    uid: session.user.uid,
    userImageURL: session.user.image,
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
      username: session.user.name,
      email: session.user.email,
      message: '',
      uid: session.user.uid,
      userImageURL: session.user.image,
      timestamp: new Date(),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap items-center justify-around mx-4 my-6"
    >
      <div className="">
        <label htmlFor="username">
          Username:
          <input
            disabled
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="m-2 rounded-xl px-2 py-1 focus:outline-none"
          />
        </label>
      </div>
      <div style={{ position: 'relative' }}>
        <label htmlFor="email">
          Email:
          <input
            disabled
            type="text"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className={`m-2 rounded-xl px-2 py-1 focus:outline-none ${
              isEmailValid ? '' : 'focus:outline-red-500'
            }`} // Apply a green border for valid emails and a red border for invalid emails
          />
          {!isEmailValid && (
            <p
              className="text-red-500"
              style={{
                position: 'absolute',
                top: '100%', // Position the error message below the input
                left: '0',
              }}
            >
              Invalid email address
            </p>
          )}
        </label>
      </div>
      <div>
        <label htmlFor="message" className="items-center flex">
          Message:
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="m-2 rounded-xl px-2 py-1"
          />
        </label>
      </div>
      <div>
        <button
          type="submit"
          className="text-blue-400"
          disabled={!formData.username || !isEmailValid || !formData.message}
        >
          Submit
        </button>
      </div>
    </form>
  );
}
