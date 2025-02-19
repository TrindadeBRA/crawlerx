'use client'

import { useImportModal } from '../../hooks/useImportModal';
import { useManualImportModal } from '../../hooks/usemanualImportModal';

export interface HeaderProps {
    title: string;
    description: string;
}

export default function Header({ title, description }: HeaderProps) {
    const { handleOpen } = useImportModal();
    const { handleOpen: handleOpenManualImport } = useManualImportModal();

    const handleImport = () => {
        console.log('Importando conteúdo');
        handleOpen();
    }

    const handleManualImport = () => {
        console.log('Importando manual');
        handleOpenManualImport();
    }

    return (
        <div className="mx-auto px-8 pt-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-base font-bold text-gray-900">{title}</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            {description}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button type="button" className="font-bold ml-auto px-4 py-2 text-white rounded bg-primary" onClick={handleImport}>
                        Importar com CrawlerX
                    </button>
                    <button type="button" className="font-bold ml-auto px-4 py-2 text-white rounded bg-primary" onClick={handleManualImport}>
                        Importar Manual
                    </button>
                </div>
            </div>
        </div>
    );
}
