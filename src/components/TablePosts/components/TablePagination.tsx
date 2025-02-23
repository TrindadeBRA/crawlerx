import { TablePaginationProps } from '../types';

export function TablePagination({
  page,
  pageCount,
  canPreviousPage,
  canNextPage,
  onPreviousPage,
  onNextPage
}: TablePaginationProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={onPreviousPage}
          disabled={!canPreviousPage}
          className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
        >
          Anterior
        </button>
        <button
          onClick={onNextPage}
          disabled={!canNextPage}
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
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Paginação">
            <button
              onClick={onPreviousPage}
              disabled={!canPreviousPage}
              className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              onClick={onNextPage}
              disabled={!canNextPage}
              className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
            >
              Próximo
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
} 