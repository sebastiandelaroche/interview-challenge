import { Order } from './order';

export abstract class OrderRepository {
  abstract save(order: Order): Promise<void>;
}
