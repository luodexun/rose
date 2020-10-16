import  Pagination from "./pagination"
export interface Results {
  id: number;
  cover: string;
  title: string;
  url: string;
}
export interface Video {
  metadata: Pagination;
  results?: Results[];
}
