export interface Product {
  id: string;
  title: string;
  price: number;
  main_image: string | null;
  channel: string | null;
  category: string | null;
  item_id: string;
  shop_name: string | null;
  qc_image_group_map: any | null;
  created_at: string | null;
  updated_at: string | null;
  item_id_base: string | null;
}

export type DatabaseCategory = 
  | 'hoodies'
  | 'accessories'
  | 'jackets'
  | 'others'
  | 'shoes'
  | 't_shirts'
  | 'pants';

export type DisplayCategory = 
  | 'Hoodies & Sweaters'
  | 'Accessories'
  | 'Jackets'
  | 'Others'
  | 'Shoes'
  | 'T-Shirts'
  | 'Pants & Shorts';

export interface ProductFilters {
  category?: DisplayCategory;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}

export const categoryMapping: Record<DatabaseCategory, DisplayCategory> = {
  hoodies: 'Hoodies & Sweaters',
  accessories: 'Accessories',
  jackets: 'Jackets',
  others: 'Others',
  shoes: 'Shoes',
  t_shirts: 'T-Shirts',
  pants: 'Pants & Shorts'
};

export const reverseCategoryMapping: Record<DisplayCategory, DatabaseCategory> = {
  'Hoodies & Sweaters': 'hoodies',
  'Accessories': 'accessories',
  'Jackets': 'jackets',
  'Others': 'others',
  'Shoes': 'shoes',
  'T-Shirts': 't_shirts',
  'Pants & Shorts': 'pants'
};