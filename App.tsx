
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import { HairPlan, HairDiagnosis, HairType, ScalpType, MainGoal } from './types';
import { generateHairPlan } from './services/geminiService';
import HomeView from './views/HomeView';
import DiagnosisForm from './views/DiagnosisForm';
import ScheduleView from './views/ScheduleView';
import ChatView from './views/ChatView';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [hairPlan, setHairPlan] = useState<HairPlan | null>(null);
  const [isDiagnosing, setIsDiagnosing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);

  // Load plan and settings from localStorage on mount
  useEffect(() => {
    const savedPlan = localStorage.getItem('capillaire_plan');
    if (savedPlan) {
      setHairPlan(JSON.parse(savedPlan));
    }
    const savedNotifs = localStorage.getItem('capillaire_notifs') === 'true';
    setNotificationsEnabled(savedNotifs);
  }, []);

  // Save plan to localStorage when it changes
  useEffect(() => {
    if (hairPlan) {
      localStorage.setItem('capillaire_plan', JSON.stringify(hairPlan));
    }
  }, [hairPlan]);

  const handleStartDiagnosis = () => {
    setIsDiagnosing(true);
  };

  const handleFinishDiagnosis = async (diagnosis: HairDiagnosis) => {
    setIsLoading(true);
    try {
      const plan = await generateHairPlan(diagnosis);
      setHairPlan(plan);
      setIsDiagnosing(false);
      setActiveTab('schedule');
    } catch (error) {
      console.error("Erro ao gerar plano:", error);
      alert("Houve um erro ao gerar seu plano. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTask = (day: number) => {
    if (!hairPlan) return;
    const updatedTasks = hairPlan.tasks.map(t => 
      t.day === day ? { ...t, completed: !t.completed } : t
    );
    setHairPlan({ ...hairPlan, tasks: updatedTasks });
  };

  const handleToggleNotifications = async () => {
    if (!notificationsEnabled) {
      if (!("Notification" in window)) {
        alert("Este navegador não suporta notificações.");
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setNotificationsEnabled(true);
        localStorage.setItem('capillaire_notifs', 'true');
        new Notification("Capillaire AI", {
          body: "Lembretes diários ativados com sucesso! ✨",
          icon: "https://cdn-icons-png.flaticon.com/512/3063/3063822.png"
        });
      } else {
        alert("Você precisa permitir as notificações nas configurações do navegador.");
      }
    } else {
      setNotificationsEnabled(false);
      localStorage.setItem('capillaire_notifs', 'false');
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="h-full flex flex-col items-center justify-center space-y-6 text-center">
          <div className="w-16 h-16 border-4 border-[#2d4a22] border-t-transparent rounded-full animate-spin"></div>
          <div>
            <h2 className="text-xl font-bold text-[#2d4a22]">Criando sua jornada...</h2>
            <p className="text-sm text-gray-500 max-w-xs">Nossa IA está analisando seus dados para criar o melhor cronograma 100% natural.</p>
          </div>
        </div>
      );
    }

    if (isDiagnosing) {
      return <DiagnosisForm onFinish={handleFinishDiagnosis} onCancel={() => setIsDiagnosing(false)} />;
    }

    switch (activeTab) {
      case 'home':
        return <HomeView hairPlan={hairPlan} onStartDiagnosis={handleStartDiagnosis} />;
      case 'schedule':
        return hairPlan ? (
          <ScheduleView plan={hairPlan} onToggleTask={toggleTask} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
             <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
             </div>
             <h3 className="text-lg font-bold text-gray-800">Sem cronograma ativo</h3>
             <p className="text-sm text-gray-500 mb-6">Inicie seu diagnóstico para gerar um plano personalizado.</p>
             <button 
              onClick={handleStartDiagnosis}
              className="bg-[#2d4a22] text-white px-8 py-3 rounded-full font-semibold"
             >
               Começar Diagnóstico
             </button>
          </div>
        );
      case 'chat':
        return <ChatView />;
      case 'profile':
        return (
          <div className="p-4 space-y-6">
             <h2 className="text-2xl font-bold text-[#2d4a22]">Configurações</h2>
             
             <div className="space-y-4">
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">Preferências</h3>
               <div className="bg-white border border-gray-100 rounded-2xl p-4">
                 <div className="flex items-center justify-between">
                   <div className="flex items-center space-x-3">
                     <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-[#2d4a22]">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                       </svg>
                     </div>
                     <div>
                       <p className="text-sm font-bold text-gray-800">Lembretes Diários</p>
                       <p className="text-[10px] text-gray-400">Notificações para suas tarefas</p>
                     </div>
                   </div>
                   <button 
                    onClick={handleToggleNotifications}
                    className={`w-12 h-6 rounded-full p-1 transition-colors ${notificationsEnabled ? 'bg-[#2d4a22]' : 'bg-gray-200'}`}
                   >
                     <div className={`w-4 h-4 bg-white rounded-full transition-transform ${notificationsEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                   </button>
                 </div>
               </div>
             </div>

             <div className="space-y-4">
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">Ações de Conta</h3>
               <div className="bg-white border border-gray-100 rounded-2xl p-4">
                 <button 
                  onClick={() => {
                    if(confirm("Deseja realmente apagar seu progresso?")) {
                      localStorage.removeItem('capillaire_plan');
                      localStorage.removeItem('capillaire_notifs');
                      setHairPlan(null);
                      setNotificationsEnabled(false);
                      setActiveTab('home');
                    }
                  }}
                  className="w-full text-left text-red-500 font-medium flex items-center space-x-3"
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                   </svg>
                   <span>Reiniciar Aplicativo</span>
                 </button>
               </div>
             </div>

             <div className="text-center text-[10px] text-gray-400 pt-10">
               Capillaire AI v1.1.0<br/>Feito com ❤️ por Especialistas
             </div>
          </div>
        );
      default:
        return <HomeView hairPlan={hairPlan} onStartDiagnosis={handleStartDiagnosis} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;
