const GITHUB_API = 'https://api.github.com';

export interface GitHubConfig {
  owner: string;
  repo: string;
  branch: string;
  token: string;
}

export interface FileContent {
  content: string;
  sha: string;
  path: string;
}

export class GitHubApiService {
  private config: GitHubConfig;

  constructor(config: GitHubConfig) {
    this.config = config;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${GITHUB_API}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.config.token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `GitHub API error: ${response.status}`);
    }

    return response.json();
  }

  async getFileContent(path: string): Promise<FileContent> {
    const data = await this.request<{
      content: string;
      sha: string;
      path: string;
    }>(
      `/repos/${this.config.owner}/${this.config.repo}/contents/${path}?ref=${this.config.branch}`
    );

    return {
      content: atob(data.content),
      sha: data.sha,
      path: data.path,
    };
  }

  async updateFile(
    path: string,
    content: string,
    sha: string,
    message: string
  ): Promise<void> {
    await this.request(
      `/repos/${this.config.owner}/${this.config.repo}/contents/${path}`,
      {
        method: 'PUT',
        body: JSON.stringify({
          message,
          content: btoa(unescape(encodeURIComponent(content))),
          sha,
          branch: this.config.branch,
        }),
      }
    );
  }

  async triggerWorkflow(workflowId: string = 'deploy.yml'): Promise<void> {
    await this.request(
      `/repos/${this.config.owner}/${this.config.repo}/actions/workflows/${workflowId}/dispatches`,
      {
        method: 'POST',
        body: JSON.stringify({
          ref: this.config.branch,
        }),
      }
    );
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.request(`/repos/${this.config.owner}/${this.config.repo}`);
      return true;
    } catch {
      return false;
    }
  }
}

export const createGitHubService = (config: GitHubConfig) =>
  new GitHubApiService(config);
