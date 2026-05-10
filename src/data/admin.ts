import type { AdminData, Post } from '../types';

const STORAGE_KEY = 'blog_admin_password';
const POSTS_KEY = 'blog_posts';
const CUSTOM_TAGS_KEY = 'blog_custom_tags';

const DEFAULT_PASSWORD = 'admin123';

// 密码管理
export function getPassword(): string {
  return localStorage.getItem(STORAGE_KEY) || DEFAULT_PASSWORD;
}

export function setPassword(password: string): void {
  localStorage.setItem(STORAGE_KEY, password);
}

export function verifyPassword(input: string): boolean {
  return input === getPassword();
}

// 登录状态
export function getLoginStatus(): boolean {
  return sessionStorage.getItem('blog_admin_logged_in') === 'true';
}

export function setLoginStatus(status: boolean): void {
  if (status) {
    sessionStorage.setItem('blog_admin_logged_in', 'true');
  } else {
    sessionStorage.removeItem('blog_admin_logged_in');
  }
}

// 文章管理
export function getPosts(): Post[] {
  const stored = localStorage.getItem(POSTS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  return [];
}

export function setPosts(posts: Post[]): void {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}

export function addPost(post: Post): void {
  const posts = getPosts();
  posts.unshift(post);
  setPosts(posts);
}

export function updatePost(post: Post): void {
  const posts = getPosts();
  const index = posts.findIndex(p => p.id === post.id);
  if (index !== -1) {
    posts[index] = post;
    setPosts(posts);
  }
}

export function deletePost(id: string): void {
  const posts = getPosts().filter(p => p.id !== id);
  setPosts(posts);
}

// 标签管理
export function getCustomTags(): string[] {
  const stored = localStorage.getItem(CUSTOM_TAGS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  return [];
}

export function setCustomTags(tags: string[]): void {
  localStorage.setItem(CUSTOM_TAGS_KEY, JSON.stringify(tags));
}

export function addCustomTag(tag: string): void {
  const tags = getCustomTags();
  if (!tags.includes(tag)) {
    tags.push(tag);
    setCustomTags(tags);
  }
}

export function deleteCustomTag(tag: string): void {
  const tags = getCustomTags().filter(t => t !== tag);
  setCustomTags(tags);
}

// 关于页面数据
export function getAdminData(): AdminData {
  const stored = localStorage.getItem('admin_data');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // ignore
    }
  }
  return {
    name: '博主',
    bio: '全栈开发 / 技术写作者',
    avatar: 'B',
    skills: {
      frontend: ['React', 'Vue', 'TypeScript'],
      backend: ['Node.js', 'Python', 'Go'],
      tools: ['Git', 'Docker', 'CI/CD'],
    },
    github: 'https://github.com/qinxiushen',
    email: 'hello@example.com',
  };
}

export function setAdminData(data: AdminData): void {
  localStorage.setItem('admin_data', JSON.stringify(data));
}
