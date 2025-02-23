export function TableLoading() {
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
                    <span className="sr-only">Ações</span>
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
                    <td className="relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap">
                      <div className="flex gap-2 justify-end">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="h-5 bg-gray-200 rounded animate-pulse w-5"></div>
                        ))}
                      </div>
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