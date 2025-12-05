import React, { useState, useEffect, useMemo, useRef } from 'react';

// [ANDROID ONLY - HAPUS TANDA KOMENTAR DI BAWAH INI SAAT DI VS CODE]
import { App as CapacitorApp } from '@capacitor/app'; 

import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth'; // Tambah signInWithCredential
import { Capacitor } from '@capacitor/core'; // Untuk cek apakah ini Android/Web

import { auth, googleProvider, db } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, onSnapshot, getDoc, updateDoc } from 'firebase/firestore';
import JoinWalletModal from './components/Modals/JoinWalletModal';
import { 
  Wallet, PieChart, TrendingUp, TrendingDown, ArrowRightLeft, Plus, History, 
  Target, Settings, Trash2, Edit3, AlertTriangle, Download, Upload, CheckCircle, 
  X, Lock, Home, Delete, Loader2, ChevronRight, MoreHorizontal, CreditCard, 
  Send, Calendar, User, LogOut, Bell, ShieldCheck, KeyRound, RefreshCw, Zap,
  BarChart3, Sparkles, BookOpen, UserCircle, Tag, FileText, ChevronDown, ArrowRight,
  CalendarDays, Search, Eye, EyeOff, Palette, Trophy, PiggyBank, MinusCircle,
  HandCoins, UserMinus, UserPlus, Banknote, Clock
} from 'lucide-react';
import { formatCurrency, formatDate, generateId } from './utils/formatters';
import { INITIAL_DATA, CARD_COLORS } from './utils/constants';
import BottomNav from './components/Layout/BottomNav';
import HomeView from './components/Views/HomeView';
import HistoryView from './components/Views/HistoryView';
import AccountView from './components/Views/AccountView';
import TransactionModal from './components/Modals/TransactionModal';
import AccountModal from './components/Modals/AccountModal';
import BudgetModal from './components/Modals/BudgetModal';
import GoalModal from './components/Modals/GoalModal';
import DebtModal from './components/Modals/DebtModal';
import { SavingModal, PayDebtModal, WithdrawGoalModal, AIModal } from './components/Modals/ActionModals';
import ReportsView from './components/Views/ReportsView';
import BudgetsView from './components/Views/BudgetsView';
import GoalsView from './components/Views/GoalsView';
import DebtsView from './components/Views/DebtsView';

/* -------------------------------------------------------------------------- */
/* UTILITIES */
/* -------------------------------------------------------------------------- */

