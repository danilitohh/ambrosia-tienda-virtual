/*
  Warnings:

  - Added the required column `bancolombiaCuenta` to the `Settings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Settings" ADD COLUMN     "bancolombiaCuenta" TEXT NOT NULL DEFAULT '12345678901';

-- Update existing records
UPDATE "Settings" SET "bancolombiaCuenta" = '12345678901' WHERE "bancolombiaCuenta" IS NULL;
