import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/client/client';

// Fixed IDs keep the seed idempotent: re-running upserts instead of duplicating.
const events = [
  {
    id: '6b1f3c1e-0a4d-4b8e-9a51-1f0e2c3d4a01',
    name: 'Summer Music Festival',
    date: new Date('2026-10-10T18:00:00Z'),
    location: 'Central Park Amphitheater',
    description:
      'Annual outdoor music festival featuring top artists across multiple stages.',
    tiers: [
      { id: '6b1f3c1e-0a4d-4b8e-9a51-1f0e2c3d4b01', name: 'VIP', price: '150.00', capacity: 50 },
      { id: '6b1f3c1e-0a4d-4b8e-9a51-1f0e2c3d4b02', name: 'General Admission', price: '45.00', capacity: 500 },
      { id: '6b1f3c1e-0a4d-4b8e-9a51-1f0e2c3d4b03', name: 'Early Bird', price: '30.00', capacity: 100 },
    ],
  },
  {
    id: '6b1f3c1e-0a4d-4b8e-9a51-1f0e2c3d4a02',
    name: 'Tech Conference 2026',
    date: new Date('2026-11-05T09:00:00Z'),
    location: 'Convention Center Hall A',
    description:
      'Two-day conference covering the latest in software engineering and cloud infrastructure.',
    tiers: [
      { id: '6b1f3c1e-0a4d-4b8e-9a51-1f0e2c3d4b04', name: 'Premium', price: '200.00', capacity: 30 },
      { id: '6b1f3c1e-0a4d-4b8e-9a51-1f0e2c3d4b05', name: 'Standard', price: '80.00', capacity: 200 },
    ],
  },
  {
    id: '6b1f3c1e-0a4d-4b8e-9a51-1f0e2c3d4a03',
    name: 'Comedy Night',
    date: new Date('2026-10-03T20:00:00Z'),
    location: 'Downtown Theater',
    description: 'An evening of stand-up comedy with three headlining comedians.',
    tiers: [
      { id: '6b1f3c1e-0a4d-4b8e-9a51-1f0e2c3d4b06', name: 'Front Row', price: '60.00', capacity: 20 },
      { id: '6b1f3c1e-0a4d-4b8e-9a51-1f0e2c3d4b07', name: 'Regular', price: '25.00', capacity: 150 },
    ],
  },
  {
    id: '6b1f3c1e-0a4d-4b8e-9a51-1f0e2c3d4a04',
    name: 'Art Exhibition Opening',
    date: new Date('2026-10-25T17:00:00Z'),
    location: 'City Gallery',
    description:
      'Opening night of the contemporary art exhibition with artist meet-and-greet.',
    tiers: [
      { id: '6b1f3c1e-0a4d-4b8e-9a51-1f0e2c3d4b08', name: 'VIP Opening', price: '100.00', capacity: 40 },
      { id: '6b1f3c1e-0a4d-4b8e-9a51-1f0e2c3d4b09', name: 'General Entry', price: '15.00', capacity: 300 },
    ],
  },
];

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  try {
    for (const { tiers, ...event } of events) {
      await prisma.$transaction(async (tx) => {
        await tx.event.upsert({
          where: { id: event.id },
          create: event,
          update: event,
        });

        for (const tier of tiers) {
          const data = { ...tier, eventId: event.id };
          await tx.ticketTier.upsert({
            where: { id: tier.id },
            create: data,
            update: data,
          });
        }
      });
      console.log(`Seeded event: ${event.name} (${tiers.length} tiers)`);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
