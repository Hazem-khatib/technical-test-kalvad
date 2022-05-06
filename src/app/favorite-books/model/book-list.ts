export interface BooksList {
  [key: string]: Book[];
}
export interface Book {
  id: string;
  order?: number;
  title: string;
  author: string;
  year: number;
  listName?: string;
}
