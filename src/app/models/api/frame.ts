import  Pagination from "./pagination"
export interface Results {
  id: number;
  cate: number;
  select_img: string;
  show_img: string;
}
export interface Frame {
  metadata: Pagination;
  results?: Results[];
}
