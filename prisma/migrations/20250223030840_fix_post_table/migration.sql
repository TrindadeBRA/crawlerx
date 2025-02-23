/*
  Warnings:

  - You are about to drop the column `processed_image_id` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `processed_post_url` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Post` DROP COLUMN `processed_image_id`,
    DROP COLUMN `processed_post_url`,
    ADD COLUMN `wp_image_id` INTEGER NULL,
    ADD COLUMN `wp_image_url` TEXT NULL,
    ADD COLUMN `wp_post_id` INTEGER NULL;