export default function SmartWalletApp() {

   // Init Google Auth Plugin (Khusus Native)
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      GoogleAuth.initialize();
    }
  }, []);

  // --- STATE ---
  const [isInitializing, setIsInitializing] = useState(true); 
  const [loadingProgress, setLoadingProgress] = useState(10);
  const [showBalance, setShowBalance] = useState(true);
  const [activeTab, setActiveTab] = useState('home'); 
  
  // Data & Auth
  const [data, setData] = useState(INITIAL_DATA);
  const [walletId, setWalletId] = useState(null);
  const [authMode, setAuthMode] = useState('pin'); 
  const [pinState, setPinState] = useState({ input: '', setupStep: 1, tempPin: '' });
  const [isSetupMode, setIsSetupMode] = useState(true);

  // Filter
  const [historyFilter, setHistoryFilter] = useState({ type: 'all', date: '', search: '' });
  const dateInputRef = useRef(null);

  // Modals
  const [activeModal, setActiveModal] = useState(null); 
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState(null);

  // Refs for Back Button Logic
  const activeModalRef = useRef(activeModal);
  const activeTabRef = useRef(activeTab);

  useEffect(() => { activeModalRef.current = activeModal; }, [activeModal]);
  useEffect(() => { activeTabRef.current = activeTab; }, [activeTab]);

  /* -------------------------------------------------------------------------- */
  /* [ANDROID ONLY] LOGIKA TOMBOL KEMBALI                                       */
  /* Hapus tanda komentar pada useEffect di bawah ini saat di VS Code           */
  /* -------------------------------------------------------------------------- */
  
  useEffect(() => {
    const backButtonListener = CapacitorApp.addListener('backButton', ({ canGoBack }) => {
      if (activeModalRef.current) {
        setActiveModal(null); // Tutup modal jika ada yang terbuka
      } else if (activeTabRef.current !== 'home') {
        setActiveTab('home'); // Kembali ke Home jika di tab lain
      } else {
        CapacitorApp.exitApp(); // Keluar aplikasi jika di Home
      }
    });

    return () => {
      backButtonListener.then(handler => handler.remove());
    };
  }, []);
  
  /* -------------------------------------------------------------------------- */

  // Forms
  const [forms, setForms] = useState({
      account: { id: '', name: '', balance: '', color: 'from-slate-500 to-slate-700', icon: '💰', type: 'cash' },
      budget: { id: '', name: '', limit: '', spent: 0, color: 'bg-indigo-500' },
      goal: { id: '', name: '', target: '', current: 0 },
      debt: { id: '', person: '', amount: '', paid: 0, type: 'borrowed', dueDate: '' }, 
      transaction: { id: '', type: 'expense', amount: '', category: '', accountId: '', targetAccountId: '', note: '', date: new Date().toISOString().split('T')[0] },
      saving: { goalId: '', amount: '', accountId: '' },
      withdrawGoal: { goalId: '', amount: '', accountId: '' },
      payDebt: { debtId: '', amount: '', accountId: '' }
  });

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const updateForm = (form, field, value) => {
    setForms(prev => ({ ...prev, [form]: { ...prev[form], [field]: value } }));
  };

  // --- HELPER FIREBASE (MODIFIED FOR SHARED WALLET) ---
  const saveDataToFirebase = async (newData) => {
    // Hanya simpan jika user login DAN kita sudah punya walletId
    if (auth.currentUser && walletId) {
      try {
        // Simpan ke collection 'wallets', bukan 'users'
        await setDoc(doc(db, "wallets", walletId), newData);
      } catch (error) {
        console.error("Gagal menyimpan data:", error);
      }
    }
  };

  // --- DATA LOADING ---
  // --- FIREBASE DATA LOADING (SHARED WALLET LOGIC) ---
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // 1. Referensi Dokumen User (Profil)
        const userDocRef = doc(db, "users", currentUser.uid);
        
        // Kita cek dulu profil usernya
        const userSnap = await getDoc(userDocRef);
        let activeWalletId = null;

        if (userSnap.exists() && userSnap.data().activeWallet) {
            // KASUS A: User sudah punya dompet (Join atau Lama)
            activeWalletId = userSnap.data().activeWallet;
        } else {
            // KASUS B: User baru / User lama belum migrasi
            // Kita buatkan ID Dompet baru untuknya
            activeWalletId = "wallet_" + currentUser.uid;
            
            // Cek apakah ada data lama di 'users/{uid}' yang perlu diselamatkan?
            let initialData = INITIAL_DATA;
            if (userSnap.exists() && userSnap.data().transactions) {
                // Wah, ini user lama! Kita ambil data lamanya
                initialData = userSnap.data();
            } else {
                // User benar-benar baru, setup nama
                initialData = {
                    ...INITIAL_DATA,
                    user: { ...INITIAL_DATA.user, name: currentUser.displayName || 'User', email: currentUser.email }
                };
            }

            // 1. Simpan Data Keuangan ke 'wallets/{walletId}'
            await setDoc(doc(db, "wallets", activeWalletId), initialData);
            
            // 2. Simpan Pointer di 'users/{uid}'
            // Kita hapus data transaksi di profile user agar enteng, sisakan pointer saja
            await setDoc(userDocRef, { 
                email: currentUser.email,
                activeWallet: activeWalletId 
            });
        }

        // Set State ID Dompet
        setWalletId(activeWalletId);

        // 2. Mulai Dengarkan (Listen) Data Dompet
        let isFirstLoad = true;
        const walletDocRef = doc(db, "wallets", activeWalletId);
        
        const unsubscribeWallet = onSnapshot(walletDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const serverData = docSnap.data();
            setData(serverData);
            
            // Logika PIN (Hanya saat first load)
            if (isFirstLoad) {
                if (serverData.user && serverData.user.pin) {
                   setAuthMode('pin'); setIsSetupMode(false);
                } else {
                   setAuthMode('pin'); setIsSetupMode(true);
                }
                isFirstLoad = false;
            }
          }
          setIsInitializing(false);
        });

        return () => unsubscribeWallet(); // Cleanup listener wallet saat logout

      } else {
        // === USER LOGOUT ===
        setWalletId(null);
        setAuthMode('login'); 
        setData(INITIAL_DATA);
        setIsInitializing(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (data.accounts && data.accounts.length > 0) {
        const firstAccId = data.accounts[0].id;
        if(!forms.transaction.accountId) updateForm('transaction', 'accountId', firstAccId);
        if(!forms.saving.accountId) updateForm('saving', 'accountId', firstAccId);
        if(!forms.withdrawGoal.accountId) updateForm('withdrawGoal', 'accountId', firstAccId);
        if(!forms.payDebt.accountId) updateForm('payDebt', 'accountId', firstAccId);
    }
  }, [data.accounts, isInitializing]);

  // --- AUTH ---
  const handlePinInput = (num) => {
      const newPin = pinState.input + num;
      if (newPin.length <= 6) {
          setPinState(prev => ({ ...prev, input: newPin }));
          if (newPin.length === 6) {
              setTimeout(() => {
                  if (isSetupMode) {
                      if (pinState.setupStep === 1) { setPinState({ input: '', setupStep: 2, tempPin: newPin }); } 
                      else {
                          if (newPin === pinState.tempPin) {
                              // Siapkan data baru
                              const newData = { ...data, user: { ...data.user, pin: newPin } };
                              
                              // Update State UI
                              setData(newData);
                              // SIMPAN KE FIREBASE (PENTING!)
                              saveDataToFirebase(newData);
                              setAuthMode('app'); showNotification("PIN Dibuat!");
                              setIsSetupMode(false); 
                          } else { showNotification("PIN tidak cocok", "error"); setPinState({ input: '', setupStep: 1, tempPin: '' }); }
                      }
                  } else {
                      if (newPin === data.user.pin) { setAuthMode('app'); setPinState({ ...pinState, input: '' }); } 
                      else { showNotification("PIN Salah", "error"); setPinState(prev => ({ ...prev, input: '' })); }
                  }
              }, 200);
          }
      }
  };
  const handleNumpadDelete = () => setPinState(prev => ({ ...prev, input: prev.input.slice(0, -1) }));
  const handleResetApp = () => { if(confirm("Hapus semua data?")) { localStorage.clear(); window.location.reload(); } };

  // --- STATS ---
  const safeAccounts = data.accounts || [];
  const safeTransactions = data.transactions || [];
  const totalBalance = safeAccounts.reduce((sum, acc) => sum + (Number(acc.balance) || 0), 0);
  const monthlyStats = useMemo(() => {
      const now = new Date();
      const prefix = now.toISOString().slice(0, 7);
      return safeTransactions.reduce((stats, tx) => {
          if (tx.date && tx.date.startsWith(prefix)) {
              if (tx.type === 'expense') stats.expense += (Number(tx.amount) || 0);
              if (tx.type === 'income') stats.income += (Number(tx.amount) || 0);
          } return stats;
      }, { income: 0, expense: 0 });
  }, [safeTransactions]);

  const filteredTransactions = useMemo(() => {
      return safeTransactions.filter(tx => {
          const matchType = historyFilter.type === 'all' || tx.type === historyFilter.type;
          const matchDate = !historyFilter.date || tx.date === historyFilter.date;
          const matchSearch = !historyFilter.search || (tx.note||'').toLowerCase().includes(historyFilter.search.toLowerCase()) || String(tx.amount).includes(historyFilter.search);
          return matchType && matchDate && matchSearch;
      });
  }, [safeTransactions, historyFilter]);

  const last7DaysStats = useMemo(() => {
      const stats = [];
      for(let i=6; i>=0; i--) {
          const d = new Date(); d.setDate(d.getDate() - i);
          const dateStr = d.toISOString().split('T')[0];
          const dayName = d.toLocaleDateString('id-ID', {weekday: 'short'});
          const dailyExpense = safeTransactions.filter(t => t.date === dateStr && t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
          stats.push({ day: dayName, amount: dailyExpense });
      }
      return stats;
  }, [safeTransactions]);
  const maxDailyExpense = Math.max(...last7DaysStats.map(s => s.amount), 1); 

  // --- HANDLERS ---
  const openAddGoal = () => { setForms(p => ({ ...p, goal: { id: '', name: '', target: '', current: 0 } })); setIsEditing(false); setActiveModal('goal'); };
  const openAddDebt = () => { setForms(p => ({ ...p, debt: { id: '', person: '', amount: '', paid: 0, type: 'borrowed', dueDate: '' } })); setIsEditing(false); setActiveModal('debt'); };
  const openAddBudget = () => { setForms(p => ({ ...p, budget: { id: '', name: '', limit: '', spent: 0, color: 'bg-indigo-500' } })); setIsEditing(false); setActiveModal('budget'); };
  
  const handleGoogleLogin = async () => {
    setIsInitializing(true);
    try {
      let user;
      
      if (Capacitor.isNativePlatform()) {
        // Logika Android
        // alert("Mencoba login native..."); // Debug 1
        
        const googleUser = await GoogleAuth.signIn();
        // alert("Google User dapat: " + JSON.stringify(googleUser)); // Debug 2
        
        if (!googleUser.authentication || !googleUser.authentication.idToken) {
            throw new Error("Token Google tidak ditemukan. Cek SHA-1 & Client ID.");
        }

        const credential = GoogleAuthProvider.credential(googleUser.authentication.idToken);
        const result = await signInWithCredential(auth, credential);
        
        // alert("Firebase Login Sukses!"); // Debug 3
        user = result.user;
        
      } else {
        // Logika Web
        const result = await signInWithPopup(auth, googleProvider);
        user = result.user;
      }
      
      // Sukses, tunggu onAuthStateChanged bekerja
      
    } catch (error) {
      console.error("Login Error:", error);
      setIsInitializing(false);
      // PENTING: Tampilkan error lengkap ke layar HP
      alert("ERROR: " + error.message + " | " + JSON.stringify(error));
    }
  };cd

  const handleLogout = async () => { 
    if(confirm("Yakin ingin keluar akun?")) {
      await signOut(auth);
    }
  };

  const handleJoinWallet = async (targetWalletId) => {
    try {
      setIsInitializing(true); // Tampilkan loading
      
      // 1. Cek apakah dompet tujuan valid (benar-benar ada?)
      const targetRef = doc(db, "wallets", targetWalletId);
      const targetSnap = await getDoc(targetRef);

      if (!targetSnap.exists()) {
        setIsInitializing(false);
        return showNotification("ID Dompet tidak ditemukan!", "error");
      }

      // 2. Update profil user ini untuk menunjuk ke dompet baru
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, {
        activeWallet: targetWalletId
      });

      // 3. Reload halaman agar aplikasi memuat ulang data dari dompet baru
      alert("Berhasil bergabung! Aplikasi akan dimuat ulang.");
      window.location.reload();

    } catch (error) {
      console.error(error);
      setIsInitializing(false);
      showNotification("Gagal bergabung", "error");
    }
  };
  
  const submitTransaction = (e) => {
      e.preventDefault();
      const form = forms.transaction;
      const amt = parseFloat(form.amount);
      if (!amt || amt <= 0) return showNotification("Jumlah harus > 0", "error");

      let newAcc = [...safeAccounts];
      let newBudgets = [...(data.budgets || [])];
      let newTxList = [...safeTransactions];

      if (form.id) {
          const oldTx = newTxList.find(t => t.id === form.id);
          if (oldTx) {
              const idx = newAcc.findIndex(a => a.id === oldTx.accountId);
              if (idx > -1) {
                  if (oldTx.type === 'expense') newAcc[idx].balance += oldTx.amount;
                  if (oldTx.type === 'income') newAcc[idx].balance -= oldTx.amount;
                  if (oldTx.type === 'transfer') { newAcc[idx].balance += oldTx.amount; const tIdx = newAcc.findIndex(a => a.id === oldTx.targetAccountId); if (tIdx > -1) newAcc[tIdx].balance -= oldTx.amount; }
              }
              newTxList = newTxList.filter(t => t.id !== form.id);
          }
      }

      if (form.type === 'expense') {
          const idx = newAcc.findIndex(a => a.id === form.accountId);
          if (idx === -1) return showNotification("Akun tidak valid", "error");
          if (newAcc[idx].balance < amt) return showNotification("Saldo kurang", "error");
          newAcc[idx].balance -= amt;
          if (form.category) { const bIdx = newBudgets.findIndex(b => b.id === form.category); if (bIdx > -1) newBudgets[bIdx].spent += amt; }
      } else if (form.type === 'income') {
          const idx = newAcc.findIndex(a => a.id === form.accountId);
          if (idx === -1) return showNotification("Akun tidak valid", "error");
          newAcc[idx].balance += amt;
      } else { 
          const sIdx = newAcc.findIndex(a => a.id === form.accountId);
          const tIdx = newAcc.findIndex(a => a.id === form.targetAccountId);
          if (sIdx === -1 || tIdx === -1) return showNotification("Akun invalid", "error");
          if (newAcc[sIdx].balance < amt) return showNotification("Saldo kurang", "error");
          newAcc[sIdx].balance -= amt;
          newAcc[tIdx].balance += amt;
      }

      const finalTx = { ...form, id: form.id || generateId(), amount: amt, timestamp: Date.now() };
      newTxList = [finalTx, ...newTxList].sort((a,b) => new Date(b.date) - new Date(a.date));

      // --- UPDATE FIREBASE ---
      const newData = { ...data, accounts: newAcc, budgets: newBudgets, transactions: newTxList };
      setData(newData);
      saveDataToFirebase(newData); // SIMPAN KE CLOUD!
      // ----------------------

      setActiveModal(null);
      showNotification(form.id ? "Diperbarui" : "Disimpan");
      updateForm('transaction', 'amount', ''); updateForm('transaction', 'note', ''); updateForm('transaction', 'id', '');
  };

  const deleteTransaction = (id) => {
      if (!confirm("Hapus? Saldo dikembalikan.")) return;
      const tx = safeTransactions.find(t => t.id === id);
      if (!tx) return;
      let newAcc = [...safeAccounts];
      const idx = newAcc.findIndex(a => a.id === tx.accountId);
      if (idx > -1) {
          if (tx.type === 'expense') newAcc[idx].balance += Number(tx.amount);
          if (tx.type === 'income') newAcc[idx].balance -= Number(tx.amount);
          if (tx.type === 'transfer') { newAcc[idx].balance += Number(tx.amount); const tIdx = newAcc.findIndex(a => a.id === tx.targetAccountId); if (tIdx > -1) newAcc[tIdx].balance -= Number(tx.amount); }
      }
      
      const newData = { ...data, accounts: newAcc, transactions: data.transactions.filter(t => t.id !== id) };
      setData(newData);
      saveDataToFirebase(newData); // SIMPAN KE CLOUD!
      showNotification("Dihapus");
  };

  const handleAccountTypeChange = (type) => {
      let icon = '💵'; if (type === 'bank') icon = '🏦'; else if (type === 'ewallet') icon = '📱'; else if (type === 'cash') icon = '💵'; 
      setForms(prev => ({ ...prev, account: { ...prev.account, type, icon } }));
  };

  const submitAccount = (e) => { 
      e.preventDefault(); 
      const bal = parseFloat(forms.account.balance)||0; 
      const randomColor = CARD_COLORS[Math.floor(Math.random() * CARD_COLORS.length)];
      const finalColor = isEditing ? forms.account.color : randomColor;
      
      let newAccounts;
      if (isEditing) { 
          newAccounts = data.accounts.map(a => a.id === forms.account.id ? {...a, ...forms.account} : a);
      } else { 
          newAccounts = [...data.accounts, { ...forms.account, id: generateId(), balance: bal, color: finalColor }];
      }
      
      const newData = { ...data, accounts: newAccounts };
      setData(newData);
      saveDataToFirebase(newData); // SIMPAN KE CLOUD!
      setActiveModal(null); 
  };

  const deleteAccount = (id) => { 
      if(data.accounts.length <= 1) return showNotification("Minimal 1 akun", "error"); 
      if(confirm("Hapus?")) { 
          const newData = { ...data, accounts: data.accounts.filter(a => a.id !== id) };
          setData(newData);
          saveDataToFirebase(newData); // SIMPAN KE CLOUD!
          setActiveModal(null); 
      } 
  };

  const submitBudget = (e) => { 
      e.preventDefault(); 
      const lim = parseFloat(forms.budget.limit)||0; 
      
      let newBudgets;
      if(isEditing) {
          newBudgets = data.budgets.map(b=>b.id===forms.budget.id ? {...b, name:forms.budget.name, limit:lim, color:forms.budget.color}:b);
      } else {
          newBudgets = [...(data.budgets||[]), {...forms.budget, id:generateId(), limit:lim, spent:0, icon:'📉'}];
      }

      const newData = { ...data, budgets: newBudgets };
      setData(newData);
      saveDataToFirebase(newData);
      setActiveModal(null); 
  };

  const deleteBudget = (id) => { 
      if(confirm("Hapus?")) { 
          const newData = { ...data, budgets: data.budgets.filter(b=>b.id!==id) };
          setData(newData);
          saveDataToFirebase(newData);
          setActiveModal(null); 
      }
  };

  const submitGoal = (e) => { 
      e.preventDefault(); 
      const tgt = parseFloat(forms.goal.target)||0; 
      
      let newGoals;
      if(isEditing) {
          newGoals = data.goals.map(g=>g.id===forms.goal.id ? {...g, name:forms.goal.name, target:tgt} : g);
      } else {
          newGoals = [...(data.goals||[]), {...forms.goal, id:generateId(), target:tgt, current:0}];
      }

      const newData = { ...data, goals: newGoals };
      setData(newData);
      saveDataToFirebase(newData);
      setActiveModal(null); 
  };

  const deleteGoal = (id) => { 
      if(confirm("Hapus?")) { 
          const newData = { ...data, goals: data.goals.filter(g=>g.id!==id) };
          setData(newData);
          saveDataToFirebase(newData);
          setActiveModal(null); 
      }
  };

  const submitDebt = (e) => { 
      e.preventDefault(); 
      const amt = parseFloat(forms.debt.amount)||0; 
      
      let newDebts;
      if(isEditing) {
          newDebts = data.debts.map(d=>d.id===forms.debt.id ? {...d, ...forms.debt, amount:amt} : d);
      } else {
          newDebts = [...(data.debts||[]), {...forms.debt, id:generateId(), amount:amt, paid:0, type: forms.debt.type || 'borrowed', dueDate: forms.debt.dueDate }];
      }

      const newData = { ...data, debts: newDebts };
      setData(newData);
      saveDataToFirebase(newData);
      setActiveModal(null); 
  };

  const deleteDebt = (id) => { 
      if(confirm("Hapus?")) { 
          const newData = { ...data, debts: data.debts.filter(d=>d.id!==id) };
          setData(newData);
          saveDataToFirebase(newData);
          setActiveModal(null); 
      }
  };

  const handleAddSaving = (e) => { 
      e.preventDefault(); 
      const amt=parseFloat(forms.saving.amount); 
      const accIdx=data.accounts.findIndex(a=>a.id===forms.saving.accountId); 
      if(accIdx===-1)return showNotification("Akun salah","error"); 
      if(data.accounts[accIdx].balance<amt)return showNotification("Saldo kurang","error"); 
      
      const newTx={id:generateId(), type:'transfer', amount:amt, accountId:forms.saving.accountId, targetAccountId:'GOAL', note:`Nabung: ${data.goals.find(g=>g.id===forms.saving.goalId)?.name}`, date:new Date().toISOString().split('T')[0], timestamp:Date.now()}; 
      let newAcc=[...data.accounts]; 
      newAcc[accIdx].balance-=amt; 
      let newGoals=data.goals.map(g=>g.id===forms.saving.goalId?{...g, current:g.current+amt}:g); 
      
      const newData = { ...data, accounts: newAcc, goals: newGoals, transactions: [newTx,...data.transactions] };
      setData(newData);
      saveDataToFirebase(newData);
      setActiveModal(null); 
      showNotification("Ditabung!"); 
  };

  const handleWithdrawSaving = (e) => { 
      e.preventDefault(); 
      const amt=parseFloat(forms.withdrawGoal.amount); 
      const accIdx=data.accounts.findIndex(a=>a.id===forms.withdrawGoal.accountId); 
      const goalIdx=data.goals.findIndex(g=>g.id===forms.withdrawGoal.goalId); 
      if(accIdx===-1)return showNotification("Akun salah","error"); 
      if(data.goals[goalIdx].current<amt)return showNotification("Saldo impian kurang","error"); 
      
      const newTx={id:generateId(), type:'income', amount:amt, accountId:forms.withdrawGoal.accountId, category:'', note:`Tarik Impian: ${data.goals[goalIdx].name}`, date:new Date().toISOString().split('T')[0], timestamp:Date.now()}; 
      let newAcc=[...data.accounts]; 
      newAcc[accIdx].balance+=amt; 
      let newGoals=[...data.goals]; 
      newGoals[goalIdx].current-=amt; 
      
      const newData = { ...data, accounts: newAcc, goals: newGoals, transactions: [newTx,...data.transactions] };
      setData(newData);
      saveDataToFirebase(newData);
      setActiveModal(null); 
      showNotification("Ditarik!"); 
  };

  const handlePayDebt = (e) => { 
      e.preventDefault(); 
      const amt=parseFloat(forms.payDebt.amount); 
      const accIdx=data.accounts.findIndex(a=>a.id===forms.payDebt.accountId); 
      if(accIdx===-1)return showNotification("Akun salah","error"); 
      if(data.accounts[accIdx].balance<amt)return showNotification("Saldo kurang","error"); 
      
      const debt=data.debts.find(d=>d.id===forms.payDebt.debtId); 
      const newTx={id:generateId(), type:'expense', amount:amt, accountId:forms.payDebt.accountId, category:'', note:`Bayar Hutang: ${debt?.person}`, date:new Date().toISOString().split('T')[0], timestamp:Date.now()}; 
      let newAcc=[...data.accounts]; 
      newAcc[accIdx].balance-=amt; 
      let newDebts=data.debts.map(d=>d.id===forms.payDebt.debtId?{...d, paid:d.paid+amt}:d); 
      
      const newData = { ...data, accounts: newAcc, debts: newDebts, transactions: [newTx,...data.transactions] };
      setData(newData);
      saveDataToFirebase(newData);
      setActiveModal(null); 
      showNotification("Dibayar!"); 
  };

  const handleExport = () => { const uri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(JSON.stringify(data)); const link = document.createElement('a'); link.setAttribute('href', uri); link.setAttribute('download', 'backup.json'); link.click(); };
  const handleImport = (e) => { const reader = new FileReader(); reader.onload = (ev) => { try { const parsed = JSON.parse(ev.target.result); setData(parsed); saveDataToFirebase(parsed); showNotification("Data dipulihkan!"); } catch(err) { console.error(err); } }; reader.readAsText(e.target.files[0]); };
  const getPageTitle = (tab) => { const titles = { home: `Hai, ${data.user.name}`, reports: 'Laporan Keuangan', history: 'Riwayat Transaksi', account: 'Akun Saya', goals: 'Daftar Impian', debts: 'Catatan Hutang', budgets: 'Anggaran Bulanan' }; return titles[tab] || 'Dompet Pintar'; };
  // --- RENDERERS ---

  if (isInitializing) return (
      <div className="fixed inset-0 z-[999] bg-slate-950 flex flex-col items-center justify-center overflow-hidden font-sans">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[100px] animate-pulse delay-700"></div>
          <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 mb-8 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-[2rem] flex items-center justify-center shadow-2xl animate-bounce"><Wallet className="w-12 h-12 text-white" /></div>
              <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Dompet Pintar</h1>
              <div className="w-48 h-1 bg-slate-800 rounded-full mt-6 overflow-hidden"><div className="h-full bg-indigo-500 transition-all duration-300" style={{width: `${loadingProgress}%`}}></div></div>
          </div>
      </div>
  );

  if (authMode === 'login') return (
    <div className="fixed inset-0 z-[990] bg-white flex flex-col items-center justify-center p-8 text-center animate-fade-in">
        <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-[2rem] flex items-center justify-center shadow-xl mb-6 animate-bounce">
            <Wallet className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Dompet Pintar</h1>
        <p className="text-slate-500 mb-12 max-w-xs mx-auto">Kelola keuanganmu dengan mudah, aman, dan terintegrasi cloud.</p>
        
        <button onClick={handleGoogleLogin} className="w-full max-w-xs bg-white border border-slate-200 text-slate-700 font-bold py-4 rounded-2xl shadow-lg hover:bg-slate-50 active:scale-95 transition-all flex items-center justify-center gap-3">
            {/* Menggunakan icon Wallet sementara jika tidak ada gambar google, atau pakai text saja */}
            <span className="text-xl font-bold text-blue-500">G</span>
            Masuk dengan Google
        </button>
        <p className="mt-8 text-xs text-slate-400">Versi 2.0 (Cloud Enabled)</p>
    </div>
  );

  if (authMode === 'pin') return (
      <div className="fixed inset-0 z-[990] bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
          <div className="mb-12 text-center">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl border border-slate-100"><Lock className="w-8 h-8 text-slate-700"/></div>
              <h2 className="text-2xl font-bold text-slate-800">{isSetupMode ? (pinState.setupStep === 1 ? "Buat PIN Baru" : "Konfirmasi PIN") : "Selamat Datang"}</h2>
              <p className="text-slate-400 text-sm mt-2">Akses aman data keuangan Anda</p>
          </div>
          <div className="flex gap-4 mb-12">{[...Array(6)].map((_,i) => (<div key={i} className={`w-3 h-3 rounded-full transition-all ${pinState.input.length > i ? 'bg-indigo-600 scale-125' : 'bg-slate-300'}`}></div>))}</div>
          <div className="grid grid-cols-3 gap-6 w-full max-w-[300px]">
              {[1,2,3,4,5,6,7,8,9].map(n => <button key={n} onClick={() => handlePinInput(n)} className="w-20 h-20 rounded-full bg-white hover:bg-slate-50 shadow-sm border border-slate-100 text-2xl font-bold text-slate-700 active:scale-95 transition-transform">{n}</button>)}
              <div className="w-20"></div>
              <button onClick={() => handlePinInput(0)} className="w-20 h-20 rounded-full bg-white hover:bg-slate-50 shadow-sm border border-slate-100 text-2xl font-bold text-slate-700 active:scale-95 transition-transform">0</button>
              <button onClick={() => handleNumpadDelete()} className="w-20 h-20 rounded-full hover:bg-red-50 text-red-400 flex items-center justify-center active:scale-95 transition-transform"><Delete size={28}/></button>
          </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans pb-24 relative">
      <div className="fixed top-0 left-0 right-0 h-80 bg-gradient-to-b from-indigo-500 to-transparent -z-10 pointer-events-none opacity-10"></div>
      {notification && <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-[100] px-6 py-3 rounded-full shadow-xl flex items-center gap-3 animate-slide-down backdrop-blur-md ${notification.type==='error'?'bg-red-500/90 text-white':'bg-indigo-600/90 text-white'}`}><p className="font-medium text-sm">{notification.msg}</p></div>}

      <div className="max-w-md mx-auto min-h-screen relative bg-white sm:shadow-2xl sm:my-8 sm:rounded-[3rem] sm:min-h-[800px] sm:overflow-hidden sm:border-8 sm:border-slate-100">
        
        {/* Header */}
        <div className="px-8 pt-8 pb-4 flex justify-between items-center bg-transparent">
            <div><p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Dompet Pintar</p><h3 className="font-bold text-xl text-slate-800">{getPageTitle(activeTab)}</h3></div>
            <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600"><User size={20}/></div>
        </div>

        <div className="px-6 pb-32 h-[calc(100vh-140px)] sm:h-[650px] overflow-y-auto hide-scrollbar space-y-8">
            
            {/* VIEW: HOME (Sudah di-modularisasi) */}
            {activeTab === 'home' && (
                <HomeView 
                    // Mengirim State ke Komponen Anak
                    data={data}
                    totalBalance={totalBalance}
                    monthlyStats={monthlyStats}
                    showBalance={showBalance}
                    setShowBalance={setShowBalance}
                    safeAccounts={safeAccounts}
                    // Mengirim Fungsi (Control)
                    setActiveTab={setActiveTab}
                    setActiveModal={setActiveModal}
                    setIsEditing={setIsEditing}
                    setForms={setForms}
                    updateForm={updateForm}
                />
            )}

            {/* HISTORY TAB (Sudah di-modularisasi) */}
            {activeTab === 'history' && (
                 <HistoryView 
                    transactions={filteredTransactions} // Kita kirim data yang SUDAH difilter
                    historyFilter={historyFilter}
                    setHistoryFilter={setHistoryFilter}
                    setActiveModal={setActiveModal}
                    setForms={setForms}
                    deleteTransaction={deleteTransaction}
                />
            )}

            {/* ACCOUNT TAB(Sudah di-modularisasi) */}
            {activeTab === 'account' && (
                <AccountView 
                    user={data.user}
                    walletId={walletId} // Kirim ID Dompet ke View
                    onJoinClick={() => setActiveModal('joinWallet')} // Buka Modal Join
                    onExport={handleExport}
                    onImport={handleImport}
                    onReset={handleResetApp}
                    onLogout={handleLogout}
                    onChangePin={() => {
                        // Logika Ubah PIN: Masuk mode setup, reset state PIN, kembali ke layar auth
                        setIsSetupMode(true);
                        setPinState({ input: '', setupStep: 1, tempPin: '' });
                        setAuthMode('pin'); // Ini akan memicu tampilan PinScreen
                    }}
                />
            )}
            
            {/* SUB PAGES */}
            {/* REPORTS TAB */}
            {activeTab === 'reports' && (
                <ReportsView 
                    monthlyStats={monthlyStats}
                    last7DaysStats={last7DaysStats}
                    maxDailyExpense={maxDailyExpense}
                    budgets={data.budgets}
                />
            )}
            {/* BUDGETS TAB */}
            {activeTab === 'budgets' && (
                <BudgetsView 
                    budgets={data.budgets}
                    openAddBudget={openAddBudget}
                    setForms={setForms}
                    setIsEditing={setIsEditing}
                    setActiveModal={setActiveModal}
                    deleteBudget={deleteBudget}
                />
            )}
            {/* GOALS TAB */}
            {activeTab === 'goals' && (
                <GoalsView 
                    goals={data.goals}
                    openAddGoal={openAddGoal}
                    setForms={setForms}
                    setIsEditing={setIsEditing}
                    setActiveModal={setActiveModal}
                    deleteGoal={deleteGoal}
                    accounts={data.accounts}
                />
            )}
            {/* DEBTS TAB */}
            {activeTab === 'debts' && (
                <DebtsView 
                    debts={data.debts}
                    openAddDebt={openAddDebt}
                    setForms={setForms}
                    setIsEditing={setIsEditing}
                    setActiveModal={setActiveModal}
                    deleteDebt={deleteDebt}
                    accounts={data.accounts}
                />
            )}

        </div>

        {/* NAVIGATION DOCK (Fixed Spacing Grid) */}
        <BottomNav 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            onAddClick={() => {
                updateForm('transaction','id',''); 
                setActiveModal('transaction');
            }} 
        />

        {/* MODALS */}
        {/* 1. Transaction Modal */}
        {activeModal === 'transaction' && (
             <TransactionModal 
                isOpen={true} // Karena logic render ada di parent, ini selalu true
                onClose={() => setActiveModal(null)}
                forms={forms}
                updateForm={updateForm}
                submitTransaction={submitTransaction}
                data={data}
            />
        )}
        {/* 2. Account Modal */}
        {activeModal === 'account' && (
            <AccountModal 
                isOpen={true}
                onClose={() => setActiveModal(null)}
                isEditing={isEditing}
                forms={forms}
                updateForm={updateForm}
                submitAccount={submitAccount}
                deleteAccount={deleteAccount}
            />
        )}
        {/* 3. Budget Modal */}        
        {activeModal === 'budget' && (
            <BudgetModal 
                isOpen={true}
                onClose={() => setActiveModal(null)}
                isEditing={isEditing}
                forms={forms}
                updateForm={updateForm}
                submitBudget={submitBudget}
                deleteBudget={deleteBudget}
            />
        )}    
        {/* Goal */}
      <GoalModal 
          isOpen={activeModal === 'goal'} 
          onClose={() => setActiveModal(null)}
          isEditing={isEditing} forms={forms} updateForm={updateForm} submitGoal={submitGoal} deleteGoal={deleteGoal}
      />

      {/* Debt */}
      <DebtModal 
          isOpen={activeModal === 'debt'} 
          onClose={() => setActiveModal(null)}
          isEditing={isEditing} forms={forms} updateForm={updateForm} submitDebt={submitDebt} deleteDebt={deleteDebt}
      />

      {/* Join Wallet Modal */}
      <JoinWalletModal 
          isOpen={activeModal === 'joinWallet'}
          onClose={() => setActiveModal(null)}
          onJoin={handleJoinWallet}
      />

      {/* Action Modals (Saving, PayDebt, Withdraw, AI) */}
      <SavingModal 
          isOpen={activeModal === 'saving'} onClose={() => setActiveModal(null)}
          forms={forms} updateForm={updateForm} handleAddSaving={handleAddSaving} accounts={data.accounts}
      />
      
      <PayDebtModal 
          isOpen={activeModal === 'payDebt'} onClose={() => setActiveModal(null)}
          forms={forms} updateForm={updateForm} handlePayDebt={handlePayDebt} accounts={data.accounts}
      />

      <WithdrawGoalModal 
          isOpen={activeModal === 'withdrawGoal'} onClose={() => setActiveModal(null)}
          forms={forms} updateForm={updateForm} handleWithdrawSaving={handleWithdrawSaving} accounts={data.accounts}
      />

      <AIModal 
          isOpen={activeModal === 'ai'} onClose={() => setActiveModal(null)} 
      />
      </div>
    </div>
  );
}