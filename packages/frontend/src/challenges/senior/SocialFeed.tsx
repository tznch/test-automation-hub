import { useState, useEffect } from 'react';

interface Post {
  id: number;
  author: string;
  avatar: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timestamp: string;
  liked: boolean;
}

export default function SocialFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');

  const loadPosts = async (pageNum: number) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newPosts: Post[] = Array.from({ length: 5 }, (_, i) => {
      const id = (pageNum - 1) * 5 + i + 1;
      return {
        id,
        author: `User ${id}`,
        avatar: `👤`,
        content: `This is post #${id}. Testing Playwright with social media features! ${
          id % 3 === 0 ? '🚀' : id % 2 === 0 ? '💡' : '✨'
        }`,
        image:
          id % 4 === 0
            ? 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600'
            : undefined,
        likes: Math.floor(Math.random() * 100),
        comments: Math.floor(Math.random() * 20),
        timestamp: new Date(Date.now() - id * 3600000).toISOString(),
        liked: false,
      };
    });

    setPosts((prev) => [...prev, ...newPosts]);
    setLoading(false);

    if (pageNum >= 4) {
      setHasMore(false);
    }
  };

  useEffect(() => {
    loadPosts(page);
  }, [page]);

  const handleLike = (id: number) => {
    setPosts(
      posts.map((post) =>
        post.id === id
          ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
          : post
      )
    );
  };

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;

    const newPost: Post = {
      id: Date.now(),
      author: 'You',
      avatar: '😊',
      content: newPostContent,
      likes: 0,
      comments: 0,
      timestamp: new Date().toISOString(),
      liked: false,
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Social Feed</h2>

      {/* Create Post */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6">
        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
          rows={3}
          data-testid="new-post-input"
        />
        <div className="flex justify-end mt-2">
          <button
            onClick={handleCreatePost}
            disabled={!newPostContent.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="create-post-button"
          >
            Post
          </button>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-4" data-testid="posts-feed">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
            data-testid={`post-${post.id}`}
          >
            {/* Post Header */}
            <div className="p-4 flex items-center gap-3">
              <div className="text-3xl">{post.avatar}</div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white">{post.author}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{formatTime(post.timestamp)}</p>
              </div>
            </div>

            {/* Post Content */}
            <div className="px-4 pb-3">
              <p className="text-gray-800 dark:text-gray-300">{post.content}</p>
            </div>

            {/* Post Image */}
            {post.image && <img src={post.image} alt="Post" className="w-full h-64 object-cover" />}

            {/* Post Actions */}
            <div className="px-4 py-3 border-t border-gray-200 flex gap-4">
              <button
                onClick={() => handleLike(post.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition ${
                  post.liked ? 'text-red-600' : 'text-gray-600'
                }`}
                data-testid={`like-${post.id}`}
              >
                <svg
                  className="w-5 h-5"
                  fill={post.liked ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span className="text-sm font-medium">{post.likes}</span>
              </button>

              <button className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <span className="text-sm font-medium">{post.comments}</span>
              </button>

              <button className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-600 ml-auto">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="mt-6 text-center">
          {loading ? (
            <div className="py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            </div>
          ) : (
            <button
              onClick={() => setPage(page + 1)}
              className="bg-gray-200 hover:bg-gray-300 px-6 py-2 rounded-md"
              data-testid="load-more"
            >
              Load More Posts
            </button>
          )}
        </div>
      )}

      {!hasMore && (
        <p className="text-center text-gray-500 py-6">You've reached the end of the feed</p>
      )}
    </div>
  );
}
