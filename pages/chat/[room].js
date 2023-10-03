import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import io from 'socket.io-client';

const socket = io();

export default function ChatRoom() {
  const router = useRouter();
  const { room, username } = router.query;

  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  useEffect(() => {
    if (room && username) {
      socket.emit('JOIN', { room, username });
    }

    socket.on('chat', (data) => {
      setChat([...chat, data]);
    });

    socket.on('system', (data) => {
      setChat([...chat, data]);
    });

    // Fetch chat messages when the component mounts
    const fetchChatMessages = async () => {
      try {
        const response = await fetch(`/api/chat/chat?room=${room}`);
        const data = await response.json();
        setChat(data);
      } catch (error) {
        console.error('Error fetching chat messages:', error);
      }
    };

    fetchChatMessages();

    return () => {
      socket.off('chat');
      socket.off('system');
    };
  }, [chat, room, username]);

  const sendMessage = async (e) => {
    e.preventDefault(); // Prevents the default form submission behavior

    try {
      // Post the message to the server
      await fetch('/api/chat/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ room, username, message }),
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }

    setMessage('');
  };

  return (
    <div className="flex flex-col p-4">
      <h1 className="text-lg text-center underline font-bold">
        Chat Room: {room}
      </h1>
      <div>
        {chat.map((msg, index) => (
          <div
            key={index}
            className="p-2 last:border-b-0 border-b border-blue-400"
          >
            <strong>{msg.username}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <form className="items-center space-x-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="rounded-sm px-2 py-2 mb-4"
          placeholder="Type your message..."
          rows={1}
          autoComplete="off"
        />
        <button
          type="submit"
          onClick={sendMessage}
          className="bg-blue-400 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </form>
    </div>
  );
}
