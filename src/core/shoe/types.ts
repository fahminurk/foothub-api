export type QueryProduct = {
  brand?: string;
  category?: string;
  subcategory?: string;
  orderBy?: 'asc' | 'desc';
  sortBy?: string;
  search?: string;
};
