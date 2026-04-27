import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Settings, FileText, Tag, Lock, Save, Plus, Trash2, Edit2, X, Check, LogOut, GitHub, RefreshCw, Upload, User, CheckCircle, AlertCircle } from 'lucide-react';
import Layout from '../components/Layout';
import type { Post } from '../types';
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
import { getGitHubProvider, defaultAdminData, AdminData, GitHubDataProvider } from '../data/githubData';

type Tab = 'posts' | 'tags' | 'password' | 'github' | 'about';

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

  // GitHub 配置
  const [githubToken, setGithubToken] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [connectError, setConnectError] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);

  // 关于页面
  const [adminData, setAdminData] = useState<AdminData>(defaultAdminData);
  const [aboutSaving, setAboutSaving] = useState(false);

  // 数据提供者
  const [dataProvider, setDataProvider] = useState<GitHubDataProvider | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem('blog_admin_logged_in') === 'true') {
      setIsLoggedIn(true);
      loadData();
      loadGitHubConfig();
    }
  }, []);

  const loadData = () => {
    setPosts(getPosts());
    setCustomTags(getCustomTags());
  };

  const loadGitHubConfig = () => {
    const savedToken = localStorage.getItem('github_token');
    if (savedToken) {
      setGithubToken(savedToken);
      testConnection(savedToken);
    }
  };

  const testConnection = async (token: string) => {
    try {
      const provider = getGitHubProvider(token) as GitHubDataProvider;
      const connected = await provider['service'].verifyConnection();
      setIsConnected(connected);
      if (connected) {
        setDataProvider(provider);
        setConnectError('');
      } else {
        setConnectError('无法连接到 GitHub，请检查 Token');
      }
    } catch {
      setIsConnected(false);
      setConnectError('Token 无效或已过期');
    }
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
  const handleSavePost = async (post: Post) => {
    if (dataProvider) {
      setIsSyncing(true);
      try {
        await dataProvider.savePost(post);
        setSyncMessage({ type: 'success', text: '文章已保存到 GitHub' });
        loadData();
        setEditingPost(null);
        setIsCreating(false);
      } catch (e: any) {
        setSyncMessage({ type: 'error', text: e.message || '保存失败' });
      } finally {
        setIsSyncing(false);
      }
    } else {
      if (editingPost) {
        updatePost(post);
      } else {
        addPost(post);
      }
      setEditingPost(null);
      setIsCreating(false);
      loadData();
      setSyncMessage({ type: 'error', text: '未连接 GitHub，仅本地保存' });
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('确定要删除这篇文章吗？')) return;
    
    if (dataProvider) {
      setIsSyncing(true);
      try {
        await dataProvider.deletePost(id);
        setSyncMessage({ type: 'success', text: '文章已从 GitHub 删除' });
      } catch (e: any) {
        setSyncMessage({ type: 'error', text: e.message || '删除失败' });
      } finally {
        setIsSyncing(false);
      }
    }
    deletePost(id);
    loadData();
  };

  // 标签操作
  const handleAddTag = async () => {
    if (!newTag.trim()) return;
    if ([...defaultTags, ...customTags].includes(newTag.trim())) return;

    if (dataProvider) {
      setIsSyncing(true);
      try {
        await dataProvider.saveTags([...customTags, newTag.trim()]);
        setSyncMessage({ type: 'success', text: '标签已保存到 GitHub' });
      } catch {
        setSyncMessage({ type: 'error', text: '保存失败' });
      } finally {
        setIsSyncing(false);
      }
    }
    addCustomTag(newTag.trim());
    setNewTag('');
    loadData();
  };

  const handleDeleteTag = async (tag: string) => {
    if (!confirm(`确定要删除标签 "${tag}" 吗？`)) return;

    if (dataProvider) {
      setIsSyncing(true);
      try {
        await dataProvider.saveTags(customTags.filter(t => t !== tag));
        setSyncMessage({ type: 'success', text: '标签已从 GitHub 删除' });
      } catch {
        setSyncMessage({ type: 'error', text: '删除失败' });
      } finally {
        setIsSyncing(false);
      }
    }
    deleteCustomTag(tag);
    loadData();
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

  // GitHub 连接
  const handleConnectGitHub = async () => {
    if (!githubToken.trim()) {
      setConnectError('请输入 Token');
      return;
    }
    setConnectError('');
    localStorage.setItem('github_token', githubToken.trim());
    await testConnection(githubToken.trim());
  };

  const handleDisconnectGitHub = () => {
    localStorage.removeItem('github_token');
    setGithubToken('');
    setIsConnected(false);
    setDataProvider(null);
    setConnectError('');
  };

  const handleDeploy = async () => {
    if (!dataProvider) {
      setSyncMessage({ type: 'error', text: '请先连接 GitHub' });
      return;
    }
    setIsDeploying(true);
    try {
      await dataProvider.triggerDeploy();
      setSyncMessage({ type: 'success', text: '部署已触发！博客将在几分钟后更新...' });
    } catch (e: any) {
      setSyncMessage({ type: 'error', text: e.message || '部署触发失败' });
    } finally {
      setIsDeploying(false);
    }
  };

  // 关于页面保存
  const handleSaveAbout = async () => {
    if (dataProvider) {
      setAboutSaving(true);
      try {
        await dataProvider.saveAdmin(adminData);
        setSyncMessage({ type: 'success', text: '关于页面已保存到 GitHub' });
      } catch (e: any) {
        setSyncMessage({ type: 'error', text: e.message || '保存失败' });
      } finally {
        setAboutSaving(false);
      }
    } else {
      localStorage.setItem('admin_data', JSON.stringify(adminData));
      setSyncMessage({ type: 'error', text: '未连接 GitHub，仅本地保存' });
    }
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
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isConnected ? (
                  <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> 已连接 GitHub
                  </span>
                ) : (
                  <span className="text-orange-500">未连接 GitHub</span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isConnected && (
              <button
                onClick={handleDeploy}
                disabled={isDeploying}
                className="btn btn-primary flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                {isDeploying ? '发布中...' : '发布博客'}
              </button>
            )}
            <button onClick={handleLogout} className="btn btn-ghost flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              退出
            </button>
          </div>
        </div>

        {/* 同步消息 */}
        {syncMessage && (
          <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
            syncMessage.type === 'success' 
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
          }`}>
            {syncMessage.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {syncMessage.text}
            <button onClick={() => setSyncMessage(null)} className="ml-auto"><X className="w-4 h-4" /></button>
          </div>
        )}

        {/* 标签页 */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          {[
            { key: 'posts' as Tab, label: '文章管理', icon: FileText },
            { key: 'tags' as Tab, label: '标签管理', icon: Tag },
            { key: 'about' as Tab, label: '关于页面', icon: User },
            { key: 'github' as Tab, label: 'GitHub', icon: GitHub },
            { key: 'password' as Tab, label: '修改密码', icon: Lock },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
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

            {(isCreating || editingPost) && (
              <PostEditor
                post={editingPost!}
                onSave={handleSavePost}
                onCancel={() => {
                  setIsCreating(false);
                  setEditingPost(null);
                }}
                isSyncing={isSyncing}
              />
            )}

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
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">内置标签（不可删除）</h2>
            <div className="flex flex-wrap gap-2 mb-8">
              {defaultTags.map((tag) => (
                <span key={tag} className="tag-chip bg-gray-100 dark:bg-gray-800">
                  {tag}
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

        {/* 关于页面 */}
        {activeTab === 'about' && (
          <div className="max-w-2xl">
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">关于页面设置</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">昵称</label>
                    <input
                      type="text"
                      value={adminData.name}
                      onChange={(e) => setAdminData({ ...adminData, name: e.target.value })}
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">头像字母</label>
                    <input
                      type="text"
                      value={adminData.avatar}
                      onChange={(e) => setAdminData({ ...adminData, avatar: e.target.value })}
                      className="input w-full"
                      maxLength={1}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">简介</label>
                  <input
                    type="text"
                    value={adminData.bio}
                    onChange={(e) => setAdminData({ ...adminData, bio: e.target.value })}
                    className="input w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GitHub 链接</label>
                  <input
                    type="url"
                    value={adminData.github}
                    onChange={(e) => setAdminData({ ...adminData, github: e.target.value })}
                    className="input w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">邮箱</label>
                  <input
                    type="email"
                    value={adminData.email}
                    onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
                    className="input w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">前端技能</label>
                  <input
                    type="text"
                    value={adminData.skills.frontend.join(', ')}
                    onChange={(e) => setAdminData({
                      ...adminData,
                      skills: { ...adminData.skills, frontend: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }
                    })}
                    className="input w-full"
                    placeholder="用逗号分隔"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">后端技能</label>
                  <input
                    type="text"
                    value={adminData.skills.backend.join(', ')}
                    onChange={(e) => setAdminData({
                      ...adminData,
                      skills: { ...adminData.skills, backend: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }
                    })}
                    className="input w-full"
                    placeholder="用逗号分隔"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">效率工具</label>
                  <input
                    type="text"
                    value={adminData.skills.tools.join(', ')}
                    onChange={(e) => setAdminData({
                      ...adminData,
                      skills: { ...adminData.skills, tools: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }
                    })}
                    className="input w-full"
                    placeholder="用逗号分隔"
                  />
                </div>

                <button onClick={handleSaveAbout} className="btn btn-primary w-full flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" />
                  {aboutSaving ? '保存中...' : '保存关于页面'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* GitHub 配置 */}
        {activeTab === 'github' && (
          <div className="max-w-2xl">
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-6">
                <GitHub className="w-6 h-6 text-gray-900 dark:text-gray-100" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">GitHub 连接</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">连接后可直接从后台管理博客内容</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Personal Access Token
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={githubToken}
                      onChange={(e) => setGithubToken(e.target.value)}
                      placeholder="ghp_xxxxxxxxxxxx"
                      className="input flex-1"
                      disabled={isConnected}
                    />
                    {isConnected ? (
                      <button onClick={handleDisconnectGitHub} className="btn btn-ghost text-red-500">
                        断开
                      </button>
                    ) : (
                      <button onClick={handleConnectGitHub} className="btn btn-primary flex items-center gap-2">
                        <RefreshCw className="w-4 h-4" />
                        连接
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    需要 repo 权限。{' '}
                    <a
                      href="https://github.com/settings/tokens/new?scopes=repo"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:underline"
                    >
                      去生成 Token →
                    </a>
                  </p>
                </div>

                {connectError && (
                  <p className="text-red-500 text-sm">{connectError}</p>
                )}

                {isConnected && (
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">已成功连接到 qinxiushen/gerenboke</span>
                    </div>
                    <p className="text-sm text-green-600 dark:text-green-500 mt-1">
                      保存文章、标签或关于页面后，点击「发布博客」即可更新网站
                    </p>
                  </div>
                )}

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">使用方法</h3>
                  <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-decimal list-inside">
                    <li>在 GitHub 生成 Personal Access Token（需要 repo 权限）</li>
                    <li>将 Token 粘贴到上方输入框并点击「连接」</li>
                    <li>连接成功后，编辑文章、标签或关于页面</li>
                    <li>点击「保存」后，再点击「发布博客」即可更新网站</li>
                  </ol>
                </div>
              </div>
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
function PostEditor({ post, onSave, onCancel, isSyncing }: { post: Post; onSave: (post: Post) => void; onCancel: () => void; isSyncing: boolean }) {
  const [form, setForm] = useState<Post>({ ...post });
  const allTagOptions = [...new Set([...defaultTags, ...getCustomTags()])];
  const [selectedTags, setSelectedTags] = useState<string[]>(post.tags || []);

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
    setForm((prev) => ({ ...prev, tags: newTags }));
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
          <button onClick={handleSave} disabled={isSyncing} className="btn btn-primary flex items-center gap-2">
            <Save className="w-4 h-4" />
            {isSyncing ? '保存中...' : '保存'}
          </button>
        </div>
      </div>
    </div>
  );
}
