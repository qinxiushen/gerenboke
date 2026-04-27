export interface Post {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  tags: string[];
  author: string;
  readingTime: number;
}

export interface Tag {
  name: string;
  count: number;
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
