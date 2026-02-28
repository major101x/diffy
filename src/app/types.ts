export type User = {
  name: string;
  username: string;
  avatarUrl: string;
};

export type PullRequest = {
  id: number;
  title: string;
  body?: string;
  state: string;
  user: { login: string; avatar_url: string };
  created_at: string;
  updated_at: string;
  additions: number;
  deletions: number;
  changed_files: number;
  commits: number;
  head: {
    repo: {
      full_name: string;
    };
  };
};

export type Comment = {
  id: number;
  user: User;
  body: string;
  filePath: string;
  lineNumber: number;
  createdAt: Date;
};
