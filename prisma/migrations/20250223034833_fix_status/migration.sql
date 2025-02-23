/*
  Warnings:

  - The values [PROCESSED] on the enum `Post_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Post` MODIFY `status` ENUM('FAILED', 'IMPORTED', 'PROCESSED_TEXT', 'PROCESSED_IMAGE', 'POSTED') NOT NULL;
