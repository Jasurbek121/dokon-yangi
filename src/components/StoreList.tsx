import { motion } from 'motion/react';
import { Store } from '../constants';

interface StoreListProps {
  stores: Store[];
  onAddClick?: () => void;
  onDeleteClick?: (id: string) => void;
}

export default function StoreList({ stores, onAddClick, onDeleteClick }: StoreListProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white text-pretty">Sotuv bo‘yicha eng yaxshi 10 do‘kon</h3>
        <button 
          onClick={onAddClick}
          className="text-sm font-medium text-blue-600 dark:text-blue-400"
        >
          Do‘kon qo‘shish
        </button>
      </div>
      
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {stores.length === 0 ? (
          <p className="text-center text-zinc-500 py-4">Do‘konlar topilmadi</p>
        ) : (
          stores.map((store, index) => (
            <motion.div
              key={store.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-bold text-zinc-500 dark:text-zinc-400 group-hover:bg-blue-100 group-hover:text-blue-600 dark:group-hover:bg-blue-900/30 dark:group-hover:text-blue-400 transition-colors">
                  {index + 1}
                </span>
                <span className="font-medium text-zinc-700 dark:text-zinc-200">{store.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-zinc-900 dark:text-white">{(store.sales / 1000).toFixed(0)}k</span>
                {onDeleteClick && (
                  <button 
                    onClick={() => store.id && onDeleteClick(store.id)}
                    className="p-1 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
