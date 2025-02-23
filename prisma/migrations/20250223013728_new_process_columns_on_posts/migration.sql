-- AlterTable
ALTER TABLE `Post` ADD COLUMN `processed_content` LONGTEXT NULL,
    ADD COLUMN `processed_image_id` INTEGER NULL,
    ADD COLUMN `processed_image_url` TEXT NULL,
    ADD COLUMN `processed_post_url` TEXT NULL,
    ADD COLUMN `processed_seo_content` LONGTEXT NULL,
    ADD COLUMN `processed_title` TEXT NULL,
    MODIFY `status` ENUM('FAILED', 'IMPORTED', 'PROCESSED', 'POSTED') NOT NULL;
