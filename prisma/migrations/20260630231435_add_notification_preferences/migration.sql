-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastNotifiedAt" TIMESTAMP(3),
ADD COLUMN     "notifyNewArrivals" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notifyOrderUpdates" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notifyPromotions" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "notifyTips" BOOLEAN NOT NULL DEFAULT true;
