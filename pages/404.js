// components/NotFound.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const NotFound = () => {
  const [countdown, setCountdown] = useState(5); // Initial countdown value
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prevCount) => prevCount - 1);
    }, 1000);

    // Redirect to the home page when countdown reaches 0
    if (countdown === 0) {
      router.push('/');
    }

    // Clear the interval when the component is unmounted
    return () => clearInterval(interval);
  }, [countdown, router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="relative text-6xl font-bold mb-4">
        <span
          className="bg-clip-text text-transparent bg-[conic-gradient(at_bottom_right,_var(--tw-gradient-stops))] from-violet-400 via-purple-400 to-fuchsia-900"
          style={{
            backgroundImage:
              'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
          }}
        >
          404 - Not Found
        </span>
      </h1>
      <p className="text-lg mb-4 ">Looks like you've entered the void...</p>
      <img
        className="animate-spin duration-100 h-64 mb-4"
        src="/space.png" // Replace with your own image or use Tailwind CSS classes for icons
        alt="fall into the void!"
      />
      <p className="text-lg mb-8">Don't worry, we will help you escape!</p>
      <p className="text-sm text-gray-500">
        Redirecting to the home page in {countdown} seconds...
      </p>
    </div>
  );
};

//

export default NotFound;
