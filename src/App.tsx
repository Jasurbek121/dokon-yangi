import { useState, useEffect, useMemo } from 'react';
import { Bell, Moon, Sun, Search, User as UserIcon, LogOut, Package, ShoppingCart, CreditCard, HelpCircle, Settings as SettingsIcon } from 'lucide-react';
import BottomNav, { TabId } from './components/BottomNav';
import StatCard from './components/StatCard';
import StoreList from './components/StoreList';
import ChartsSection from './components/Charts';
import Login from './components/Login';
import CrudView from './components/CrudView';
import { auth } from './lib/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { useFirestoreCollection } from './hooks/useFirestore';
import { Store, InventoryItem, Order, Purchase } from './constants';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Firestore Hooks
  const { data: stores, add: addStore, remove: removeStore } = useFirestoreCollection<Store>('stores', true, 10);
  const { data: inventory, add: addInv, update: updateInv, remove: removeInv } = useFirestoreCollection<InventoryItem>('inventory');
  const { data: orders, add: addOrder, update: updateOrder, remove: removeOrder } = useFirestoreCollection<Order>('orders');
  const { data: purchases, add: addPur, update: updatePur, remove: removePur } = useFirestoreCollection<Purchase>('purchases');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Derived Stats
  const totalSales = useMemo(() => stores.reduce((acc, s) => acc + s.sales, 0), [stores]);
  const inventoryPercentage = useMemo(() => {
    const total = inventory.reduce((acc, i) => acc + i.quantity, 0);
    return total > 0 ? Math.min(Math.round((total / 1000) * 100), 100) : 68; // Fallback to 68 if empty for demo feel
  }, [inventory]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <StatCard 
                title="Foydalanuvchilar soni" 
                value="583K" 
                subValue="Jami mijozlar" 
                type="numeric" 
              />
              <StatCard 
                title="Inventar qiymati" 
                percentage={inventoryPercentage} 
                type="progress" 
              />
            </div>
            <StoreList 
              stores={stores} 
              onAddClick={() => addStore({ name: 'Yangi do\'kon', sales: Math.floor(Math.random() * 100000) })}
              onDeleteClick={removeStore}
            />
            <ChartsSection />
          </div>
        );

      case 'inventory':
        return (
          <CrudView<InventoryItem>
            title="Inventar"
            items={inventory}
            onAdd={addInv}
            onUpdate={updateInv}
            onDelete={removeInv}
            formFields={[
              { key: 'name', label: 'Mahsulot nomi', type: 'text' },
              { key: 'quantity', label: 'Miqdori', type: 'number' },
              { key: 'unitPrice', label: 'Birlik narxi', type: 'number' },
              { key: 'category', label: 'Kategoriya', type: 'text' },
            ]}
            renderItem={(item) => (
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-white">{item.name}</h4>
                  <p className="text-xs text-zinc-500">{item.category} • {item.quantity} dona</p>
                </div>
              </div>
            )}
          />
        );

      case 'orders':
        return (
          <CrudView<Order>
            title="Buyurtmalar"
            items={orders}
            onAdd={addOrder}
            onUpdate={updateOrder}
            onDelete={removeOrder}
            formFields={[
              { key: 'customerName', label: 'Mijoz ismi', type: 'text' },
              { key: 'amount', label: 'Summa', type: 'number' },
              { key: 'status', label: 'Holati', type: 'select', options: ['pending', 'completed', 'cancelled'] },
            ]}
            renderItem={(item) => (
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-50 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-zinc-900 dark:text-white">{item.customerName}</h4>
                  <p className="text-xs text-zinc-500">{item.amount.toLocaleString()} so'm</p>
                </div>
                <span className={cn(
                  "text-[10px] px-2 py-1 rounded-full font-bold uppercase",
                  item.status === 'completed' ? "bg-green-100 text-green-700" :
                  item.status === 'pending' ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                )}>
                  {item.status}
                </span>
              </div>
            )}
          />
        );

      case 'purchase':
        return (
          <CrudView<Purchase>
            title="Xaridlar"
            items={purchases}
            onAdd={addPur}
            onUpdate={updatePur}
            onDelete={removePur}
            formFields={[
              { key: 'supplier', label: 'Yetkazib beruvchi', type: 'text' },
              { key: 'amount', label: 'Summa', type: 'number' },
              { key: 'date', label: 'Sana', type: 'text' },
            ]}
            renderItem={(item) => (
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-white">{item.supplier}</h4>
                  <p className="text-xs text-zinc-500">{item.amount.toLocaleString()} so'm • {item.date}</p>
                </div>
              </div>
            )}
          />
        );

      case 'reporting':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Hisobot</h2>
            <ChartsSection />
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800">
              <h3 className="font-bold mb-4">Savdo ko'rsatkichlari</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-2xl">
                  <span className="text-zinc-500">Jami savdo</span>
                  <span className="font-bold text-lg">{totalSales.toLocaleString()} so'm</span>
                </div>
                <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-2xl">
                  <span className="text-zinc-500">Faol do'konlar</span>
                  <span className="font-bold text-lg">{stores.length} ta</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'support':
        return (
          <div className="space-y-6 text-center py-10">
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
              <HelpCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold">Yordam markazi</h2>
            <p className="text-zinc-500 max-w-xs mx-auto">Biz bilan bog'lanish uchun quyidagi tugmani bosing</p>
            <button className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-8 py-3 rounded-2xl font-bold">Bog'lanish</button>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Sozlamalar</h2>
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-zinc-100">
                  <img src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.displayName}`} alt="Avatar" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{user.displayName}</h3>
                  <p className="text-zinc-500 text-sm">{user.email}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                  <div className="flex items-center gap-3 font-medium">
                    <UserIcon className="w-5 h-5 text-zinc-400" />
                    Profilni tahrirlash
                  </div>
                </button>
                <button className="w-full flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                  <div className="flex items-center gap-3 font-medium">
                    <SettingsIcon className="w-5 h-5 text-zinc-400" />
                    Xavfsizlik
                  </div>
                </button>
                <button 
                  onClick={() => signOut(auth)}
                  className="w-full flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/10 rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors text-red-600 font-bold mt-4"
                >
                  <div className="flex items-center gap-3">
                    <LogOut className="w-5 h-5" />
                    Chiqish
                  </div>
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-zinc-50/80 dark:bg-black/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Xush kelibsiz {user.displayName?.split(' ')[0] || 'Mehlmon'}!</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">DOKON Dashboard Overview</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-zinc-600" />}
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm relative">
            <Bell className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900"></span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 pt-2 pb-20 max-w-lg mx-auto md:max-w-4xl lg:max-w-6xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
