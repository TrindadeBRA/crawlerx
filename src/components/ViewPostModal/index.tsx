'use client'

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useViewPostModal } from '@/src/hooks/useViewPostModal'
import { BadgeStatus } from '../BadgeStatus/indext'
import Image from 'next/image'

export default function ViewPostModal() {
  const { open, post, handleClose } = useViewPostModal()

  if (!post) return null

  return (
    <Dialog open={open} onClose={handleClose} className="relative z-10">
      <div className="fixed inset-0" />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel
              transition
              className="pointer-events-auto w-screen max-w-2xl transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                <div className="px-4 sm:px-6">
                  <div className="flex items-start justify-between">
                    <DialogTitle className="text-base font-semibold text-gray-900">
                      Detalhes do Post
                    </DialogTitle>
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        type="button"
                        onClick={handleClose}
                        className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      >
                        <span className="absolute -inset-2.5" />
                        <span className="sr-only">Fechar</span>
                        <XMarkIcon className="size-6" />
                      </button>
                    </div>
                    
                  </div>
                </div>

                <div className="relative mt-6 flex-1 px-4 sm:px-6">
                  <div className="space-y-6">

                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
                        <BadgeStatus status={post.status} disableTooltip />
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">URL</h3>
                        <a
                          href={post.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline block"
                        >
                          {post.url}
                        </a>
                      </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Título</h3>
                      <p className="mt-1 text-sm text-gray-900">{post.title}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Conteúdo Original</h3>
                      <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{post.content}</p>
                    </div>

                    {post.processed_title && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Título Processado</h3>
                        <p className="mt-1 text-sm text-gray-900">{post.processed_title}</p>
                      </div>
                    )}

                    {post.processed_content && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Conteúdo Processado</h3>
                        <div
                          className="mt-1 text-sm text-gray-900 prose max-w-none"
                          dangerouslySetInnerHTML={{ __html: post.processed_content }}
                        />
                      </div>
                    )}

                    {post.processed_seo_content && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Descrição SEO</h3>
                        <p className="mt-1 text-sm text-gray-900">{post.processed_seo_content}</p>
                      </div>
                    )}

                    {post.processed_image_url && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Imagem Processada</h3>
                        <Image
                          src={post.processed_image_url}
                          alt="Imagem processada"
                          className="mt-1 rounded-lg s-full"
                          width={800}
                          height={800}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  )
} 