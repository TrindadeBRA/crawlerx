'use client'

import Image from 'next/image';
import { useImportModal } from '../../hooks/useImportModal';

export default function Header() {
    const { handleOpen  } = useImportModal();

    const handleImport = () => {
        console.log('Importando conteúdo');
        handleOpen();
    }

    return (
        <div className="mx-auto px-8 pt-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Image src="/assets/images/crawlerx-logo.png" alt="CrawlerX" width={125} height={125} />
                    <div>
                        <h1 className="text-base font-bold text-gray-900">CrawlerX - TrinityWeb</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            Lista de todos os posts importados no sistema.
                        </p>
                    </div>
                </div>
                <button className="font-bold ml-auto px-4 py-2 text-white rounded bg-primary" onClick={handleImport}>
                    Importar Conteúdo
                </button>
            </div>
        </div>
    );
}
