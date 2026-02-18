
import React, { useState, useEffect } from 'react';
import { HairPlan, DayTask } from '../types';

interface ScheduleViewProps {
  plan: HairPlan;
  onToggleTask: (day: number) => void;
}

const ScheduleView: React.FC<ScheduleViewProps> = ({ plan, onToggleTask }) => {
  const [selectedTask, setSelectedTask] = useState<DayTask | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const getCategoryColor = (cat: string) => {
    switch(cat) {
      case 'Hidratação': return 'bg-blue-500';
      case 'Nutrição': return 'bg-orange-400';
      case 'Reconstrução': return 'bg-red-500';
      case 'Detox': return 'bg-emerald-500';
      default: return 'bg-gray-300';
    }
  };

  const getFallbackRecipe = (category: string) => {
    const budget = plan.diagnosis.budgetLevel;
    const isPremium = budget.includes('Premium');
    const isMedium = budget.includes('Médio');

    switch (category) {
      case 'Hidratação':
        return `Improvisação Capillaire:\n\n${isPremium ? 'Misture sua máscara base com 5ml de D-Pantenol concentrado e uma ampola de vitaminas.' : isMedium ? 'Adicione uma colher de mel orgânico e uma tampa de glicerina bi-destilada à sua máscara.' : 'Use 2 colheres de sopa de soro fisiológico misturadas ao seu condicionador habitual. O açúcar também ajuda no brilho!'}\n\nTempo: 15 minutos.`;
      case 'Nutrição':
        return `Improvisação Capillaire:\n\n${isPremium ? 'Utilize Óleo de Argan 100% puro ou Manteiga de Murumuru nos fios secos.' : isMedium ? 'Aplique Óleo de Coco extra virgem ou Óleo de Rícino apenas no comprimento.' : 'Use Azeite de Oliva Extra Virgem morno para uma umectação rápida antes do banho.'}\n\nTempo: 20 a 30 minutos.`;
      case 'Reconstrução':
        return `Improvisação Capillaire:\n\n${isPremium ? 'Aplique Queratina Vegetal líquida borrifando nos fios e sele com uma máscara reconstrutora potente.' : isMedium ? 'Dissolva meia folha de gelatina incolor em água morna e misture ao creme.' : 'Use o método da clara de ovo (rica em proteínas) batida com seu creme por apenas 10 minutos.'}\n\nUso: Apenas se o fio estiver poroso ou elástico.`;
      case 'Detox':
        return "Improvisação Capillaire:\n\nFaça um chá forte de hortelã ou alecrim, deixe esfriar e use no último enxágue do couro cabeludo para estimular a circulação.";
      default:
        return "Aproveite o dia de descanso para massagear o couro cabeludo a seco por 5 minutos, estimulando o crescimento natural.";
    }
  };

  const handleToggle = (task: DayTask) => {
    const isCompleting = !task.completed;
    onToggleTask(task.day);
    if (isCompleting) {
      setToastMessage(`Dia ${task.day} concluído! ✨`);
    }
    setSelectedTask(null);
  };

  return (
    <div className="py-4 space-y-6 animate-in slide-in-from-bottom duration-300 pb-20 relative">
      <header>
        <h2 className="text-2xl font-bold text-[#2d4a22]">Seu Cronograma</h2>
        <p className="text-sm text-gray-500">Acompanhe seu progresso de 30 dias.</p>
      </header>

      {/* Grid of days */}
      <div className="grid grid-cols-5 gap-3">
        {plan.tasks.map((task) => (
          <button
            key={task.day}
            onClick={() => setSelectedTask(task)}
            className={`
              aspect-square rounded-2xl border flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300 tap-highlight-none
              ${task.completed ? 'bg-[#e8f0e3] border-[#2d4a22] shadow-sm' : 'bg-white border-gray-100'}
              active:scale-90
            `}
          >
            <span className={`text-[8px] font-bold ${task.completed ? 'text-[#2d4a22]' : 'text-gray-400'}`}>DIA {task.day}</span>
            <div className={`w-1.5 h-1.5 rounded-full mt-1 ${getCategoryColor(task.category)}`}></div>
            {task.completed && (
              <div className="absolute top-1.5 right-1.5 animate-checkmark">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-[#2d4a22]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Subtle Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[100] w-auto">
          <div className="bg-[#1D1D1F] text-white text-xs font-bold px-6 py-3 rounded-full shadow-2xl animate-toast flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[32px] p-8 space-y-6 animate-in slide-in-from-bottom duration-400 shadow-2xl">
            <div className="flex justify-between items-start">
              <div>
                <span className={`text-[10px] text-white font-bold px-3 py-1 rounded-full uppercase tracking-widest ${getCategoryColor(selectedTask.category)} shadow-sm`}>
                  {selectedTask.category}
                </span>
                <h3 className="text-2xl font-extrabold text-[#2d4a22] mt-4 leading-tight">Dia {selectedTask.day}: {selectedTask.title}</h3>
              </div>
              <button 
                onClick={() => setSelectedTask(null)} 
                className="p-3 bg-gray-50 rounded-2xl text-gray-400 active:scale-90 transition-transform tap-highlight-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="max-h-[55vh] overflow-y-auto space-y-6 pr-2 no-scrollbar">
              <section className="animate-in fade-in duration-500">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3">Instruções da AI</h4>
                <p className="text-base text-gray-600 leading-relaxed font-medium">{selectedTask.description}</p>
              </section>

              <section className="bg-[#fcfbf7] border border-[#e8f0e3] p-6 rounded-[28px] relative overflow-hidden animate-in slide-in-from-bottom-4 duration-500 delay-100">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#2d4a22] opacity-30"></div>
                <h4 className="text-[10px] font-bold text-[#2d4a22] uppercase tracking-[0.2em] mb-3 flex items-center">
                  <span className="mr-2">🍃</span> {selectedTask.recipe ? 'Receita Personalizada' : 'Sugestão de Improviso'}
                </h4>
                <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed italic font-medium">
                  {selectedTask.recipe || getFallbackRecipe(selectedTask.category)}
                </div>
                {(!selectedTask.recipe && ['Hidratação', 'Nutrição', 'Reconstrução'].includes(selectedTask.category)) && (
                   <div className="mt-4 pt-4 border-t border-emerald-100 flex items-center text-[9px] text-emerald-600 font-bold uppercase tracking-wider">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                       <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.536 14.95a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707z" />
                     </svg>
                     Ajustado ao orçamento: {plan.diagnosis.budgetLevel}
                   </div>
                )}
              </section>
            </div>

            <div className="pt-4 flex space-x-3">
              <button 
                onClick={() => handleToggle(selectedTask)}
                className={`flex-1 py-5 rounded-[22px] font-bold transition-all duration-300 shadow-lg tap-highlight-none active:scale-[0.97]
                  ${selectedTask.completed 
                    ? 'bg-gray-100 text-gray-400 shadow-none' 
                    : 'bg-[#2d4a22] text-white shadow-emerald-950/20'}`}
              >
                {selectedTask.completed ? 'Reabrir Tarefa' : 'Concluir Dia'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleView;
