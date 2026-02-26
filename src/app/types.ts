export type User = {
  name: string;
  username: string;
  avatarUrl: string;
};

export type Comment = {
  id: number;
  user: User;
  body: string;
  filePath: string;
  lineNumber: number;
  createdAt: Date;
};
