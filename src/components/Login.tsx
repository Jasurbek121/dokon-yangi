import { motion } from 'motion/react';
import { signInWithGoogle } from '../lib/firebase';
import { LogIn } from 'lucide-react';

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-zinc-50 dark:bg-black text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-zinc-900 p-10 rounded-[3rem] shadow-2xl border border-zinc-100 dark:border-zinc-800 max-w-sm w-full"
      >
        <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-blue-500/20 rotate-12">
          <LogIn className="w-10 h-10 text-white -rotate-12" />
        </div>
        
        <h1 className="text-3xl font-extrabold mb-2 tracking-tight">DOKON Dashboard</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-10 text-pretty">
          Biznesingizni boshqarish uchun tizimga kiring
        </p>

        <button
          onClick={() => signInWithGoogle()}
          className="group relative w-full flex items-center justify-center gap-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 py-4 px-6 rounded-2xl font-bold transition-all hover:translate-y-[-2px] active:translate-y-[0px] shadow-lg"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          Google orqali kirish
        </button>

        <p className="mt-8 text-xs text-zinc-400">
          Kirish orqali siz xizmat ko'rsatish shartlariga rozilik bildirasiz
        </p>
      </motion.div>
    </div>
  );
}
