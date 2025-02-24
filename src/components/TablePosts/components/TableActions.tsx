import { EyeIcon, PhotoIcon, TrashIcon, DocumentTextIcon, ArrowUpCircleIcon } from '@heroicons/react/24/solid';
import { twMerge } from 'tailwind-merge';
import { TableActionsProps } from '../types';
import { useViewPostModal } from '@/src/hooks/useViewPostModal';
import { Tooltip } from 'react-tooltip';

export function TableActions({
  post,
  onRemove,
  onProcessPost,
  onProcessImage,
  onPublishPost,
  isRemoving,
  processingQueue,
}: TableActionsProps) {
  const { handleOpen } = useViewPostModal();

  return (
    <>
      <button
        onClick={() => onRemove(Number(post.id))}
        className={twMerge('text-primary hover:text-primary/80')}
        disabled={isRemoving}
        data-tooltip-id="remove-tooltip"
      >
        <TrashIcon className="size-5" />
      </button>
      <Tooltip id="remove-tooltip" content="Remover" />

      <button
        onClick={() => handleOpen(post)}
        className="text-primary hover:text-primary/80 mr-4"
        data-tooltip-id="view-tooltip"
      >
        <EyeIcon className="size-5" />
      </button>
      <Tooltip id="view-tooltip" content="Visualizar" />

      <button
        onClick={() => onProcessPost(post)}
        disabled={
          post.status === 'PROCESSED_TEXT' ||
          post.status === 'PROCESSED_IMAGE' ||
          post.status === 'POSTED' ||
          processingQueue.includes(post.id)
        }
        className="text-primary hover:text-primary/80 disabled:opacity-50 disabled:cursor-not-allowed"
        data-tooltip-id="process-post-tooltip"
      >
        <DocumentTextIcon className="size-5" />
      </button>
      <Tooltip id="process-post-tooltip" content="Processar texto" />

      <button
        onClick={() => onProcessImage(post)}
        className="text-primary hover:text-primary/80 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={
          post.status === 'IMPORTED' ||
          post.status === 'PROCESSED_IMAGE' ||
          post.status === 'POSTED' ||
          processingQueue.includes(post.id)
        }
        data-tooltip-id="process-image-tooltip"
      >
        <PhotoIcon className="size-5" />
      </button>
      <Tooltip id="process-image-tooltip" content="Processar imagem" />

      <button
        onClick={() => {
          if (
            post.processed_title &&
            post.processed_content &&
            post.processed_seo_content &&
            post.processed_image_url
          ) {
            onPublishPost(post as any);
          }
        }}
        className={twMerge(
          'text-primary hover:text-primary/80',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:text-gray-500',
        )}
        disabled={
          post.status !== 'PROCESSED_IMAGE' ||
          processingQueue.includes(post.id)
        }
        data-tooltip-id="publish-tooltip"
      >
        <ArrowUpCircleIcon className="size-5" />
      </button>
      <Tooltip id="publish-tooltip" content="Publicar" />
    </>
  );
} 