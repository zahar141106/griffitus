/*
  Warnings:

  - Made the column `codeHash` on table `VerificationCode` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "VerificationCode" ALTER COLUMN "codeHash" SET NOT NULL;
