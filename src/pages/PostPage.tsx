import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Calendar, Clock, ArrowLeft, Tag } from 'lucide-react';
import Layout from '../components/Layout';
import { Post } from '../types';
import { posts as defaultPosts } from '../data/posts';
import { getPosts } from '../data/admin';
import 'highlight.js/styles/github-dark.css';

export default function PostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | undefined>();

  useEffect(() => {
    const storedPosts = getPosts();
    const allPosts = storedPosts.length > 0 ? storedPosts : defaultPosts;
    setPost(allPosts.find((p) => p.id === id));
  }, [id]);

  if (!post) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            文章不存在
          </h1>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            返回首页
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {/* 返回按钮 */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          返回
        </button>

        {/* 元信息 */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-500 mb-6">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {post.date}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {post.readingTime} 分钟阅读
          </span>
        </div>

        {/* 标签 */}
        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map((tag) => (
            <Link key={tag} to={`/tags?tag=${encodeURIComponent(tag)}`} className="tag-chip">
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </Link>
          ))}
        </div>

        {/* 标题 */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8 leading-tight">
          {post.title}
        </h1>

        {/* 分割线 */}
        <div className="h-px bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 mb-10 opacity-30"></div>

        {/* Markdown 内容 */}
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              // 自定义链接处理
              a: ({ href, children, ...props }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 dark:text-purple-400 hover:underline"
                  {...props}
                >
                  {children}
                </a>
              ),
              // 自定义代码块
              pre: ({ children, ...props }) => (
                <pre className="rounded-lg overflow-x-auto text-sm" {...props}>
                  {children}
                </pre>
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        {/* 底部导航 */}
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:underline font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            返回文章列表
          </Link>
        </div>
      </article>
    </Layout>
  );
}
