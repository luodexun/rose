import  Pagination from "./pagination"
export interface Results {
  id: number;
  title: string;
  main_img: string;
  sale: number;
}
export interface Goods {
  metadata: Pagination;
  results?: Results[];
}
