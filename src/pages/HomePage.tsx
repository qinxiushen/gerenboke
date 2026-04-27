import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Tag, ArrowRight } from 'lucide-react';
import Layout from '../components/Layout';
import { Post } from '../types';
import { posts as defaultPosts } from '../data/posts';
import { getPosts } from '../data/admin';

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    // 优先从 localStorage 读取，否则使用默认数据
    const storedPosts = getPosts();
    setPosts(storedPosts.length > 0 ? storedPosts : defaultPosts);
  }, []);
  return (
    <Layout>
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          欢迎来到我的博客
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          分享技术与生活，记录成长与思考。在这里，你可以找到关于前端开发、后端架构、效率工具等方面的文章。
        </p>
      </section>

      {/* 文章列表 */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8 flex items-center gap-2">
          <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
          最新文章
        </h2>

        <div className="grid gap-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="card p-6 hover:border-purple-300 dark:hover:border-purple-700 transition-all group"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                {/* 内容区 */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.map((tag) => (
                      <span key={tag} className="tag-chip">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Link to={`/post/${post.id}`} className="group/link">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover/link:text-purple-600 dark:group-hover/link:text-purple-400 transition-colors">
                      {post.title}
                    </h3>
                  </Link>

                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.readingTime} 分钟阅读
                    </span>
                    <span className="flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      {post.author}
                    </span>
                  </div>
                </div>

                {/* 箭头 */}
                <div className="sm:self-center">
                  <Link
                    to={`/post/${post.id}`}
                    className="inline-flex items-center gap-1 text-purple-600 dark:text-purple-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    阅读全文
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  );
}
