'use client'

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useImportModal } from '../../hooks/useImportModal';
import { useScraping } from '@/app/hooks/useScraping'
import { useState } from 'react'

export default function ImportModal() {
    const { open, handleClose } = useImportModal();
    const { scrapePosts, isPending } = useScraping()
    const [formData, setFormData] = useState({
        platform: 'tecmundo.com.br',
        searchTerm: '',
        quantity: 1
    })

    const platforms = [
        {
            id: 1,
            name: 'tecmundo.com.br',
            value: 'tecmundo.com.br'
        },

    ]

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        scrapePosts(formData)
    }

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
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
                                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                                    <div className="relative mt-6 flex-1 px-4 sm:px-6 flex flex-col gap-4">
                                        <div>
                                            <label htmlFor="platform" className="block text-sm/6 text-gray-900 font-bold">
                                                Plataforma
                                            </label>
                                            <div className="mt-2 grid grid-cols-1">
                                                <select
                                                    id="platform"
                                                    name="platform"
                                                    value={formData.platform}
                                                    onChange={handleChange}
                                                    className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"
                                                >
                                                    {platforms.map((platform) => (
                                                        <option key={platform.id} value={platform.value}>{platform.name}</option>
                                                    ))}
                                                </select>
                                                <ChevronDownIcon
                                                    aria-hidden="true"
                                                    className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="searchTerm" className="block text-sm/6 font-bold text-gray-900">
                                                Termo de Busca
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    id="searchTerm"
                                                    name="searchTerm"
                                                    type="text"
                                                    value={formData.searchTerm}
                                                    onChange={handleChange}
                                                    placeholder="Digite o termo de busca"
                                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="quantity" className="block text-sm/6 font-bold text-gray-900">
                                                Quantidade de Posts
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    id="quantity"
                                                    name="quantity"
                                                    type="number"
                                                    value={formData.quantity}
                                                    onChange={handleChange}
                                                    min="1"
                                                    placeholder="Digite a quantidade de posts"
                                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-auto border-t pt-4">
                                            <button
                                                type="submit"
                                                disabled={isPending}
                                                className="w-full rounded-md bg-primary px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isPending ? 'Importando...' : 'Importar'}
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
