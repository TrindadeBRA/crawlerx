import { Post } from '@prisma/client';

export interface TableActionsProps {
  post: Post;
  onRemove: (id: number) => void;
  onProcessPost: (post: Post) => void;
  onProcessImage: (post: Post) => void;
  isRemoving: boolean;
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