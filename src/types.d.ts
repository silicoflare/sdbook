export interface Note {
  noteID: string;
  creatorID: string;
  title: string;
  markdown: string;
  visibility: number;
  updatedAt: Date;
}

export interface User {
  username: string;
  password?: string;
  role: string;
}
