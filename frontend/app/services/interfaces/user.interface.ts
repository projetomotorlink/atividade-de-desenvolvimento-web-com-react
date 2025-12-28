export interface Shop {
  id: string;
  shopName: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'customer';
  shop: Shop | null;
}
