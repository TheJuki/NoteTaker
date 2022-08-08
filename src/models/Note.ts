export interface Note {
  _id: string | undefined,
  content: string,
  title: string,
  categories: string[],
  createdDate: Date,
  updatedDate: Date
}