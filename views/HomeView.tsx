
import React, { useState, useEffect } from 'react';
import { HairPlan, DayTask } from '../types';
import { fastHairTip } from '../services/geminiService';

interface HomeViewProps {
  hairPlan: HairPlan | null;
  onStartDiagnosis: () => void;
}

interface RitualItem {
  id: string;
  text: string;
  completed: boolean;
}

const HomeView: React.FC<HomeViewProps> = ({ hairPlan, onStartDiagnosis }) => {
  const [quickTip, setQuickTip] = useState<string | null>(null);
  const [isLoadingTip, setIsLoadingTip] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<string | null>(null);
  
  // Daily Rituals State
  const [rituals, setRituals] = useState<RitualItem[]>(() => {
    const saved = localStorage.getItem('capillaire_rituals');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', text: 'Massagem capilar (4 min)', completed: false },
      { id: '2', text: 'Beber 2L de água', completed: false },
      { id: '3', text: 'Suplementação vitamínica', completed: false },
      { id: '4', text: 'Tônico de crescimento', completed: false }
    ];
  });

  useEffect(() => {
    localStorage.setItem('capillaire_rituals', JSON.stringify(rituals));
  }, [rituals]);

  const toggleRitual = (id: string) => {
    setRituals(prev => prev.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
  };

  // Calculations for progress
  const totalDays = 30;
  const currentDay = hairPlan ? Math.min(Math.floor((Date.now() - new Date(hairPlan.createdAt).getTime()) / (1000 * 60 * 60 * 24)) + 1, totalDays) : 1;
  const completedTasks = hairPlan?.tasks.filter(t => t.completed) || [];
  const completedCount = completedTasks.length;
  const progressPercent = Math.round((completedCount / totalDays) * 100);
  
  const todayTask = hairPlan?.tasks.find(t => t.day === currentDay);
  
  // Upcoming tasks for the timeline (next 4 days)
  const upcomingTasks = hairPlan 
    ? hairPlan.tasks.filter(t => t.day > currentDay && t.day <= currentDay + 4)
    : [];

  // Circular progress calculation
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progressPercent / 100) * circumference;

  const handleGetTip = async (problem: string) => {
    setSelectedProblem(problem);
    setIsLoadingTip(true);
    setQuickTip(null);
    try {
      const tip = await fastHairTip(problem, hairPlan?.diagnosis);
      setQuickTip(tip);
    } catch (error) {
      setQuickTip("Não conseguimos buscar sua dica agora. Tente em instantes.");
    } finally {
      setIsLoadingTip(false);
    }
  };

  const getCategoryColor = (cat: string) => {
    switch(cat) {
      case 'Hidratação': return 'bg-blue-400';
      case 'Nutrição': return 'bg-orange-400';
      case 'Reconstrução': return 'bg-rose-400';
      default: return 'bg-emerald-400';
    }
  };

  const commonProblems = [
    { label: 'Frizz', icon: '🌬️' },
    { label: 'Queda', icon: '🍂' },
    { label: 'Oleosidade', icon: '✨' },
    { label: 'Pontas', icon: '✂️' },
    { label: 'Resseco', icon: '🌵' },
    { label: 'Caspa', icon: '❄️' }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-1000 pt-2 pb-10">
      {/* Premium Apple-Style Progress Card */}
      <section className="relative group">
        <div className="absolute inset-0 bg-[#2d4a22] rounded-[36px] scale-[1.02] blur-2xl opacity-10 group-hover:opacity-15 transition-opacity"></div>
        <div className="relative bg-[#2d4a22] rounded-[36px] p-8 text-white overflow-hidden shadow-2xl shadow-emerald-950/30">
          <div className="relative z-10 flex flex-col space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-300 opacity-80">Dashboard Capilar</span>
                <h2 className="text-3xl font-bold mt-1 tracking-tight">Sua Jornada</h2>
                <p className="text-sm text-emerald-100/60 mt-2 font-medium">
                  {hairPlan ? `Dia ${currentDay} de ${totalDays}` : "Pronta para brilhar?"}
                </p>
              </div>

              {hairPlan && (
                <div className="relative flex items-center justify-center">
                  <svg className="w-24 h-24 transform -rotate-90 drop-shadow-lg">
                    <circle
                      cx="48"
                      cy="48"
                      r={radius}
                      stroke="currentColor"
                      strokeWidth="7"
                      fill="transparent"
                      className="text-white/10"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r={radius}
                      stroke="currentColor"
                      strokeWidth="7"
                      fill="transparent"
                      strokeDasharray={circumference}
                      style={{ strokeDashoffset: offset, transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
                      strokeLinecap="round"
                      className="text-white"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-xl font-bold tracking-tighter leading-none">{progressPercent}%</span>
                  </div>
                </div>
              )}
            </div>

            {hairPlan && (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-[0.15em] text-emerald-200/50">
                  <span>Consistência Total</span>
                  <span>{completedCount}/{totalDays} Atividades</span>
                </div>
                <div className="grid grid-cols-10 gap-1.5">
                  {hairPlan.tasks.map((task) => (
                    <div 
                      key={task.day} 
                      className={`h-1.5 rounded-full transition-all duration-500 
                        ${task.completed 
                          ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]' 
                          : task.day < currentDay 
                            ? 'bg-red-400/30' 
                            : 'bg-white/10'}
                      `}
                    />
                  ))}
                </div>
              </div>
            )}

            {!hairPlan && (
              <button 
                onClick={onStartDiagnosis}
                className="bg-white text-[#2d4a22] px-8 py-4 rounded-[22px] text-sm font-bold shadow-xl transition-all active:scale-95 hover:bg-emerald-50 tap-highlight-none w-full sm:w-auto"
              >
                Começar Diagnóstico
              </button>
            )}
          </div>
          <div className="absolute -right-16 -bottom-16 w-56 h-56 bg-emerald-400/10 rounded-full blur-[80px] animate-pulse"></div>
        </div>
      </section>

      {/* Daily Rituals Checklist (ToDo List) */}
      <section className="space-y-5 animate-in slide-in-from-bottom-6 duration-700 delay-100">
        <div className="flex items-end justify-between px-1">
          <h3 className="text-xl font-bold text-[#1D1D1F]">Rituais Diários</h3>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Hábito Saudável</span>
        </div>
        <div className="bg-white border border-gray-100 rounded-[32px] p-2 shadow-sm overflow-hidden">
          {rituals.map((ritual) => (
            <button
              key={ritual.id}
              onClick={() => toggleRitual(ritual.id)}
              className="w-full flex items-center p-4 hover:bg-gray-50 transition-colors group first:rounded-t-[30px] last:rounded-b-[30px]"
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 mr-4
                ${ritual.completed ? 'bg-[#2d4a22] border-[#2d4a22]' : 'border-gray-200 group-hover:border-[#2d4a22]/30'}
              `}>
                {ritual.completed && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className={`text-sm font-medium transition-all duration-300 ${ritual.completed ? 'text-gray-300 line-through' : 'text-gray-700'}`}>
                {ritual.text}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Visual Timeline: Completed & Upcoming */}
      {hairPlan && (
        <section className="space-y-5 animate-in slide-in-from-bottom-6 duration-700 delay-150">
          <div className="flex items-end justify-between px-1">
            <h3 className="text-xl font-bold text-[#1D1D1F]">Próximos Passos</h3>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Calendário</span>
          </div>
          <div className="flex overflow-x-auto space-x-4 pb-4 no-scrollbar -mx-8 px-8">
            {todayTask && (
              <div className="flex-shrink-0 w-[240px] bg-white border-2 border-[#2d4a22]/10 rounded-[28px] p-6 shadow-sm relative overflow-hidden">
                <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-[8px] font-bold uppercase text-white ${todayTask.completed ? 'bg-emerald-500' : 'bg-[#2d4a22]'}`}>
                  {todayTask.completed ? 'Concluído' : 'Hoje'}
                </div>
                <div className="mb-3">
                  <span className={`text-[8px] px-2 py-1 rounded-lg font-bold uppercase text-white ${getCategoryColor(todayTask.category)}`}>
                    {todayTask.category}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{todayTask.title}</h4>
                <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">{todayTask.description}</p>
              </div>
            )}
            
            {upcomingTasks.map((task) => (
              <div key={task.day} className="flex-shrink-0 w-[180px] bg-gray-50/50 border border-gray-100 rounded-[28px] p-5 opacity-80 hover:opacity-100 transition-opacity">
                <div className="mb-3 flex justify-between items-center">
                  <span className="text-[9px] font-bold text-gray-400 uppercase">Dia {task.day}</span>
                  <div className={`w-2 h-2 rounded-full ${getCategoryColor(task.category)} opacity-40`}></div>
                </div>
                <h4 className="text-xs font-bold text-gray-700 line-clamp-1">{task.title}</h4>
                <p className="text-[10px] text-gray-400 mt-1 line-clamp-1">{task.category}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Dica Express - Polished Selection Section */}
      <section className="space-y-5 animate-in slide-in-from-bottom-6 duration-700 delay-200">
        <h3 className="text-xl font-bold text-[#1D1D1F] px-1">Atalhos da Natureza</h3>
        <p className="text-xs text-gray-400 px-1 -mt-3">Dicas rápidas da IA para problemas imediatos.</p>
        
        <div className="flex overflow-x-auto space-x-3 pb-4 no-scrollbar -mx-8 px-8">
          {commonProblems.map((p) => (
            <button
              key={p.label}
              onClick={() => handleGetTip(p.label)}
              disabled={isLoadingTip}
              className={`flex-shrink-0 flex flex-col items-center justify-center w-24 h-28 rounded-[28px] border transition-all duration-400 tap-highlight-none
                ${selectedProblem === p.label 
                  ? 'bg-[#2d4a22] text-white border-[#2d4a22] shadow-xl shadow-emerald-900/20 scale-105' 
                  : 'bg-white border-gray-100/80 text-gray-600 hover:border-gray-200 active:scale-95 shadow-sm'}
              `}
            >
              <span className="text-2xl mb-2">{p.icon}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">{p.label}</span>
            </button>
          ))}
        </div>

        {(isLoadingTip || quickTip) && (
          <div className="bg-white border border-gray-100 rounded-[36px] p-8 shadow-2xl animate-in zoom-in-95 duration-500 relative overflow-hidden">
            {isLoadingTip ? (
              <div className="flex flex-col items-center py-6 space-y-4">
                <div className="w-10 h-10 border-[3px] border-[#2d4a22]/10 border-t-[#2d4a22] rounded-full animate-spin"></div>
                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">Sintonizando Natureza...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-[#2d4a22]">
                  <div className="p-2 bg-emerald-50 rounded-[14px]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-xs font-extrabold uppercase tracking-[0.15em]">Sua Dica AI</span>
                </div>
                <p className="text-lg font-medium text-gray-800 leading-relaxed italic">
                  "{quickTip}"
                </p>
                <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                  <span>Baseado no seu perfil</span>
                  <span className="text-emerald-600">Verificado</span>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Minimalism Philosophy Section */}
      <section className="grid grid-cols-2 gap-5 animate-in slide-in-from-bottom-6 duration-700 delay-300">
        <div className="bg-[#F5F5F7] rounded-[32px] p-7 flex flex-col items-start space-y-5 group transition-all hover:bg-white hover:shadow-lg">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-2xl group-hover:scale-110 transition-transform">🌿</div>
          <div>
            <p className="text-[13px] font-bold text-gray-900">100% Orgânico</p>
            <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">Puro da terra para você.</p>
          </div>
        </div>
        <div className="bg-[#F5F5F7] rounded-[32px] p-7 flex flex-col items-start space-y-5 group transition-all hover:bg-white hover:shadow-lg">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-2xl group-hover:scale-110 transition-transform">🧪</div>
          <div>
            <p className="text-[13px] font-bold text-gray-900">Sem Químicos</p>
            <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">Beleza sem toxinas.</p>
          </div>
        </div>
      </section>

      <div className="text-center pb-8 opacity-40">
        <p className="text-[9px] font-bold uppercase tracking-[0.4em]">Capillaire AI • 2024</p>
      </div>
    </div>
  );
};

export default HomeView;
