/*
  Warnings:

  - You are about to drop the column `code` on the `VerificationCode` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "VerificationCode" DROP COLUMN "code",
ADD COLUMN     "codeHash" TEXT;
