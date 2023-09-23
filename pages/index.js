/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';

const generateRandomImages = () => {
  const images = [];
  for (let i = 0; i < 33; i++) {
    const randomImageNumber = Math.ceil(Math.random() * 30);
    const imageUrl = `https://picsum.photos/400/400?random=${randomImageNumber}`;
    images.push({ url: imageUrl, randomImageNumber });
  }
  return images;
};

const getImageAuthor = async (imageId) => {
  try {
    const response = await fetch(`https://picsum.photos/id/${imageId}/info`);
    const data = await response.json();
    return data.author;
  } catch (error) {
    console.error('Error fetching author:', error);
    return 'Unknown Author';
  }
};

export default function Home() {
  const [images, setImages] = useState([]);
  useEffect(() => {
    const fetchImages = async () => {
      const imageArray = generateRandomImages();
      const imagesWithAuthors = await Promise.all(
        imageArray.map(async (image) => {
          const author = await getImageAuthor(image.randomImageNumber);
          return { ...image, author };
        })
      );
      setImages(imagesWithAuthors);
    };

    fetchImages();
  }, []);

  return (
    <div className="mx-auto max-w-screen-lg p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images &&
          images.map((image, index) => (
            <div
              key={index}
              className="relative transform transition-transform duration-300 hover:animate-pulse hover:scale-95"
            >
              <img
                src={image.url}
                alt={`Image ${index}`}
                className="rounded-lg"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-75 hover:bg-black hover:bg-opacity-70 transition-opacity duration-300 ">
                <p className="text-white text-lg">
                  {image.randomImageNumber}
                  <br />
                  by {image.author}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
