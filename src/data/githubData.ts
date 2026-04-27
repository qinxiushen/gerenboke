import { Post } from '../types';
import { posts as defaultPosts, allTags as defaultTags } from './posts';
import { createGitHubService, GitHubConfig } from '../services/githubApi';

const POSTS_PATH = 'src/data/posts.ts';
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

const generatePostsFileContent = (posts: Post[], tags: string[]): string => {
  const postsJson = posts.map((post) => `  {
    id: '${post.id}',
    title: '${post.title.replace(/'/g, "\\'")}',
    date: '${post.date}',
    excerpt: '${post.excerpt.replace(/'/g, "\\'")}',
    tags: [${post.tags.map((t) => `'${t}'`).join(', ')}],
    author: '${post.author}',
    readingTime: ${post.readingTime},
    content: \`${post.content.replace(/`/g, '\\`').replace(/\${/g, '\\${')}\`
  }`);

  return `import { Post } from '../types';

export const posts: Post[] = [
${postsJson.join(',\n')}
];

export const allTags: string[] = [${tags.map((t) => `'${t}'`).join(', ')}];
`;
};

const generateAdminFileContent = (admin: AdminData): string => {
  return `import { AdminData } from '../types';

export const adminData: AdminData = ${JSON.stringify(admin, null, 2)};
`;
};

export class GitHubDataProvider implements DataProvider {
  private service: ReturnType<typeof createGitHubService>;
  private owner: string;
  private repo: string;

  constructor(config: Omit<GitHubConfig, 'branch'>) {
    this.service = createGitHubService({ ...config, branch: 'main' });
    this.owner = config.owner;
    this.repo = config.repo;
  }

  async getPosts(): Promise<Post[]> {
    try {
      const file = await this.service.getFileContent(POSTS_PATH);
      const content = file.content;
      const match = content.match(/export const posts: Post\[\] = \[([\s\S]*?)\];\s*export const allTags/);
      if (!match) return defaultPosts;
      return defaultPosts;
    } catch {
      return defaultPosts;
    }
  }

  async getTags(): Promise<string[]> {
    try {
      const file = await this.service.getFileContent(POSTS_PATH);
      const content = file.content;
      const match = content.match(/export const allTags: string\[\] = \[(.*?)\];/);
      if (match) {
        return match[1].split(',').map((t: string) => t.trim().replace(/'/g, ''));
      }
      return defaultTags;
    } catch {
      return defaultTags;
    }
  }

  async savePost(post: Post): Promise<void> {
    const file = await this.service.getFileContent(POSTS_PATH);
    const content = file.content;

    let newContent: string;
    const existingPostMatch = content.match(
      new RegExp(`  \\{\\s*id: '${post.id}',[^}]+\\},?\\s*\\]`, 'm')
    );

    const postEntry = `  {
    id: '${post.id}',
    title: '${post.title.replace(/'/g, "\\'")}',
    date: '${post.date}',
    excerpt: '${post.excerpt.replace(/'/g, "\\'")}',
    tags: [${post.tags.map((t) => `'${t}'`).join(', ')}],
    author: '${post.author}',
    readingTime: ${post.readingTime},
    content: \`${post.content.replace(/`/g, '\\`').replace(/\${/g, '\\${')}\`
  }`;

    if (existingPostMatch) {
      newContent = content.replace(existingPostMatch[0], postEntry);
    } else {
      const insertPoint = content.lastIndexOf('];');
      newContent = content.slice(0, insertPoint) + ',\n' + postEntry + '\n' + content.slice(insertPoint);
    }

    await this.service.updateFile(
      POSTS_PATH,
      newContent,
      file.sha,
      `Update post: ${post.title}`
    );
  }

  async deletePost(id: string): Promise<void> {
    const file = await this.service.getFileContent(POSTS_PATH);
    const content = file.content;
    const regex = new RegExp(`  \\{\\s*id: '${id}',[\\s\\S]*?\\},?\\s*(?=\\[|export)`, 'm');
    const newContent = content.replace(regex, '');
    await this.service.updateFile(
      POSTS_PATH,
      newContent,
      file.sha,
      `Delete post: ${id}`
    );
  }

  async saveTags(tags: string[]): Promise<void> {
    const file = await this.service.getFileContent(POSTS_PATH);
    const content = file.content;
    const newContent = content.replace(
      /export const allTags: string\[\] = \[.*?\];/,
      `export const allTags: string[] = [${tags.map((t) => `'${t}'`).join(', ')}];`
    );
    await this.service.updateFile(
      POSTS_PATH,
      newContent,
      file.sha,
      `Update tags: ${tags.join(', ')}`
    );
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
  getPosts: async () => defaultPosts,
  getTags: async () => defaultTags,
  savePost: async () => { throw new Error('Local mode: save not supported'); },
  deletePost: async () => { throw new Error('Local mode: delete not supported'); },
  saveTags: async () => { throw new Error('Local mode: save not supported'); },
  triggerDeploy: async () => { throw new Error('Local mode: deploy not supported'); },
});
