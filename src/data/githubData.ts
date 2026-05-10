import type { Post } from '../types';
import { fallbackPosts, fallbackTags } from './fallback';
import { createGitHubService } from '../services/githubApi';
import type { GitHubConfig } from '../services/githubApi';

const POSTS_PATH = 'public/data/posts.json';
const TAGS_PATH = 'public/data/tags.json';
const ADMIN_PATH = 'src/data/admin.ts';

export interface DataProvider {
  getPosts(): Promise<Post[]>;
  getTags(): Promise<string[]>;
  savePost(post: Post): Promise<void>;
  deletePost(id: string): Promise<void>;
  saveTags(tags: string[]): Promise<void>;
  triggerDeploy(): Promise<void>;
}

export interface AdminData {
  name: string;
  bio: string;
  avatar: string;
  skills: {
    frontend: string[];
    backend: string[];
    tools: string[];
  };
  github: string;
  email: string;
}

export const defaultAdminData: AdminData = {
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

const generateAdminFileContent = (admin: AdminData): string => {
  return `import type { AdminData } from '../types';

export const adminData: AdminData = ${JSON.stringify(admin, null, 2)};
`;
};

export class GitHubDataProvider implements DataProvider {
  private service: ReturnType<typeof createGitHubService>;

  constructor(config: Omit<GitHubConfig, 'branch'>) {
    this.service = createGitHubService({ ...config, branch: 'main' });
  }

  async getPosts(): Promise<Post[]> {
    try {
      const file = await this.service.getFileContent(POSTS_PATH);
      return JSON.parse(file.content);
    } catch {
      return fallbackPosts;
    }
  }

  async getTags(): Promise<string[]> {
    try {
      const file = await this.service.getFileContent(TAGS_PATH);
      const tags: string[] = JSON.parse(file.content);
      return tags;
    } catch {
      return fallbackTags;
    }
  }

  async savePost(post: Post): Promise<void> {
    // Get current posts
    let posts: Post[] = [];
    try {
      const file = await this.service.getFileContent(POSTS_PATH);
      posts = JSON.parse(file.content);
      const sha = file.sha;
      
      // Update or add post
      const index = posts.findIndex(p => p.id === post.id);
      if (index >= 0) {
        posts[index] = post;
      } else {
        posts.unshift(post);
      }
      
      await this.service.updateFile(
        POSTS_PATH,
        JSON.stringify(posts, null, 2),
        sha,
        `Update post: ${post.title}`
      );
    } catch (e) {
      // File doesn't exist, create it
      await this.service.updateFile(
        POSTS_PATH,
        JSON.stringify([post], null, 2),
        '',
        `Create posts.json with: ${post.title}`
      );
    }
  }

  async deletePost(id: string): Promise<void> {
    try {
      const file = await this.service.getFileContent(POSTS_PATH);
      const posts: Post[] = JSON.parse(file.content);
      const newPosts = posts.filter(p => p.id !== id);
      
      await this.service.updateFile(
        POSTS_PATH,
        JSON.stringify(newPosts, null, 2),
        file.sha,
        `Delete post: ${id}`
      );
    } catch {
      // Ignore if file doesn't exist
    }
  }

  async saveTags(tags: string[]): Promise<void> {
    try {
      const file = await this.service.getFileContent(TAGS_PATH);
      await this.service.updateFile(
        TAGS_PATH,
        JSON.stringify(tags, null, 2),
        file.sha,
        `Update tags: ${tags.join(', ')}`
      );
    } catch {
      await this.service.updateFile(
        TAGS_PATH,
        JSON.stringify(tags, null, 2),
        '',
        `Create tags.json`
      );
    }
  }

  async triggerDeploy(): Promise<void> {
    await this.service.triggerWorkflow('deploy.yml');
  }

  async saveAdmin(admin: AdminData): Promise<void> {
    const content = generateAdminFileContent(admin);
    try {
      const file = await this.service.getFileContent(ADMIN_PATH);
      await this.service.updateFile(ADMIN_PATH, content, file.sha, 'Update admin data');
    } catch {
      await this.service.updateFile(
        ADMIN_PATH,
        content,
        '',
        'Add admin data'
      );
    }
  }
}

let cachedProvider: GitHubDataProvider | null = null;

export const getGitHubProvider = (token: string): DataProvider => {
  if (!cachedProvider || cachedProvider['service']['config']['token'] !== token) {
    cachedProvider = new GitHubDataProvider({
      owner: 'qinxiushen',
      repo: 'gerenboke',
      token,
    });
  }
  return cachedProvider;
};

export const useLocalData = (): DataProvider => ({
  getPosts: async () => fallbackPosts,
  getTags: async () => fallbackTags,
  savePost: async () => { throw new Error('Local mode: save not supported'); },
  deletePost: async () => { throw new Error('Local mode: delete not supported'); },
  saveTags: async () => { throw new Error('Local mode: save not supported'); },
  triggerDeploy: async () => { throw new Error('Local mode: deploy not supported'); },
});
