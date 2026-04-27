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
