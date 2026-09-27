import { Reservation } from './reservation';
import {
  ReservationAlreadyConfirmedException,
  ReservationCancelledException,
  ReservationExpiredException,
} from './reservation.exceptions';
import {
  CustomerEmail,
  CustomerFullName,
  TicketsQuantity,
  TicketTierId,
} from './values';

const now = new Date('2026-01-01T10:00:00Z');
const minutes = (n: number) => new Date(now.getTime() + n * 60_000);

const makeReservation = () =>
  Reservation.create({
    customerFullName: CustomerFullName.create('Jane Doe'),
    customerEmail: CustomerEmail.create('jane@example.com'),
    ticketTierId: TicketTierId.from('11111111-1111-4111-8111-111111111111'),
    ticketsQuantity: TicketsQuantity.create(2),
    now,
  });

describe('Reservation', () => {
  describe('create', () => {
    it('starts on hold with a 10 minute expiry', () => {
      const reservation = makeReservation();

      expect(reservation.status).toBe('on-hold');
      expect(reservation.expiresAt).toEqual(minutes(10));
      expect(reservation.pullEvents()).toEqual([
        { type: 'ReservationCreated', occurredAt: now },
      ]);
    });
  });

  describe('isExpired', () => {
    it('is false before the hold window ends', () => {
      expect(makeReservation().isExpired(minutes(9))).toBe(false);
    });

    it('is true exactly when the hold window ends', () => {
      expect(makeReservation().isExpired(minutes(10))).toBe(true);
    });

    it('is false for a confirmed reservation, even after the window', () => {
      const reservation = makeReservation();
      reservation.confirm(minutes(1));

      expect(reservation.isExpired(minutes(60))).toBe(false);
    });
  });

  describe('confirm', () => {
    it('confirms an active hold', () => {
      const reservation = makeReservation();
      reservation.pullEvents();

      reservation.confirm(minutes(5));

      expect(reservation.status).toBe('confirmed');
      expect(reservation.updatedAt).toEqual(minutes(5));
      expect(reservation.pullEvents()).toEqual([
        { type: 'ReservationConfirmed', occurredAt: minutes(5) },
      ]);
    });

    it('rejects an already confirmed reservation', () => {
      const reservation = makeReservation();
      reservation.confirm(minutes(1));

      expect(() => reservation.confirm(minutes(2))).toThrow(
        ReservationAlreadyConfirmedException,
      );
    });

    it('rejects a cancelled reservation', () => {
      const reservation = makeReservation();
      reservation.cancel(minutes(1));

      expect(() => reservation.confirm(minutes(2))).toThrow(
        ReservationCancelledException,
      );
    });

    it('rejects an expired hold', () => {
      expect(() => makeReservation().confirm(minutes(10))).toThrow(
        ReservationExpiredException,
      );
    });
  });

  describe('cancel', () => {
    it('cancels an active hold', () => {
      const reservation = makeReservation();

      reservation.cancel(minutes(5));

      expect(reservation.status).toBe('cancelled');
    });

    it('rejects a confirmed reservation', () => {
      const reservation = makeReservation();
      reservation.confirm(minutes(1));

      expect(() => reservation.cancel(minutes(2))).toThrow(
        ReservationAlreadyConfirmedException,
      );
    });

    it('rejects an already cancelled reservation', () => {
      const reservation = makeReservation();
      reservation.cancel(minutes(1));

      expect(() => reservation.cancel(minutes(2))).toThrow(
        ReservationCancelledException,
      );
    });

    it('rejects an expired hold', () => {
      expect(() => makeReservation().cancel(minutes(11))).toThrow(
        'Reservation has expired',
      );
    });
  });
});
