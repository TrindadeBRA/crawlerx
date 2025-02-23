'use client'

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useImportModal } from '../../hooks/useImportModal';
import { useScraping } from '@/src/hooks/useScraping'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ImportPostsInput, importPostsSchema } from '@/src/lib/schemas/post.schema'
import { Button } from '@/src/components/inputs/button'
import { Input } from '@/src/components/inputs/input';
import { Select } from '@/src/components/inputs/select'
import { mockCrawlerWebsites } from '@/src/mocks/mockCrawlerWebsites';
import { useState } from 'react'
import { useImportArticle } from '@/src/hooks/useImportArticle'

export default function ImportModal() {
    const { open, handleClose } = useImportModal();
    const { scrapePosts, isPending } = useScraping()
    const { importArticle } = useImportArticle()
    const [searchResults, setSearchResults] = useState<Array<{
        title: string;
        url: string;
        content: string;
    }>>([]);
    const [importingArticleUrl, setImportingArticleUrl] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<ImportPostsInput>({
        resolver: zodResolver(importPostsSchema),
        defaultValues: {
            platform: '',
            searchTerm: '',
            quantity: 1
        }
    })

    const platform = watch('platform')

    const handleImportArticle = async (article: { url: string }) => {
        try {
            setImportingArticleUrl(article.url);
            await importArticle({
                url: article.url,
                domain: platform
            });
        } catch (error) {
            console.error('Erro ao importar artigo:', error);
        } finally {
            setImportingArticleUrl(null);
        }
    }

    const onSubmit = async (data: ImportPostsInput) => {
        const results = await scrapePosts(data) ?? []
        console.log('Resultados encontrados:', results)
        setSearchResults(results)
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
                                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
                                    <div className="relative mt-6 flex-1 px-4 sm:px-6 flex flex-col gap-4">

                                        <Select
                                            label="Plataforma"
                                            error={errors.platform?.message}
                                            options={mockCrawlerWebsites}
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
                                            placeholder="Digite a quantidade de posts"
                                        />

                                        <div className="border-t pt-4">
                                            <Button
                                                type="submit"
                                                isLoading={isPending}
                                                label="Pesquisar"
                                            />
                                        </div>
                                    </div>
                                </form>

                                {searchResults.length > 0 && (
                                    <div className='p-4 mt-6 border-t'>
                                        <>
                                            <h3 className="text-base font-semibold text-gray-900 mb-4">
                                                Selecione o artigo para ser importado
                                            </h3>
                                            <div className='flex flex-col gap-4'>
                                                {searchResults.map((article, index) => (
                                                    <div
                                                        key={index}
                                                        className='p-4 bg-gray-50 rounded-lg border hover:border-primary transition-colors'
                                                    >
                                                        <h4 className="font-medium mb-2">{article.title}</h4>
                                                        <p className="text-sm text-gray-600 mb-4">{article.content}</p>
                                                        <div className="flex justify-between items-center">
                                                            <a
                                                                href={article.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-sm text-primary hover:underline"
                                                            >
                                                                Ver original
                                                            </a>
                                                            <Button
                                                                label='Importar'
                                                                isLoading={importingArticleUrl === article.url}
                                                                onClick={() => handleImportArticle(article)}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    </div>
                                )}
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}
