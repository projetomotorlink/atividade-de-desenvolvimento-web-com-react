export type WorkOrderStatus =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export interface Service {
  id: number;
  name: string;
  currentPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceDto {
  name: string;
  currentPrice: number;
}

export interface ShopSimple {
  id: string;
  shopName: string;
}

export interface UserSimple {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface WorkOrder {
  id: string;
  protocolo: string;
  description: string;
  services: Service[];
  shop: ShopSimple;
  createdBy: UserSimple;
  status: WorkOrderStatus;
  WorkOrderTotalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkOrderDto {
  description: string;
  services: CreateServiceDto[];
  status?: WorkOrderStatus;
}

export interface UpdateWorkOrderDto {
  description?: string;
  services?: CreateServiceDto[];
  status?: WorkOrderStatus;
}
