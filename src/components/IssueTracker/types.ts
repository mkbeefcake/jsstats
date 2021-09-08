export interface IStatus {
  id: string;
  title: string;
  index: number;
}

export interface IIssueType {
  id: string;
  title: string;
  index: number;
}


export interface ITShirtSize {
  id: string;
  title: string;
  index: number;
}

export interface ITask {
  id: string;
  title: string;
  content: string;
  size: string;
  type: string;
  url: string;
  status: string;
  funded: number;
  assigneeId: number | null;
  creatorId: number | null;
  priority: number;
  updateDate: Date;
  creationDate: Date;
}

export interface IMember {
  id: number;
  name: string;
  avatar: string;
  creationDate: Date;
  updateDate: Date;
}

export interface IColumn {
  id: string;
  title: string;
}

export interface IColumnsData {
  columnOrder: string[];
  columns: { [key: string]: IColumn };
}
