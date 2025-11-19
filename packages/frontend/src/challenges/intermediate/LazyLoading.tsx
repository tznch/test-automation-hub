import { useState, useRef, useEffect } from 'react';

interface ImageItem {
  id: number;
  title: string;
  placeholder: string;
  src: string;
  loaded: boolean;
  error: boolean;
}

export default function LazyLoading() {
  const [images, setImages] = useState<ImageItem[]>(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      title: `Image ${i + 1}`,
      placeholder: `https://via.placeholder.com/300x200/e5e7eb/9ca3af?text=Loading...`,
      src: `https://picsum.photos/seed/${i + 1}/300/200`,
      loaded: false,
      error: false,
    }))
  );

  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const imageId = parseInt(img.getAttribute('data-id') || '0');

            // Simulate network delay
            setTimeout(() => {
              setImages((prev) =>
                prev.map((item) =>
                  item.id === imageId ? { ...item, loaded: true } : item
                )
              );
            }, 500);

            observerRef.current?.unobserve(img);
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.01,
      }
    );

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const imageRef = (el: HTMLImageElement | null) => {
    if (el && observerRef.current) {
      observerRef.current.observe(el);
    }
  };

  const handleImageError = (id: number) => {
    setImages((prev) =>
      prev.map((item) => (item.id === id ? { ...item, error: true, loaded: true } : item))
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Lazy Loading Images</h2>

      <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-700 dark:text-blue-400">
          ℹ️ Scroll down to see images load as they come into view. Images are loaded with Intersection Observer.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Images</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="total-images">
            {images.length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Loaded</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400" data-testid="loaded-images">
            {images.filter((img) => img.loaded && !img.error).length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Failed</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400" data-testid="failed-images">
            {images.filter((img) => img.error).length}
          </p>
        </div>
      </div>

      {/* Image Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {images.map((image) => (
          <div
            key={image.id}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
            data-testid={`image-container-${image.id}`}
          >
            <div className="relative h-48 bg-gray-100 dark:bg-gray-700">
              {!image.loaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" data-testid={`loading-${image.id}`} />
                </div>
              )}
              {image.error ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-red-500" data-testid={`error-${image.id}`}>
                  <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-sm">Failed to load</p>
                </div>
              ) : (
                <img
                  ref={(el) => imageRef(el)}
                  data-id={image.id}
                  src={image.loaded ? image.src : image.placeholder}
                  alt={image.title}
                  loading="lazy"
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    image.loaded ? 'opacity-100' : 'opacity-50'
                  }`}
                  onError={() => handleImageError(image.id)}
                  data-testid={`image-${image.id}`}
                />
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">{image.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Status: {image.error ? '❌ Error' : image.loaded ? '✅ Loaded' : '⏳ Loading...'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Testing Hints */}
      <div className="mt-8 bg-indigo-900/20 border border-indigo-600 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-indigo-400 mb-2">🧪 Testing Hints</h3>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Use <code className="bg-gray-800 px-1 rounded">page.evaluate()</code> to scroll images into view</li>
          <li>• Assert src attribute changes from placeholder to actual image URL</li>
          <li>• Test <code className="bg-gray-800 px-1 rounded">loading="lazy"</code> attribute</li>
          <li>• Verify loading indicators appear before images load</li>
          <li>• Test error states by breaking image URLs</li>
          <li>• Count loaded images vs total images</li>
        </ul>
      </div>
    </div>
  );
}
