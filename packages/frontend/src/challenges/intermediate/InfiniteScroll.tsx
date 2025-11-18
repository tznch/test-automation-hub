import { useState, useEffect, useRef } from 'react';

interface Post {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
}

export default function InfiniteScroll() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);

  const loadPosts = async (pageNum: number) => {
    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newPosts: Post[] = Array.from({ length: 10 }, (_, i) => {
      const id = (pageNum - 1) * 10 + i + 1;
      return {
        id,
        title: `Blog Post ${id}: Mastering Playwright Testing`,
        excerpt: `Learn advanced techniques for end-to-end testing with Playwright. This comprehensive guide covers best practices, common pitfalls, and expert tips for writing reliable tests.`,
        author: `Author ${(id % 5) + 1}`,
        date: new Date(Date.now() - id * 86400000).toLocaleDateString(),
      };
    });

    setPosts((prev) => [...prev, ...newPosts]);
    setLoading(false);

    if (pageNum >= 5) {
      setHasMore(false);
    }
  };

  useEffect(() => {
    loadPosts(page);
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [loading, hasMore]);

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Blog Posts</h2>

      <div className="space-y-4" data-testid="posts-container">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition"
            data-testid={`post-${post.id}`}
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{post.title}</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-3">{post.excerpt}</p>
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>By {post.author}</span>
              <span>{post.date}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Loader */}
      <div ref={loaderRef} className="py-8 text-center" data-testid="loader">
        {loading && (
          <div>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading more posts...</p>
          </div>
        )}
        {!hasMore && <p className="text-gray-500 dark:text-gray-400 font-medium">No more posts to load</p>}
      </div>

      {/* Stats */}
      <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Loaded {posts.length} posts {hasMore && `• Page ${page}`}
      </div>
    </div>
  );
}
