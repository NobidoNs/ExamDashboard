'use client'

interface AchievementsInfoProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AchievementsInfo({ isOpen, onClose }: AchievementsInfoProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 pt-48 md:pt-36">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-violet-700">Руководство по выставлению баллов</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-3">
          <div className="justify-center">
            <p className="font-medium text-blue-700 text-center">Вы сами оцениваете свой результат, можете выставлять баллы на глаз</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <p className="font-medium text-violet-700">Простые задачи (1 балл)</p>
            <p className="text-sm text-gray-600">Задачи которые решаются быстро (например проф математика 1-8 номера)</p>
          </div>
          <div className="p-3 bg-indigo-50 rounded-lg">
            <p className="font-medium text-indigo-700">Нормальные задачи (2 балла)</p>
            <p className="text-sm text-gray-600">Задачи которые решаются, но долго (например проф математика 9-12 номера)</p>
          </div>
          <div className="p-3 bg-lime-50 rounded-lg">
            <p className="font-medium text-yellow-700">Множественный выбор (4 баллa)</p>
            <p className="text-sm text-gray-600">Только если трудно </p>
          </div>
          <div className="p-3 bg-pink-50 rounded-lg">
            <p className="font-medium text-pink-700">Вторая часть (4 - 16 баллов)</p>
            <p className="text-sm text-gray-600">Сколько в ЕГЭ дают, столько и писать</p>
          </div>
          
        </div>
      </div>
    </div>
  );
}
