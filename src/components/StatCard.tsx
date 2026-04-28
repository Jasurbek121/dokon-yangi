import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface StatCardProps {
  title: string;
  value?: string;
  subValue?: string;
  percentage?: number;
  type: 'numeric' | 'progress';
  className?: string;
}

export default function StatCard({ title, value, subValue, percentage, type, className }: StatCardProps) {
  const data = percentage ? [
    { value: percentage },
    { value: 100 - percentage }
  ] : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-white dark:bg-zinc-900 p-5 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800 flex flex-col justify-between",
        className
      )}
    >
      <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium mb-2">{title}</p>
      
      {type === 'numeric' ? (
        <div>
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">{value}</h2>
          <p className="text-zinc-400 dark:text-zinc-500 text-xs mt-1">{subValue}</p>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={24}
                  outerRadius={32}
                  startAngle={90}
                  endAngle={-270}
                  paddingAngle={0}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill="#3b82f6" />
                  <Cell fill="#f4f4f5" className="dark:fill-zinc-800" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-zinc-900 dark:text-white">{percentage}%</span>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex flex-col">
              <span className="text-zinc-900 dark:text-white font-bold text-sm">Sotilgan birliklar {percentage}%</span>
              <span className="text-zinc-400 dark:text-zinc-500 text-xs">Jami birliklar</span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
