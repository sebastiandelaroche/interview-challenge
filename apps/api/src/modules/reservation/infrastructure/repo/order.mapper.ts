import { ObjectId } from 'mongodb';
import { Order } from '@modules/reservation/domain';

export type OrderDocument = {
  _id: ObjectId;
  eventId: string;
  eventName: string;
  ticketTierId: string;
  ticketTierName: string;
  ticketsQuantity: number;
  ticketUnitPrice: number;
  totalPaid: number;
  customerName: string;
  customerEmail: string;
  reservationId: string;
  createdAt: Date;
  updatedAt: Date;
};

export const OrderMapper = {
  toPersistence(order: Order): OrderDocument {
    return {
      _id: new ObjectId(order.id),
      eventId: order.eventId,
      eventName: order.eventName,
      ticketTierId: order.ticketTierId,
      ticketTierName: order.ticketTierName,
      ticketsQuantity: order.ticketsQuantity,
      ticketUnitPrice: order.ticketUnitPrice,
      totalPaid: order.totalPaid,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      reservationId: order.reservationId,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  },
};
