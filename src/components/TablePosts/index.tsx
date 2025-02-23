'use client';

import { Post } from '@prisma/client';
import { usePosts } from '@/src/hooks/usePosts';
import { BadgeStatus } from '../BadgeStatus/indext';
import { TableActions } from './components/TableActions';
import { TablePagination } from './components/TablePagination';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { TableLoading } from './components/TableLoading';

export default function TablePosts() {
  const {
    posts,
    isLoading,
    processPost,
    processImage,
    removePost,
    isRemoving,
    pagination: { page, setPage, pageCount },
    processingQueue,
  } = usePosts();

  const columnHelper = createColumnHelper<Post>();

  const columns = [
    columnHelper.accessor('title', {
      header: 'Título',
      cell: (info) => (
        <span className="text-sm text-gray-500" title={info.getValue()}>
          {info.getValue().length > 40
            ? info.getValue().slice(0, 40).concat('...')
            : info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('domain', {
      header: 'Domínio',
      cell: (info) => info.getValue().replace('www.', ''),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => (
        <div className="flex items-center gap-2">
          <BadgeStatus status={info.getValue()} />
          {processingQueue.includes(info.row.original.id) && (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-700 border-t-transparent" />
          )}
        </div>
      ),
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
      id: 'actions',
      header: () => <span className="sr-only">Ações</span>,
      cell: (info) => (
        <div className="flex gap-2">
          <TableActions
            post={info.row.original}
            onRemove={removePost}
            onProcessPost={processPost}
            onProcessImage={processImage}
            isRemoving={isRemoving}
            processingQueue={processingQueue}
          />
        </div>
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
        pageSize: 30,
      },
    },
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newState = updater({ pageIndex: page - 1, pageSize: 30 });
        setPage(newState.pageIndex + 1);
      }
    },
    manualPagination: true,
  });

  if (isLoading) {
    return <TableLoading />;
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

            <TablePagination
              page={page}
              pageCount={pageCount}
              canPreviousPage={table.getCanPreviousPage()}
              canNextPage={table.getCanNextPage()}
              onPreviousPage={() => table.previousPage()}
              onNextPage={() => table.nextPage()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
