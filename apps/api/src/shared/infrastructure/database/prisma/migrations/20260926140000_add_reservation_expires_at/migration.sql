-- AlterTable: add nullable first so existing rows can be backfilled from the 10-minute hold window.
ALTER TABLE "reservations" ADD COLUMN "expires_at" TIMESTAMPTZ(3);
UPDATE "reservations" SET "expires_at" = "created_at" + INTERVAL '10 minutes';
ALTER TABLE "reservations" ALTER COLUMN "expires_at" SET NOT NULL;

-- CreateIndex
CREATE INDEX "reservations_status_expires_at_idx" ON "reservations"("status", "expires_at");
