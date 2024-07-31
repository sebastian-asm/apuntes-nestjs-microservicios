export enum OrderStatus {
  PENDING = 'PENDING',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export const OrdersStatusList = [OrderStatus.PENDING, OrderStatus.DELIVERED, OrderStatus.CANCELLED]
