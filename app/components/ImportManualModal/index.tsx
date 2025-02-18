'use client'

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useManualImportModal } from '../../hooks/usemanualImportModal';
import { useState } from 'react'
import { usePosts } from '@/app/hooks/usePosts';

export default function ImportManualModal() {
    const { open, handleClose } = useManualImportModal();
    const { savePost, isSaving } = usePosts()

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        url: ''
    })

    const extractDomain = (url: string): string => {
        try {
            const urlObject = new URL(url);
            return urlObject.hostname;
        } catch {
            return 'exemplo.com.br';
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        savePost({
            title: formData.title,
            content: formData.content,
            url: formData.url,
            domain: extractDomain(formData.url),
            isActive: true,
            status: 'IMPORTED'
        })
        
        handleClose()
    }

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: name === 'quantity' ? Number(value) : value
        }))
    }

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
                                        <DialogTitle className="text-base font-semibold text-gray-900">Importação Manual</DialogTitle>
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
                                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                                    <div className="relative mt-6 flex-1 px-4 sm:px-6 flex flex-col gap-4">

                                        <div>
                                            <label htmlFor="title" className="block text-sm/6 text-gray-900 font-bold">
                                                Título
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    required
                                                    id="title"
                                                    name="title"
                                                    value={formData.title}
                                                    onChange={handleChange}
                                                    placeholder="Digite o título do post"
                                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="content" className="block text-sm/6 text-gray-900 font-bold">
                                                Conteúdo
                                            </label>
                                            <div className="mt-2">
                                                <textarea
                                                    required
                                                    id="content"
                                                    name="content"
                                                    value={formData.content}
                                                    onChange={handleChange}
                                                    placeholder="Digite a descrição do post"
                                                    className="h-32 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="url" className="block text-sm/6 text-gray-900 font-bold">
                                                URL
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    id="url"
                                                    name="url"
                                                    value={formData.url}
                                                    onChange={handleChange}
                                                    placeholder="Digite a URL do post"
                                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"
                                                />
                                            </div>
                                        </div>


                                        <div className="mt-auto border-t pt-4">
                                            <button
                                                type="submit"
                                                disabled={isSaving}
                                                className="w-full rounded-md bg-primary px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isSaving ? 'Importando...' : 'Importar'}
                                            </button>
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
