import { useState } from 'react';

interface Image {
  id: number;
  src: string;
  title: string;
  description: string;
}

const images: Image[] = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
    title: 'Technology',
    description: 'Abstract technology background',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800',
    title: 'Code',
    description: 'Programming and development',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
    title: 'Laptop',
    description: 'Modern workspace',
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800',
    title: 'Coding',
    description: 'Developer writing code',
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?w=800',
    title: 'Server',
    description: 'Data center infrastructure',
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800',
    title: 'Development',
    description: 'Software development',
  },
];

export default function ImageGallery() {
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  const handlePrevious = () => {
    if (!selectedImage) return;
    const currentIndex = images.findIndex((img) => img.id === selectedImage.id);
    const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setSelectedImage(images[prevIndex]);
  };

  const handleNext = () => {
    if (!selectedImage) return;
    const currentIndex = images.findIndex((img) => img.id === selectedImage.id);
    const nextIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    setSelectedImage(images[nextIndex]);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!selectedImage) return;

    if (e.key === 'ArrowLeft') {
      handlePrevious();
    } else if (e.key === 'ArrowRight') {
      handleNext();
    } else if (e.key === 'Escape') {
      setSelectedImage(null);
    }
  };

  // Add keyboard listener
  useState(() => {
    window.addEventListener('keydown', handleKeyDown as any);
    return () => window.removeEventListener('keydown', handleKeyDown as any);
  });

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Image Gallery</h2>

      {/* Gallery Grid */}
      <div className="grid md:grid-cols-3 gap-4" data-testid="gallery-grid">
        {images.map((image) => (
          <div
            key={image.id}
            onClick={() => setSelectedImage(image)}
            className="group cursor-pointer overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition"
            data-testid={`thumbnail-${image.id}`}
          >
            <div className="aspect-video bg-gray-200 overflow-hidden">
              <img
                src={image.src}
                alt={image.title}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
              />
            </div>
            <div className="p-3 bg-white dark:bg-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-white">{image.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{image.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
          data-testid="lightbox"
        >
          <div className="relative max-w-5xl w-full px-4" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
              data-testid="close-lightbox"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Previous Button */}
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full"
              data-testid="prev-image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Image */}
            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="w-full h-auto max-h-[70vh] object-contain"
                data-testid="lightbox-image"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{selectedImage.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{selectedImage.description}</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  {images.findIndex((img) => img.id === selectedImage.id) + 1} of {images.length}
                </p>
              </div>
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full"
              data-testid="next-image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* Instructions */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-4 py-2 rounded">
            Use arrow keys to navigate • ESC to close
          </div>
        </div>
      )}
    </div>
  );
}
