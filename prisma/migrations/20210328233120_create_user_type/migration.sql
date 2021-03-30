/*
  Warnings:

  - Added the required column `user_type_id` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN     `user_type_id` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `user_type` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `user_user_type_fk0` ON `user`(`user_type_id`);

-- AddForeignKey
ALTER TABLE `user` ADD FOREIGN KEY (`user_type_id`) REFERENCES `user_type`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
