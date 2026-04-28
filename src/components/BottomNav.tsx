import { LayoutDashboard, Package, ShoppingCart, CreditCard, BarChart3, LifeBuoy, Settings } from 'lucide-react';
import { cn } from '../lib/utils';

export type TabId = 'dashboard' | 'inventory' | 'orders' | 'purchase' | 'reporting' | 'support' | 'settings';

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (id: TabId) => void;
}

const TABS = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Bosh sahifa' },
  { id: 'inventory', icon: Package, label: 'Inventar' },
  { id: 'orders', icon: ShoppingCart, label: 'Buyurtmalar' },
  { id: 'purchase', icon: CreditCard, label: 'Xaridlar' },
  { id: 'reporting', icon: BarChart3, label: 'Hisobot' },
  { id: 'support', icon: LifeBuoy, label: 'Yordam' },
  { id: 'settings', icon: Settings, label: 'Sozlamalar' },
] as const;

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 px-2 pb-safe pt-2 z-50">
      <div className="flex justify-between items-center max-w-lg mx-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-200",
                isActive 
                  ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20" 
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              )}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-medium leading-none">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
