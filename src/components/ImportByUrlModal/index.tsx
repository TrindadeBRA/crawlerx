'use client'

import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { useByUrlImportModal } from '../../hooks/useImportByUrlModal'
import { useForm } from 'react-hook-form'
import { Input } from '../inputs/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { ImportByUrlInput, importByUrlSchema } from '@/src/lib/schemas/post.schema'
import { usePosts } from '@/src/hooks/usePosts'

export default function ImportByUrlModal() {
  const { isOpen, handleClose } = useByUrlImportModal()
  const { importFromUrl, isImportingFromUrl } = usePosts()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ImportByUrlInput>({
    resolver: zodResolver(importByUrlSchema),
    defaultValues: {
      url: ''
    }
  })

  const onSubmit = async (data: ImportByUrlInput) => {
    try {
      await new Promise((resolve, reject) => {
        importFromUrl(data.url, {
          onSuccess: () => {
            reset();
            resolve(true);
            handleClose();
          },
          onError: (error) => {
            reject(error);
          }
        });
      });
    } catch (error) {
      console.error('Erro ao importar:', error);
    }
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Importar pela URL
                </Dialog.Title>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
                  <div className="mb-4">
                    <Input
                      {...register('url')}
                      label="URL do Post"
                      error={errors.url?.message}
                      placeholder="Digite a URL do post"
                    />
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      className="mr-2 inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none"
                      onClick={handleClose}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isImportingFromUrl}
                      className="inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark focus:outline-none disabled:opacity-50"
                    >
                      {isImportingFromUrl ? 'Importando...' : 'Importar'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
} 