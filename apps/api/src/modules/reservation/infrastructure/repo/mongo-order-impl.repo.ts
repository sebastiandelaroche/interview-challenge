import { Injectable } from '@nestjs/common';
import { Collection } from 'mongodb';
import { Order, OrderRepository } from '@modules/reservation/domain';
import { MongoService } from '@shared/infrastructure/database';
import { OrderDocument, OrderMapper } from './order.mapper';

@Injectable()
export class MongoOrderImplRepo implements OrderRepository {
  private readonly orders: Collection<OrderDocument>;

  constructor(mongo: MongoService) {
    this.orders = mongo.collection<OrderDocument>('orders');
  }

  async save(order: Order): Promise<void> {
    const { _id, ...data } = OrderMapper.toPersistence(order);
    await this.orders.replaceOne({ _id }, data, { upsert: true });
  }
}
