-- AlterTable
ALTER TABLE `Post` MODIFY `url` TEXT NOT NULL,
    MODIFY `domain` TEXT NOT NULL,
    MODIFY `title` TEXT NOT NULL,
    MODIFY `content` LONGTEXT NOT NULL;
