/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[email]` on the table `users`. If there are existing duplicate values, the migration will fail.
  - Added the required column `email` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN     `email` VARCHAR(200) NOT NULL,
    ADD COLUMN     `password` VARCHAR(200) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `users.email_unique` ON `users`(`email`);
