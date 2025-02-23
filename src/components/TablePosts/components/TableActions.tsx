import { EyeIcon, PhotoIcon, TrashIcon, DocumentTextIcon, ArrowUpCircleIcon } from '@heroicons/react/24/solid';
import { twMerge } from 'tailwind-merge';
import { TableActionsProps } from '../types';

export function TableActions({
  post,
  onRemove,
  onProcessPost,
  onProcessImage,
  isRemoving,
  processingQueue
}: TableActionsProps) {
  return (
    <>
      <button
        onClick={() => onRemove(Number(post.id))}
        className={twMerge('text-primary hover:text-primary/80')}
        disabled={isRemoving}
      >
        <TrashIcon className="size-5" />
      </button>

      <button
        onClick={() => window.open(post.url, '_blank')}
        className="text-primary hover:text-primary/80 mr-4"
      >
        <EyeIcon className="size-5" />
      </button>

      <button
        onClick={() => onProcessPost(post)}
        disabled={
          post.status === 'PROCESSED_TEXT' ||
          post.status === 'PROCESSED_IMAGE' ||
          post.status === 'POSTED' ||
          processingQueue.includes(post.id)
        }
        className="text-primary hover:text-primary/80 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <DocumentTextIcon className="size-5" />
      </button>

      <button
        onClick={() => onProcessImage(post)}
        className="text-primary hover:text-primary/80 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={
          post.status === 'IMPORTED' ||
          post.status === 'PROCESSED_IMAGE' ||
          post.status === 'POSTED' ||
          processingQueue.includes(post.id)
        }
      >
        <PhotoIcon className="size-5" />
      </button>

      <button
        onClick={() => console.log({
          title: post.processed_title?.slice(0, 50),
          content: post.processed_content?.slice(0, 50),
          imageUrl: post.processed_image_url,
        })}
        className={twMerge(
          'text-primary hover:text-primary/80',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:text-gray-500',
        )}
        disabled={post.status !== 'PROCESSED_IMAGE'}
      >
        <ArrowUpCircleIcon className="size-5" />
      </button>
    </>
  );
} 