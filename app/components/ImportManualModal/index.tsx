'use client'

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useManualImportModal } from '../../hooks/usemanualImportModal'
import { usePosts } from '@/app/hooks/usePosts'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreatePostInput, createPostSchema } from '@/app/lib/schemas/post.schema'
import { extractDomain } from '@/src/utils/extractDomain'
import { Input } from '@/src/components/inputs/input'
import { TextArea } from '@/src/components/inputs/textarea'
import { Button } from '@/src/components/inputs/button'

export default function ImportManualModal() {
    const { open, handleClose } = useManualImportModal()
    const { savePost, isSaving } = usePosts()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<CreatePostInput>({
        resolver: zodResolver(createPostSchema),
        defaultValues: {
            title: '',
            content: '',
            url: ''
        }
    })

    const onSubmit = async (data: CreatePostInput) => {
        await savePost({
            ...data,
            domain: extractDomain(data.url),
            isActive: true,
            status: 'IMPORTED'
        })

        reset()
        handleClose()
    }

    return (
        <Dialog open={open} onClose={handleClose} className="relative z-10">
            <div className="fixed inset-0" />

            <div className="fixed inset-0 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                        <DialogPanel
                            className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
                        >
                            <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                                <div className="px-4 sm:px-6">
                                    <div className="flex items-start justify-between">
                                        <DialogTitle className="text-base font-semibold text-gray-900">
                                            Importação Manual
                                        </DialogTitle>
                                        <div className="ml-3 flex h-7 items-center">
                                            <button
                                                type="button"
                                                onClick={handleClose}
                                                className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                                            >
                                                <span className="absolute -inset-2.5" />
                                                <span className="sr-only">Close panel</span>
                                                <XMarkIcon aria-hidden="true" className="size-6" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
                                    <div className="relative mt-6 flex-1 px-4 sm:px-6 flex flex-col gap-4">

                                        <Input
                                            label="Título"
                                            error={errors.title?.message}
                                            {...register('title')}
                                            placeholder="Digite o título do post"
                                        />

                                        <TextArea
                                            {...register('content')}
                                            id="content"
                                            placeholder="Digite a descrição do post"
                                            label="Conteúdo"
                                            error={errors.content?.message}
                                        />

                                        <Input
                                            {...register('url')}
                                            label="URL"
                                            error={errors.url?.message}
                                            placeholder="Digite a URL do post"
                                            type="url"
                                        />

                                        <div className="mt-auto border-t pt-4">
                                            <Button
                                                type="submit"
                                                isLoading={isSaving}
                                                label="Importar"
                                            />
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}
