import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Edit2, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface CrudViewProps<T> {
  title: string;
  items: T[];
  onAdd: (item: Partial<T>) => void;
  onUpdate: (id: string, item: Partial<T>) => void;
  onDelete: (id: string) => void;
  renderItem: (item: T) => React.ReactNode;
  formFields: {
    key: keyof T;
    label: string;
    type: 'text' | 'number' | 'select';
    options?: string[];
  }[];
}

export default function CrudView<T extends { id?: string }>({ 
  title, 
  items, 
  onAdd, 
  onUpdate, 
  onDelete, 
  renderItem,
  formFields 
}: CrudViewProps<T>) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [formData, setFormData] = useState<Partial<T>>({});

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: T) => {
    setEditingItem(item);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem?.id) {
      onUpdate(editingItem.id, formData);
    } else {
      onAdd(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">{title}</h2>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors font-medium shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Qo'shish</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 pb-20">
        {items.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 p-12 rounded-3xl text-center border border-zinc-100 dark:border-zinc-800">
            <p className="text-zinc-500">Ma'lumotlar mavjud emas</p>
          </div>
        ) : (
          items.map((item, index) => (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-zinc-900 p-4 rounded-2xl flex items-center justify-between border border-zinc-100 dark:border-zinc-800 group"
            >
              <div className="flex-1">
                {renderItem(item)}
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleOpenEdit(item)}
                  className="p-2 text-zinc-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => item.id && onDelete(item.id)}
                  className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="relative bg-white dark:bg-zinc-900 w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-6 shadow-xl border border-zinc-200 dark:border-zinc-800"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">{editingItem ? 'Tahrirlash' : 'Yangi qo\'shish'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {formFields.map((field) => (
                  <div key={String(field.key)} className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                      {field.label}
                    </label>
                    {field.type === 'select' ? (
                      <select
                        required
                        className="w-full bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        value={String(formData[field.key] || '')}
                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                      >
                        <option value="">Tanlang</option>
                        {field.options?.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        required
                        type={field.type}
                        className="w-full bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        value={String(formData[field.key] || '')}
                        onChange={(e) => setFormData({ ...formData, [field.key]: field.type === 'number' ? Number(e.target.value) : e.target.value })}
                      />
                    )}
                  </div>
                ))}
                <button 
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-all mt-4"
                >
                  Saqlash
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
