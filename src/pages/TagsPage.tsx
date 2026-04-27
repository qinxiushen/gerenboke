import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Tag, ArrowRight, ArrowLeft } from 'lucide-react';
import Layout from '../components/Layout';
import { Post } from '../types';
import { posts as defaultPosts, allTags as defaultTags } from '../data/posts';
import { getPosts, getCustomTags } from '../data/admin';

export default function TagsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [customTags, setCustomTags] = useState<string[]>([]);
  const selectedTag = searchParams.get('tag');

  useEffect(() => {
    const storedPosts = getPosts();
    setPosts(storedPosts.length > 0 ? storedPosts : defaultPosts);
    setCustomTags(getCustomTags());
  }, []);

  const allTags = [...new Set([...defaultTags, ...customTags])];

  // 统计每个标签的文章数量
  const tagCounts = allTags.reduce<Record<string, number>>((acc, tag) => {
    acc[tag] = posts.filter((p) => p.tags.includes(tag)).length;
    return acc;
  }, {});

  // 筛选文章
  const filteredPosts = selectedTag
    ? posts.filter((p) => p.tags.includes(selectedTag))
    : [];

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Tag className="w-5 h-5 text-white" />
          </div>
          标签分类
        </h1>

        {/* 标签云 */}
        {!selectedTag && (
          <div className="mb-12">
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              点击任意标签，查看该分类下的所有文章
            </p>
            <div className="flex flex-wrap gap-3">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearchParams({ tag })}
                  className="tag-chip text-base px-4 py-2"
                >
                  {tag}
                  <span className="ml-2 text-xs opacity-70">({tagCounts[tag]})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 选中标签后的文章列表 */}
        {selectedTag && (
          <div>
            <button
              onClick={() => setSearchParams({})}
              className="mb-6 inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              返回标签列表
            </button>

            <div className="mb-6 flex items-center gap-3">
              <span className="tag-chip text-lg px-4 py-2">
                <Tag className="w-4 h-4 mr-2" />
                {selectedTag}
              </span>
              <span className="text-gray-500 dark:text-gray-500">
                共 {filteredPosts.length} 篇文章
              </span>
            </div>

            <div className="grid gap-5">
              {filteredPosts.map((post) => (
                <article key={post.id} className="card p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        <Link
                          to={`/post/${post.id}`}
                          className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                        >
                          {post.title}
                        </Link>
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                        <span>{post.date}</span>
                        <span>{post.readingTime} 分钟阅读</span>
                      </div>
                    </div>
                    <Link
                      to={`/post/${post.id}`}
                      className="text-purple-600 dark:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
