export type PetStatus = 'available' | 'pending' | 'sold';

export type OrderStatus = 'placed' | 'approved' | 'delivered';

export interface Pet {
  id?: number;
  name: string;
  photoUrls: string[];
  status?: PetStatus;
  category?: { id?: number; name?: string };
  tags?: { id?: number; name?: string }[];
}

export interface Order {
  id?: number;
  petId: number;
  quantity: number;
  status?: OrderStatus;
  shipDate?: string;
  complete?: boolean;
}
