-- AlterTable
ALTER TABLE `Post` ADD COLUMN `processed_full_post` LONGTEXT NULL,
    ADD COLUMN `wp_slug` TEXT NULL;
