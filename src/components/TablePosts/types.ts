import { Post } from '@prisma/client';

export interface ProcessedPost extends Post {
  processed_title: string;
  processed_content: string;
  processed_seo_content: string;
  processed_image_url: string;
}

export interface TableActionsProps {
  post: Post;
  onRemove: (id: number) => void;
  onProcessPost: (post: Post) => void;
  onProcessImage: (post: Post) => void;
  onPublishPost: (post: ProcessedPost) => void;
  isRemoving: boolean;
  isPublishing?: boolean;
  processingQueue: number[];
}

export interface TablePaginationProps {
  page: number;
  pageCount: number;
  canPreviousPage: boolean;
  canNextPage: boolean;
  onPreviousPage: () => void;
  onNextPage: () => void;
} 