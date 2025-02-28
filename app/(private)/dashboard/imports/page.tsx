'use client'

import { useImportModal } from "@/src/hooks/useImportModal";
import Header from "../../../../src/components/Header";
import ImportManualModal from "../../../../src/components/ImportManualModal";
import ImportModal from "../../../../src/components/ImportModal";
import Notification from "../../../../src/components/Notification";
import TablePosts from "../../../../src/components/TablePosts";
import { useManualImportModal } from "@/src/hooks/usemanualImportModal";
import { ListBulletIcon } from "@heroicons/react/24/solid";
import ViewPostModal from '@/src/components/ViewPostModal'
import ImportVideoModal from "@/src/components/ImportByUrlModal";
import { useByUrlImportModal } from "@/src/hooks/useImportByUrlModal";



export default function Home() {

  const { handleOpen } = useImportModal();
  const { handleOpen: handleOpenManualImport } = useManualImportModal();
  const { handleOpen: handleOpenByUrlImport } = useByUrlImportModal();

  const handleImport = () => {
    console.log('Importando conteúdo');
    handleOpen();
  }

  const handleManualImport = () => {
    console.log('Importando manual');
    handleOpenManualImport();
  }

  const handleByUrlImport = () => {
    console.log('Importando pela URL');
    handleOpenByUrlImport();
  }

  return (
    <div className="">
      <Header
        title="Importações"
        description="Lista de todos os posts importados no sistema."
        icon={ListBulletIcon}
      >
        <button
          type="button"
          className="font-bold ml-auto px-4 py-2 text-white rounded bg-primary text-sm md:text-base"
          onClick={handleImport}
        >
          Importar com CrawlerX
        </button>
        <button
          type="button"
          className="font-bold ml-auto px-4 py-2 text-white rounded bg-primary text-sm md:text-base"
          onClick={handleManualImport}
        >
          Importar Manual
        </button>
        <button
          type="button"
          className="font-bold ml-auto px-4 py-2 text-white rounded bg-primary text-sm md:text-base"
          onClick={handleByUrlImport}
        >
          Importar pela URL
        </button>
      </Header>
      <TablePosts />
      <ImportModal />
      <ImportManualModal />
      <ViewPostModal />
      <ImportVideoModal />
      <Notification />
    </div>
  );
}
