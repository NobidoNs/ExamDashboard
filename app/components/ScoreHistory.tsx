import ScoreHistorySkeleton from './ScoreHistorySkeleton';

interface ScoreHistory {
  name: string;
  amount: string;
  created: string;
}

interface ScoreHistoryProps {
  selectedPlayer: string | null;
  scoreHistory: ScoreHistory[];
  onClose: () => void;
  isLoading?: boolean;
}

export default function ScoreHistory({ 
  selectedPlayer, 
  scoreHistory, 
  onClose,
  isLoading = false 
}: ScoreHistoryProps) {
  if (!selectedPlayer) return null;
  
  if (isLoading) return <ScoreHistorySkeleton />;

  const getAmountColor = (amount: string) => {
      const value = parseInt(amount);
      if (value >= 100) return 'bg-orange-500 text-orange-900';
      if (value >= 75) return 'bg-red-200 text-red-800';
      if (value >= 50) return 'bg-violet-200 text-violet-800';
      if (value >= 25) return 'bg-blue-200 text-blue-800';
      if (value >= 15) return 'bg-green-100 text-green-800';
      if (value >= 5) return 'bg-stone-200 text-stone-800';
      return 'bg-yellow-100 text-yellow-800';
  };

  return (
      <div className="fixed inset-0 bg-stone/10 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl transform transition-all max-h-[90vh] flex flex-col">
              <div className="p-3 sm:p-4 border-b border-gray-100">
                  <div className="flex justify-between items-center">
                      <div className="flex-grow text-center">
                          <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
                              Score History
                          </h3>
                      </div>
                      <button
                          onClick={onClose}
                          className="rounded-full p-1 sm:p-2 hover:bg-gray-100 transition-colors absolute right-2 sm:right-4"
                      >
                          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                      </button>
                  </div>
              </div>

              <div className="flex-1 overflow-auto p-2 sm:p-4">
                  <div className="min-w-full overflow-x-auto">
                      <table className="w-full">
                          <thead>
                              <tr>
                                  <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                                  <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                                  <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                              {scoreHistory.map((record, index) => (
                                  <tr
                                      key={index}
                                      className="even:bg-gray-50 hover:bg-gray-100 transition-colors duration-150"
                                  >
                                      <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-800">
                                          {record.name}
                                      </td>
                                      <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                                          <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getAmountColor(record.amount)}`}>
                                              +{record.amount}
                                          </span>
                                      </td>
                                      <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm text-gray-600">
                                          {new Date(record.created).toLocaleString('ru-RU', {
                                              year: 'numeric',
                                              month: 'numeric',
                                              day: 'numeric',
                                              hour: '2-digit',
                                              minute: '2-digit'
                                          })}
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
