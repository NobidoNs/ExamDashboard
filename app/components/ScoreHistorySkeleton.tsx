export default function ScoreHistorySkeleton() {
  return (
    <div className="fixed inset-0 bg-stone/10 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl transform transition-all max-h-[90vh] flex flex-col">
        <div className="p-3 sm:p-4 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div className="flex-grow text-center">
              <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mx-auto" />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-2 sm:p-4">
          <div className="min-w-full overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-2 sm:px-6 py-2 sm:py-3 text-left">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                  </th>
                  <th className="px-2 sm:px-6 py-2 sm:py-3 text-left">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  </th>
                  <th className="px-2 sm:px-6 py-2 sm:py-3 text-left">
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[...Array(5)].map((_, index) => (
                  <tr key={index} className="even:bg-gray-50">
                    <td className="px-2 sm:px-6 py-2 sm:py-4">
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                    </td>
                    <td className="px-2 sm:px-6 py-2 sm:py-4">
                      <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
                    </td>
                    <td className="px-2 sm:px-4 py-2">
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
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
