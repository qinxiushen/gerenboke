import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Settings, FileText, Tag, Lock, Save, Plus, Trash2, Edit2, X, Check, LogOut, ChevronRight } from 'lucide-react';
import Layout from '../components/Layout';
import { Post } from '../types';
import {
  getPosts,
  addPost,
  updatePost,
  deletePost,
  getCustomTags,
  addCustomTag,
  deleteCustomTag,
  getPassword,
  setPassword,
  verifyPassword,
  setLoginStatus,
} from '../data/admin';
import { allTags as defaultTags } from '../data/posts';

type Tab = 'posts' | 'tags' | 'password';

export default function AdminPage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('posts');

  // 文章管理
  const [posts, setPosts] = useState<Post[]>([]);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // 标签管理
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  // 密码修改
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');

  useEffect(() => {
    // 检查登录状态
    if (sessionStorage.getItem('blog_admin_logged_in') === 'true') {
      setIsLoggedIn(true);
      loadData();
    }
  }, []);

  const loadData = () => {
    setPosts(getPosts());
    setCustomTags(getCustomTags());
  };

  const handleLogin = () => {
    if (verifyPassword(loginPassword)) {
      setIsLoggedIn(true);
      setLoginStatus(true);
      loadData();
      setLoginError('');
    } else {
      setLoginError('密码错误');
    }
  };

  const handleLogout = () => {
    setLoginStatus(false);
    navigate('/');
  };

  // 文章操作
  const handleSavePost = (post: Post) => {
    if (editingPost) {
      updatePost(post);
    } else {
      addPost(post);
    }
    setEditingPost(null);
    setIsCreating(false);
    loadData();
  };

  const handleDeletePost = (id: string) => {
    if (confirm('确定要删除这篇文章吗？')) {
      deletePost(id);
      loadData();
    }
  };

  // 标签操作
  const handleAddTag = () => {
    if (newTag.trim() && !defaultTags.includes(newTag.trim()) && !customTags.includes(newTag.trim())) {
      addCustomTag(newTag.trim());
      setNewTag('');
      loadData();
    }
  };

  const handleDeleteTag = (tag: string) => {
    if (confirm(`确定要删除标签 "${tag}" 吗？`)) {
      deleteCustomTag(tag);
      loadData();
    }
  };

  // 密码修改
  const handleChangePassword = () => {
    setPwdError('');
    setPwdSuccess('');

    if (!verifyPassword(currentPwd)) {
      setPwdError('当前密码错误');
      return;
    }

    if (newPwd.length < 6) {
      setPwdError('新密码至少6位');
      return;
    }

    if (newPwd !== confirmPwd) {
      setPwdError('两次输入的新密码不一致');
      return;
    }

    setPassword(newPwd);
    setPwdSuccess('密码修改成功！');
    setCurrentPwd('');
    setNewPwd('');
    setConfirmPwd('');
  };

  // 登录页面
  if (!isLoggedIn) {
    return (
      <Layout>
        <div className="max-w-md mx-auto mt-20">
          <div className="card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Lock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">管理后台</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">请输入密码登录</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="输入密码"
                  className="input w-full"
                />
              </div>

              {loginError && (
                <p className="text-red-500 text-sm">{loginError}</p>
              )}

              <button onClick={handleLogin} className="btn btn-primary w-full">
                登录
              </button>

              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                <Link to="/" className="text-purple-600 dark:text-purple-400 hover:underline">
                  返回首页
                </Link>
              </p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Settings className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">管理后台</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">管理文章、标签和设置</p>
            </div>
          </div>
          <button onClick={handleLogout} className="btn btn-ghost flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            退出登录
          </button>
        </div>

        {/* 标签页 */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
          {[
            { key: 'posts' as Tab, label: '文章管理', icon: FileText },
            { key: 'tags' as Tab, label: '标签管理', icon: Tag },
            { key: 'password' as Tab, label: '修改密码', icon: Lock },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === key
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* 文章管理 */}
        {activeTab === 'posts' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">文章列表</h2>
              <button
                onClick={() => {
                  setIsCreating(true);
                  setEditingPost({
                    id: Date.now().toString(),
                    title: '',
                    date: new Date().toISOString().split('T')[0],
                    excerpt: '',
                    content: '',
                    tags: [],
                    author: '博主',
                    readingTime: 1,
                  });
                }}
                className="btn btn-primary flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                新建文章
              </button>
            </div>

            {/* 新建/编辑文章 */}
            {(isCreating || editingPost) && (
              <PostEditor
                post={editingPost!}
                onSave={handleSavePost}
                onCancel={() => {
                  setIsCreating(false);
                  setEditingPost(null);
                }}
              />
            )}

            {/* 文章列表 */}
            <div className="space-y-3">
              {posts.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">暂无文章</p>
              ) : (
                posts.map((post) => (
                  <div key={post.id} className="card p-4 flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                          {post.title}
                        </h3>
                        <span className="text-sm text-gray-400">{post.date}</span>
                      </div>
                      <div className="flex gap-1 flex-wrap">
                        {post.tags.map((tag) => (
                          <span key={tag} className="tag-chip text-xs">{tag}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => {
                          setEditingPost(post);
                          setIsCreating(false);
                        }}
                        className="btn btn-ghost p-2"
                        title="编辑"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="btn btn-ghost p-2 text-red-500 hover:text-red-600"
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 标签管理 */}
        {activeTab === 'tags' && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">内置标签</h2>
            <div className="flex flex-wrap gap-2 mb-8">
              {defaultTags.map((tag) => (
                <span key={tag} className="tag-chip bg-gray-100 dark:bg-gray-800">
                  {tag}
                  <X className="w-3 h-3 opacity-50" />
                </span>
              ))}
            </div>

            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">自定义标签</h2>
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                placeholder="输入新标签"
                className="input flex-1"
              />
              <button onClick={handleAddTag} className="btn btn-primary flex items-center gap-2">
                <Plus className="w-4 h-4" />
                添加
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {customTags.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">暂无自定义标签</p>
              ) : (
                customTags.map((tag) => (
                  <span
                    key={tag}
                    className="tag-chip cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400"
                    onClick={() => handleDeleteTag(tag)}
                  >
                    {tag}
                    <X className="w-3 h-3" />
                  </span>
                ))
              )}
            </div>
          </div>
        )}

        {/* 修改密码 */}
        {activeTab === 'password' && (
          <div className="max-w-md">
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">修改密码</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    当前密码
                  </label>
                  <input
                    type="password"
                    value={currentPwd}
                    onChange={(e) => setCurrentPwd(e.target.value)}
                    className="input w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    新密码
                  </label>
                  <input
                    type="password"
                    value={newPwd}
                    onChange={(e) => setNewPwd(e.target.value)}
                    placeholder="至少6位"
                    className="input w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    确认新密码
                  </label>
                  <input
                    type="password"
                    value={confirmPwd}
                    onChange={(e) => setConfirmPwd(e.target.value)}
                    className="input w-full"
                  />
                </div>

                {pwdError && (
                  <p className="text-red-500 text-sm">{pwdError}</p>
                )}

                {pwdSuccess && (
                  <p className="text-green-500 text-sm">{pwdSuccess}</p>
                )}

                <button onClick={handleChangePassword} className="btn btn-primary w-full flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" />
                  保存新密码
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

// 文章编辑器组件
function PostEditor({ post, onSave, onCancel }: { post: Post; onSave: (post: Post) => void; onCancel: () => void }) {
  const [form, setForm] = useState<Post>({ ...post });
  const allTagOptions = [...new Set([...defaultTags, ...getCustomTags()])];
  const [selectedTags, setSelectedTags] = useState<string[]>(post.tags || []);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setForm((prev) => ({
      ...prev,
      tags: selectedTags.includes(tag)
        ? selectedTags.filter((t) => t !== tag)
        : [...selectedTags, tag],
    }));
  };

  const handleSave = () => {
    const readingTime = Math.max(1, Math.ceil(form.content.split(/\s+/).length / 200));
    onSave({
      ...form,
      tags: selectedTags,
      readingTime,
    });
  };

  return (
    <div className="card p-6 mb-6 border-purple-200 dark:border-purple-800">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        {post.title ? '编辑文章' : '新建文章'}
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">标题</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="input w-full"
            placeholder="文章标题"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">日期</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="input w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">作者</label>
            <input
              type="text"
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              className="input w-full"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">摘要</label>
          <textarea
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            className="input w-full h-20 resize-none"
            placeholder="文章摘要"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">标签</label>
          <div className="flex flex-wrap gap-2">
            {allTagOptions.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {selectedTags.includes(tag) && <Check className="w-3 h-3 inline mr-1" />}
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">正文 (Markdown)</label>
          <textarea
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="input w-full h-64 font-mono text-sm resize-none"
            placeholder="使用 Markdown 编写文章内容..."
          />
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="btn btn-ghost">
            取消
          </button>
          <button onClick={handleSave} className="btn btn-primary flex items-center gap-2">
            <Save className="w-4 h-4" />
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
