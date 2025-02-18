'use client'

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useImportModal } from '../../hooks/useImportModal';
import { useScraping } from '@/app/hooks/useScraping'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ImportPostsInput, importPostsSchema } from '@/app/lib/schemas/post.schema'
import { Button } from '@/src/components/inputs/button'
import { Input } from '@/src/components/inputs/input';
import { Select } from '@/src/components/inputs/select'

export default function ImportModal() {
    const { open, handleClose } = useImportModal();
    const { scrapePosts, isPending } = useScraping()

    const {
        register,
        handleSubmit,
        formState: { errors },
        // reset
    } = useForm<ImportPostsInput>({
        resolver: zodResolver(importPostsSchema),
        defaultValues: {
            platform: '',
            searchTerm: '',
            quantity: 1
        }
    })

    const onSubmit = (data: ImportPostsInput) => {
        scrapePosts(data)
    }

    const platforms = [
        {
            id: 0,
            name: 'Selecione a plataforma',
            value: '',
            disabled: true
        },
        {
            id: 1,
            name: 'tecmundo.com.br',
            value: 'tecmundo.com.br'
        },
        {
            id: 2,
            name: 'developer-tech.com',
            value: 'developer-tech.com'
        }
    ]

    return (
        <Dialog open={open} onClose={handleClose} className="relative z-10">
            <div className="fixed inset-0" />

            <div className="fixed inset-0 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                        <DialogPanel
                            transition
                            className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
                        >
                            <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                                <div className="px-4 sm:px-6">
                                    <div className="flex items-start justify-between">
                                        <DialogTitle className="text-base font-semibold text-gray-900">Opções de Importação</DialogTitle>
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

                                        <Select
                                            label="Plataforma"
                                            error={errors.platform?.message}
                                            options={platforms}
                                            {...register('platform')}
                                        />

                                        <Input
                                            label="Termo de Busca"
                                            error={errors.searchTerm?.message}
                                            {...register('searchTerm')}
                                            placeholder="Digite o termo de busca"
                                        />

                                        <Input
                                            label="Quantidade de Posts"
                                            error={errors.quantity?.message}
                                            {...register('quantity', { valueAsNumber: true })}
                                            type="number"
                                            min="1"
                                            max="10"
                                            placeholder="Digite a quantidade de posts"
                                        />

                                        <div className="mt-auto border-t pt-4">
                                            <Button
                                                type="submit"
                                                isLoading={isPending}
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
