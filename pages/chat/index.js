import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Chat() {
  const router = useRouter();
  const [room, setRoom] = useState('');
  const [username, setUsername] = useState('');

  const joinRoom = (e) => {
    e.preventDefault(); // Prevents the default form submission behavior
    // Pass the username as a query parameter when navigating to the chat room
    router.push(`/chat/${room}?username=${username}`);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={joinRoom}
        className="flex flex-col items-center p-8 rounded shadow-md"
      >
        <input
          type="text"
          placeholder="Room"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          className="rounded-sm px-2 py-2 mb-4"
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="rounded-sm px-2 py-2 mb-4"
        />
        <button
          type="submit"
          className="bg-blue-400 text-white px-4 py-2 rounded"
        >
          Join Room
        </button>
      </form>
    </div>
  );
}
