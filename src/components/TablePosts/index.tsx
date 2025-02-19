'use client';

import { Post } from '@prisma/client';
import { usePosts } from '@/src/hooks/usePosts';
import { ArrowUpCircleIcon, EyeIcon } from '@heroicons/react/24/solid';
import { twMerge } from 'tailwind-merge'
import { BadgeStatus } from '../BadgeStatus/indext';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';


export default function TablePosts() {
  const { 
    posts, 
    isLoading, 
    processPost,
    pagination: { page, setPage, pageCount }
  } = usePosts();
  
  const columnHelper = createColumnHelper<Post>();

  const columns = [
    columnHelper.accessor('title', {
      header: 'Título',
      cell: (info) => (
        info.getValue().length > 40 
          ? info.getValue().slice(0, 40).concat('...') 
          : info.getValue()
      ),
    }),
    columnHelper.accessor('domain', {
      header: 'Domínio',
      cell: (info) => info.getValue().replace('www.', ''),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => <BadgeStatus status={info.getValue()} />,
    }),
    columnHelper.accessor('createdAt', {
      header: 'Data de Criação',
      cell: (info) => new Date(info.getValue()).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
    }),
    columnHelper.display({
      id: 'view',
      header: () => <span className="sr-only">Ver</span>,
      cell: (info) => (
        <button
          onClick={() => window.open(info.row.original.url, '_blank')}
          className="text-primary hover:text-primary/80"
        >
          <EyeIcon className="size-5" />
        </button>
      ),
    }),
    columnHelper.display({
      id: 'process',
      header: () => <span className="sr-only">Processar</span>,
      cell: (info) => (
        <button
          onClick={() => processPost(info.row.original)}
          className={twMerge(
            'text-primary hover:text-primary/80',
            info.row.original.status === 'PROCESSED' && 'opacity-50'
          )}
        >
          <ArrowUpCircleIcon className="size-5" />
        </button>
      ),
    }),
  ];

  const table = useReactTable({
    data: posts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    pageCount,
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize: 10,
      },
    },
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newState = updater({ pageIndex: page - 1, pageSize: 10 });
        setPage(newState.pageIndex + 1);
      }
    },
    manualPagination: true,
  });

  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                      Título
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Domínio
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Data de Criação
                    </th>
                    <th scope="col" className="relative py-3.5 pr-4 pl-3 sm:pr-0">
                      <span className="sr-only">Ver</span>
                    </th>
                    <th scope="col" className="relative py-3.5 pr-4 pl-3 sm:pr-0">
                      <span className="sr-only">Processar</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[...Array(5)].map((_, index) => (
                    <tr key={index} className="hover:bg-[#ffdddd]">
                      <td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap">
                        <div className="h-5 bg-gray-200 rounded animate-pulse w-40"></div>
                      </td>
                      <td className="px-3 py-4 text-sm whitespace-nowrap">
                        <div className="h-5 bg-gray-200 rounded animate-pulse w-24"></div>
                      </td>
                      <td className="px-3 py-4 text-sm whitespace-nowrap">
                        <div className="h-6 bg-gray-200 rounded-full animate-pulse w-20"></div>
                      </td>
                      <td className="px-3 py-4 text-sm whitespace-nowrap">
                        <div className="h-5 bg-gray-200 rounded animate-pulse w-32"></div>
                      </td>
                      <td className="relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-0">
                        <div className="h-5 bg-gray-200 rounded animate-pulse w-5 ml-auto"></div>
                      </td>
                      <td className="relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap">
                        <div className="h-5 bg-gray-200 rounded animate-pulse w-5 ml-auto"></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th 
                        key={header.id}
                        scope="col" 
                        className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-gray-200">
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-[#ffdddd]">
                    {row.getVisibleCells().map(cell => (
                      <td 
                        key={cell.id}
                        className="px-3 py-4 text-sm whitespace-nowrap text-gray-500"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Controles de Paginação */}
            <div className="flex items-center justify-between px-4 py-3 sm:px-6">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                >
                  Anterior
                </button>
                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                >
                  Próximo
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Página <span className="font-medium">{page}</span> de{' '}
                    <span className="font-medium">{pageCount}</span>
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                      className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                    >
                      Anterior
                    </button>
                    <button
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                      className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                    >
                      Próximo
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
