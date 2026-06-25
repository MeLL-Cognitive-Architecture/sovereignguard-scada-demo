import React, { useState, useEffect, useCallback } from 'react';
import { 
  ShieldAlert, Cpu, Activity, Clock, Settings, AlertTriangle, 
  CheckSquare, Square, CheckCircle2, PenTool, ListFilter, 
  ArrowUpRight, ArrowDownRight, Zap, Bell, Info, ShieldCheck,
  User, Database, LayoutPanelLeft, FileText, ChevronRight,
  TrendingUp, BarChart3, History, Gauge, Factory, Droplets
} from 'lucide-react';

export default function App() {
  // ==========================================
  // ESTADOS DE PROCESSO E HISTORIADOR
  // ==========================================
  const [activeTab, setActiveTab] = useState('DASHBOARD');
  const [count, setCount] = useState(10);
  const [operacaoFinalizada, setOperacaoFinalizada] = useState(false);
  const [mtbf, setMtbf] = useState(94); 
  const [backlog, setBacklog] = useState(1.2);
  const [efficiency, setEfficiency] = useState(98.5);
  const [historyData, setHistoryData] = useState([]); 
  const [systemStatus, setSystemStatus] = useState('NORMAL'); 
  const [logs, setLogs] = useState([]);
  
  // Modos de Operação
  const [operationMode, setOperationMode] = useState(null); 
  const [isAutoRunning, setIsAutoRunning] = useState(false);

  // Interface
  const [showChecklist, setShowChecklist] = useState(false);
  const [checklist, setChecklist] = useState({ loto: false, tensao: false, apr: false });
  const [isSigning, setIsSigning] = useState(null);
  const [heartbeat, setHeartbeat] = useState(false);

  // ==========================================
  // ÁUDIO E LOGS
  // ==========================================
  const playSound = useCallback((type) => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(type === 'alarm' ? 440 : 150, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    } catch (e) {}
  }, []);

  const addLog = (message, type = 'INFO') => {
    const time = new Date().toLocaleTimeString('pt-BR', { hour12: false });
    setLogs(prev => [{ time, message, type }, ...prev].slice(0, 15));
  };

  // ==========================================
  // SIMULAÇÃO E TELEMETRIA
  // ==========================================
  useEffect(() => {
    if (operacaoFinalizada) return;
    const interval = setInterval(() => {
      setHeartbeat(prev => !prev);
      
      const nextMtbf = Math.max(15, Math.min(100, mtbf + (Math.random() * 4 - 2.5)));
      const nextBacklog = Math.max(0, backlog + (Math.random() * 0.3 - 0.1));
      const nextEff = Math.max(70, Math.min(100, efficiency + (Math.random() * 2 - 1.1)));

      setMtbf(nextMtbf);
      setBacklog(nextBacklog);
      setEfficiency(nextEff);

      setHistoryData(prev => [...prev, { mtbf: nextMtbf, backlog: nextBacklog, time: Date.now() }].slice(-25));
    }, 2000);
    return () => clearInterval(interval);
  }, [mtbf, backlog, efficiency, operacaoFinalizada]);

  useEffect(() => {
    let next = 'NORMAL';
    if (mtbf < 30 || backlog > 7.5) next = 'CRITICAL';
    else if (mtbf < 55 || backlog > 6.0) next = 'WARNING';

    if (next !== systemStatus) {
      setSystemStatus(next);
      addLog(`ALERTA: Transição de estado para ${next}`, next);
      if (next !== 'NORMAL') {
        playSound('alarm');
        if (isAutoRunning) {
          setIsAutoRunning(false);
          setShowChecklist(true);
          addLog("IA interrompeu o modo automático: Verificação pendente", "WARNING");
        }
      }
    }
  }, [mtbf, backlog, systemStatus, playSound, isAutoRunning]);

  // ==========================================
  // LOOP DO MODO AUTOMÁTICO
  // ==========================================
  useEffect(() => {
    let interval;
    if (operationMode === 'AUTO' && isAutoRunning && systemStatus === 'NORMAL' && count > 0 && !operacaoFinalizada && !showChecklist) {
      interval = setInterval(() => {
        setCount(c => {
          if (c > 1) {
            addLog(`[AUTO] Passo ${c} concluído`, "INFO");
            return c - 1;
          } else {
            setOperacaoFinalizada(true);
            setIsAutoRunning(false);
            addLog("[AUTO] Sequência SCADA finalizada", "SUCCESS");
            return 0;
          }
        });
      }, 1500); 
    }
    return () => clearInterval(interval);
  }, [operationMode, isAutoRunning, systemStatus, count, operacaoFinalizada, showChecklist]);

  // ==========================================
  // HANDLERS E CONTROLES
  // ==========================================
  const handleValidate = () => {
    playSound('click');
    if (!operationMode) {
      addLog("Selecione o modo de operação antes de validar", "WARNING");
      return;
    }

    if (systemStatus !== 'NORMAL') {
      setShowChecklist(true);
      addLog("IA bloqueou ciclo: Verificação NR-10 pendente", "WARNING");
      if (isAutoRunning) setIsAutoRunning(false);
    } else {
      if (operationMode === 'MANUAL') {
        if (count > 1) {
          setCount(c => c - 1);
          addLog(`Passo ${count} validado pelo operador`, "SUCCESS");
        } else {
          setCount(0);
          setOperacaoFinalizada(true);
          addLog("Sequência SCADA finalizada", "SUCCESS");
        }
      } else if (operationMode === 'AUTO') {
        setIsAutoRunning(true);
        addLog("Processo automático iniciado", "INFO");
      }
    }
  };

  const handleReset = () => {
    playSound('click');
    setCount(10);
    setOperacaoFinalizada(false);
    setMtbf(94);
    setBacklog(1.2);
    setOperationMode(null);
    setIsAutoRunning(false);
    addLog("Sistema reiniciado. Aguardando seleção de modo.", "INFO");
  };

  const forceWarning = () => { playSound('click'); setMtbf(52); setBacklog(6.5); addLog("Demo: Anomalia forçada no processo", "WARNING"); };
  const forceCritical = () => { playSound('alarm'); setMtbf(25); setBacklog(8.0); addLog("Demo: Falha crítica acionada", "CRITICAL"); };

  // ==========================================
  // COMPONENTES GRÁFICOS (SVGs Customizados)
  // ==========================================
  const TrendAreaChart = ({ data, stroke, fill }) => {
    if (data.length < 2) return null;
    const max = Math.max(...data) * 1.1;
    const min = Math.min(...data) * 0.9;
    const height = 40;
    
    // Calcula pontos da linha
    const points = data.map((v, i) => `${(i / (data.length - 1)) * 100},${height - ((v - min) / (max - min)) * height}`);
    const linePoints = points.join(' ');
    // Adiciona pontos para fechar o polígono (área inferior)
    const areaPoints = `${points.join(' ')} 100,${height} 0,${height}`;

    return (
      <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox={`0 0 100 ${height}`}>
        <polygon points={areaPoints} fill={fill} opacity="0.3" />
        <polyline points={linePoints} fill="none" stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
      </svg>
    );
  };

  const RadarChart = () => {
    const size = 110;
    const center = size / 2;
    const rMax = size / 2 - 15;
    const scores = [ mtbf / 100, Math.max(0, (10 - backlog) / 10), efficiency / 100, systemStatus === 'NORMAL' ? 0.9 : 0.4 ];
    
    const points = scores.map((s, i) => {
      const angle = (i * Math.PI * 2) / scores.length - Math.PI / 2;
      const r = s * rMax;
      return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
    }).join(' ');

    return (
      <svg width={size} height={size} className="overflow-visible">
        {/* Teia de aranha de fundo */}
        {[0.3, 0.6, 1].map((scale, i) => (
          <circle key={i} cx={center} cy={center} r={rMax * scale} fill="none" stroke="#cbd5e1" strokeWidth="1" strokeDasharray={i===2 ? "" : "2,2"} />
        ))}
        {/* Eixos cruzados */}
        <line x1={center} y1={15} x2={center} y2={size-15} stroke="#cbd5e1" strokeWidth="1" />
        <line x1={15} y1={center} x2={size-15} y2={center} stroke="#cbd5e1" strokeWidth="1" />
        
        {/* Polígono de dados */}
        <polygon points={points} fill="rgba(15,23,42,0.15)" stroke="#0f172a" strokeWidth="2" strokeLinejoin="round" />
        
        {/* Labels dos eixos */}
        <text x={center} y={8} fontSize="6" fontWeight="bold" textAnchor="middle" fill="#64748b">MTBF</text>
        <text x={size-2} y={center+2} fontSize="6" fontWeight="bold" textAnchor="start" fill="#64748b">OEE</text>
        <text x={center} y={size} fontSize="6" fontWeight="bold" textAnchor="middle" fill="#64748b">STAB</text>
        <text x={2} y={center+2} fontSize="6" fontWeight="bold" textAnchor="end" fill="#64748b">BKLG</text>
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-[#D3D3D3] font-sans text-black flex flex-col select-none p-2 md:p-4 overflow-hidden">
      
      {/* HEADER SCADA */}
      <header className="border-b-4 border-slate-800 pb-3 mb-4 flex justify-between items-end">
        <div className="flex items-center gap-4">
          <div className={`p-2 border-2 border-slate-800 bg-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] ${heartbeat ? 'scale-105' : ''} transition-transform`}>
            <Cpu size={28} className={heartbeat ? 'text-blue-600' : 'text-slate-800'} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none text-slate-900 drop-shadow-sm">Dashboard Eventos Críticos</h1>
            <p className="text-[10px] font-bold opacity-80 uppercase flex items-center gap-1 mt-1 text-slate-700">
              <Factory size={12} /> Unidade de Processo 04 | <User size={12} /> Operador: OP_2026
            </p>
          </div>
        </div>

        <div className="flex gap-4 items-end">
          <div className="hidden md:flex flex-col items-end text-[10px] font-bold opacity-40 uppercase text-slate-800">
            <span>Latência: 4ms</span>
            <span>Segurança: ISA-99 Compliant</span>
          </div>
          <div className={`px-4 py-2 border-2 border-slate-900 font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex items-center gap-2 transition-colors ${
            systemStatus === 'CRITICAL' ? 'bg-[#FF0000] text-white animate-pulse border-[#FF0000]' : 
            systemStatus === 'WARNING' ? 'bg-[#FFFF00] text-black border-[#FFFF00]' : 'bg-white text-slate-900'
          }`}>
            <ShieldAlert size={18} /> {systemStatus}
          </div>
        </div>
      </header>

      {/* NAVEGAÇÃO HIERÁRQUICA */}
      <nav className="flex gap-1 mb-4">
        {[
          { id: 'DASHBOARD', label: 'L1: Operação', icon: <Gauge size={16} /> },
          { id: 'SYNOPTIC', label: 'L2: Sinótico', icon: <LayoutPanelLeft size={16} /> },
          { id: 'TRENDS', label: 'L3: Tendências', icon: <TrendingUp size={16} /> },
          { id: 'AUDIT', label: 'L4: Auditoria', icon: <History size={16} /> }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => { playSound('click'); setActiveTab(tab.id); }}
            className={`px-4 py-2 border-2 border-slate-800 font-bold uppercase text-[10px] flex items-center gap-2 transition-all
              ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-none translate-x-1 translate-y-1' : 'bg-white text-slate-700 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:bg-slate-50'}
            `}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </nav>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">
        
        {/* ========================================== */}
        {/* COLUNA ESQUERDA (KPIs & LOGS)              */}
        {/* ========================================== */}
        <aside className="lg:col-span-3 flex flex-col gap-4">
          
          <section className="bg-white border-2 border-slate-800 p-4 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
            <h3 className="text-[10px] font-black uppercase mb-4 border-b border-slate-200 pb-1 flex justify-between text-slate-800">
              Métricas de Performance <span className="text-blue-600">OEE</span>
            </h3>
            
            <div className="space-y-4">
              <div className="bg-slate-50 p-2 border border-slate-200">
                <div className="flex justify-between text-[9px] font-bold uppercase text-slate-700">
                  <span>Confiabilidade (MTBF)</span>
                  <span className={mtbf < 55 ? 'text-red-600' : ''}>{mtbf.toFixed(1)}%</span>
                </div>
                <div className="h-2 w-full bg-slate-200 mt-1 border border-slate-300 overflow-hidden">
                  <div className={`h-full transition-all ${mtbf < 30 ? 'bg-red-600' : mtbf < 55 ? 'bg-yellow-400' : 'bg-slate-800'}`} style={{ width: `${mtbf}%` }} />
                </div>
              </div>

              <div className="bg-slate-50 p-2 border border-slate-200">
                <div className="flex justify-between text-[9px] font-bold uppercase text-slate-700">
                  <span>Eficiência Operacional</span>
                  <span>{efficiency.toFixed(1)}%</span>
                </div>
                <div className="h-8 mt-1 flex items-end gap-0.5">
                   <TrendAreaChart data={historyData.map(h => h.efficiency || 95)} stroke="#0f172a" fill="#94a3b8" />
                </div>
              </div>

              <div className="flex flex-col items-center pt-2 border-t border-slate-100">
                <RadarChart />
                <span className="text-[8px] font-black uppercase mt-1 opacity-50 text-slate-600">Health Signature</span>
              </div>
            </div>
          </section>

          <section className="bg-slate-900 text-slate-300 p-3 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex-1 min-h-[100px] flex flex-col border-2 border-slate-800">
            <div className="flex justify-between items-center mb-2 border-b border-slate-700 pb-1">
              <span className="text-[10px] font-black uppercase text-[#10b981]">Terminal de Logs</span>
              <ListFilter size={12} className="text-[#10b981]" />
            </div>
            <div className="flex-1 font-mono text-[9px] overflow-y-auto space-y-1 scrollbar-hide">
              {logs.map((log, i) => (
                <div key={i} className={`flex gap-2 p-1 ${log.type === 'CRITICAL' ? 'text-red-400 bg-red-950/30' : log.type === 'WARNING' ? 'text-yellow-300 bg-yellow-900/20' : ''}`}>
                  <span className="opacity-40 shrink-0">[{log.time}]</span>
                  <span>{log.message}</span>
                </div>
              ))}
            </div>
          </section>

          {/* SIMULAÇÃO */}
          <section className="bg-slate-200 border-2 border-slate-800 p-3 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] mt-auto">
            <h3 className="text-[9px] font-black uppercase mb-2 border-b border-slate-300 pb-1 flex justify-between items-center text-slate-700">
              Simulador de Telemetria <Settings size={12} />
            </h3>
            <div className="flex flex-col gap-2">
              <button 
                onClick={forceWarning}
                className="w-full bg-yellow-400 text-slate-900 border-2 border-slate-900 py-2 text-[9px] font-black uppercase hover:bg-yellow-500 active:translate-y-[2px] transition-all shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:shadow-none"
              >
                Forçar Anomalia [WARNING]
              </button>
              <button 
                onClick={forceCritical}
                className="w-full bg-red-600 text-white border-2 border-slate-900 py-2 text-[9px] font-black uppercase hover:bg-red-700 active:translate-y-[2px] transition-all shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:shadow-none"
              >
                Forçar Falha [CRITICAL]
              </button>
            </div>
          </section>

        </aside>

        {/* ========================================== */}
        {/* ÁREA CENTRAL DE VISUALIZAÇÃO               */}
        {/* ========================================== */}
        <section className="lg:col-span-9 bg-white border-2 border-slate-800 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] relative flex flex-col overflow-hidden">
          {/* Fundo estilo Blueprint/Grid suave */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          
          <div className="flex-1 p-6 overflow-hidden z-10">
            
            {/* L1: OPERAÇÃO (CAMADA DETERMINÍSTICA) */}
            {activeTab === 'DASHBOARD' && (
              <div className="h-full flex flex-col items-center justify-center animate-in fade-in duration-300">
                 
                 <div className="relative group">
                    <div className={`w-64 h-64 md:w-80 md:h-80 border-[20px] bg-white flex items-center justify-center transition-all duration-500 shadow-[8px_8px_0px_0px_rgba(15,23,42,0.9)]
                      ${systemStatus === 'CRITICAL' ? 'border-red-600' : systemStatus === 'WARNING' ? 'border-yellow-400' : 'border-slate-800'}
                    `}>
                      <span className={`text-[12rem] font-mono font-black tracking-tighter ${systemStatus === 'CRITICAL' ? 'text-red-600' : 'text-slate-900'}`}>
                        {operacaoFinalizada ? '00' : count.toString().padStart(2, '0')}
                      </span>
                    </div>
                    {/* Indicador Camada Cognitiva */}
                    <div className="absolute -top-5 -right-5 bg-slate-900 text-white px-4 py-2 text-[11px] font-black uppercase flex items-center gap-2 border-2 border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] rounded-sm tracking-wider transition-colors">
                      <Zap size={14} className={systemStatus !== 'NORMAL' ? 'text-red-400 animate-pulse' : 'text-blue-400'} /> 
                      Contador de Passos
                    </div>
                 </div>

                 <div className="mt-12 flex flex-col items-center gap-4 w-full">
                    
                    {/* SELETOR DE MODO (TANGÍVEL) */}
                    {!operacaoFinalizada && (
                      <div className="flex bg-slate-200 p-1 rounded-sm border border-slate-300 shadow-inner mb-2">
                        <button
                          onClick={() => { setOperationMode('MANUAL'); playSound('click'); }}
                          disabled={isAutoRunning}
                          className={`px-8 py-2 font-black uppercase text-xs transition-all rounded-sm
                            ${operationMode === 'MANUAL' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'}
                            ${isAutoRunning ? 'opacity-50 cursor-not-allowed' : ''}
                          `}
                        >
                          Modo Manual
                        </button>
                        <button
                          onClick={() => { setOperationMode('AUTO'); playSound('click'); }}
                          disabled={isAutoRunning}
                          className={`px-8 py-2 font-black uppercase text-xs transition-all rounded-sm
                            ${operationMode === 'AUTO' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'}
                            ${isAutoRunning ? 'opacity-50 cursor-not-allowed' : ''}
                          `}
                        >
                          Modo Automático
                        </button>
                      </div>
                    )}

                    {/* AÇÃO PRINCIPAL */}
                    {operacaoFinalizada ? (
                      <button 
                        onClick={handleReset}
                        className="w-full max-w-md py-6 border-4 border-slate-900 text-3xl font-black uppercase transition-all shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] active:shadow-none active:translate-x-2 active:translate-y-2 bg-white text-slate-900 hover:bg-slate-50"
                      >
                        Reiniciar Processo
                      </button>
                    ) : (
                      <button 
                        onClick={handleValidate}
                        disabled={showChecklist || operationMode === null || isAutoRunning}
                        className={`w-full max-w-md py-6 border-4 border-slate-900 text-2xl font-black uppercase transition-all shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] 
                          active:shadow-none active:translate-x-2 active:translate-y-2
                          ${(systemStatus === 'NORMAL' && operationMode !== null && !isAutoRunning) ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-slate-200 text-slate-500 cursor-not-allowed'}
                        `}
                      >
                        {operationMode === null ? 'SELECIONE O MODO' : isAutoRunning ? 'PROCESSANDO...' : operationMode === 'AUTO' ? 'INICIAR PROCESSO' : 'VALIDAR PASSO'}
                      </button>
                    )}
                    
                    <div className="flex gap-4 text-[9px] font-black uppercase opacity-60 mt-2 text-slate-700">
                      <span className="flex items-center gap-1"><ShieldCheck size={12} className="text-green-600"/> Biometria OK</span>
                      <span className="flex items-center gap-1"><PenTool size={12} className="text-blue-600"/> Assinatura Ativa</span>
                    </div>

                    <p className="text-[10px] md:text-xs font-bold text-slate-500 text-center max-w-xl mt-4 px-4 leading-relaxed">
                      Contagem regressiva industrial baseada na ISA-101 e indicadores PCM (MTBF). IA de supervisão cognitiva opera em paralelo ao CLP, garantindo consciência situacional e autoridade humana soberana.
                    </p>
                 </div>
              </div>
            )}

            {/* L2: SINÓTICO */}
            {activeTab === 'SYNOPTIC' && (
              <div className="h-full flex flex-col animate-in slide-in-from-bottom-4 duration-300">
                
                {/* Estilos dinâmicos para a animação da esteira */}
                <style>{`
                  @keyframes slide-right {
                    0% { left: 15%; opacity: 0; }
                    5% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { left: 80%; opacity: 0; }
                  }
                  .animate-box-1 { animation: slide-right 4s linear infinite; }
                  .animate-box-2 { animation: slide-right 4s linear infinite 2s; }
                  
                  @keyframes conveyor-texture {
                    0% { background-position: 0 0; }
                    100% { background-position: -40px 0; }
                  }
                  .animate-belt { animation: conveyor-texture 1s linear infinite; }
                  .paused { animation-play-state: paused !important; }
                `}</style>

                <h2 className="text-sm font-black uppercase mb-8 flex items-center gap-2 text-slate-800">
                  <Factory size={18} /> Sinótico da Planta: Esteira de Produção C-10
                </h2>
                
                <div className="flex-1 relative border-2 border-slate-400 bg-slate-50 border-dashed p-8 rounded-sm overflow-hidden">
                   {/* Fundo do Sinótico */}
                   <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                   
                   {/* Motoredutor Principal (Esquerda) */}
                   <div className="absolute top-[calc(50%+2rem)] left-16 md:left-28 -translate-x-1/2 flex flex-col items-center z-30">
                      <div className="w-3 h-4 bg-slate-800 shadow-sm"></div> {/* Eixo/Conexão Mecânica */}
                      <div className={`w-14 h-14 md:w-16 md:h-16 border-4 border-slate-800 rounded-full flex items-center justify-center bg-white shadow-md ${systemStatus !== 'CRITICAL' ? 'animate-spin' : ''}`} style={{ animationDuration: mtbf > 50 ? '3s' : '6s' }}>
                        <Settings size={28} className="text-slate-700" />
                      </div>
                      <span className="text-[10px] font-black uppercase bg-white px-2 py-1 border-2 border-slate-800 shadow-sm mt-2 whitespace-nowrap">Motoredutor 1</span>
                   </div>

                   {/* Motoredutor Auxiliar (Direita) */}
                   <div className="absolute top-[calc(50%+2rem)] right-16 md:right-28 translate-x-1/2 flex flex-col items-center z-30">
                      <div className="w-3 h-4 bg-slate-800 shadow-sm"></div> {/* Eixo/Conexão Mecânica */}
                      <div className={`w-14 h-14 md:w-16 md:h-16 border-4 border-slate-800 rounded-full flex items-center justify-center bg-white shadow-md ${systemStatus !== 'CRITICAL' ? 'animate-spin' : ''}`} style={{ animationDuration: mtbf > 50 ? '3s' : '6s' }}>
                        <Settings size={28} className="text-slate-700" />
                      </div>
                      <span className="text-[10px] font-black uppercase bg-white px-2 py-1 border-2 border-slate-800 shadow-sm mt-2 whitespace-nowrap">Motoredutor-2</span>
                   </div>

                   {/* Correia da Esteira */}
                   <div className={`absolute top-1/2 left-16 md:left-28 right-16 md:right-28 h-16 -translate-y-1/2 bg-slate-300 border-y-4 border-slate-800 z-10 ${systemStatus !== 'CRITICAL' ? 'animate-belt' : ''}`}
                        style={{ backgroundImage: 'linear-gradient(90deg, transparent 50%, #94a3b8 50%)', backgroundSize: '40px 100%' }}>
                   </div>

                   {/* Lotes/Produtos em Movimento */}
                   <div className={`absolute top-1/2 -translate-y-1/2 -mt-4 w-16 h-12 border-4 border-slate-900 z-20 shadow-[4px_4px_0_rgba(15,23,42,0.5)] animate-box-1 flex items-center justify-center font-black text-[10px]
                        ${systemStatus === 'CRITICAL' ? 'paused bg-red-600 text-white' : 'bg-blue-500 text-white'}`}
                        style={{ animationDuration: mtbf > 50 ? '4s' : '8s' }}>LOTE A</div>
                   
                   <div className={`absolute top-1/2 -translate-y-1/2 -mt-4 w-16 h-12 border-4 border-slate-900 z-20 shadow-[4px_4px_0_rgba(15,23,42,0.5)] animate-box-2 flex items-center justify-center font-black text-[10px]
                        ${systemStatus === 'CRITICAL' ? 'paused bg-red-600 text-white' : 'bg-blue-500 text-white'}`}
                        style={{ animationDuration: mtbf > 50 ? '4s' : '8s' }}>LOTE B</div>

                   {/* Scanner / Sensor de Qualidade Central */}
                   <div className="absolute top-[10%] md:top-[15%] left-1/2 -translate-x-1/2 flex flex-col items-center z-30">
                      <div className={`w-32 h-12 border-4 border-slate-900 flex flex-col items-center justify-center shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] relative transition-colors ${systemStatus === 'CRITICAL' ? 'bg-red-600' : 'bg-slate-800'}`}>
                         <div className={`absolute -bottom-3 w-4 h-4 border-2 border-slate-900 rounded-full ${systemStatus === 'CRITICAL' ? 'bg-white shadow-[0_0_15px_#ef4444]' : 'bg-[#3b82f6] animate-pulse shadow-[0_0_10px_#60a5fa]'}`}></div>
                         <span className="text-[10px] font-black text-white uppercase tracking-widest mt-1">Scanner Visão</span>
                      </div>
                      <div className="w-4 h-12 md:h-16 bg-slate-700 border-x-4 border-slate-900"></div>
                   </div>
                </div>
              </div>
            )}

            {/* L3: TENDÊNCIAS */}
            {activeTab === 'TRENDS' && (
              <div className="h-full flex flex-col gap-4 animate-in fade-in duration-300">
                <h2 className="text-sm font-black uppercase flex items-center gap-2 text-slate-800"><TrendingUp size={18} /> Tendências Históricas (Real-time Buffer)</h2>
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border-2 border-slate-800 p-4 bg-slate-50 flex flex-col shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-black uppercase text-slate-600">MTBF Historian (Confiabilidade)</span>
                      <span className="font-mono text-sm font-bold bg-white px-2 py-0.5 border border-slate-300">{mtbf.toFixed(1)}%</span>
                    </div>
                    <div className="flex-1 bg-white border border-slate-300 p-2 overflow-hidden shadow-inner">
                       <TrendAreaChart data={historyData.map(h => h.mtbf)} stroke="#0f172a" fill="#94a3b8" />
                    </div>
                  </div>

                  <div className="border-2 border-slate-800 p-4 bg-slate-50 flex flex-col shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-black uppercase text-slate-600">Fila de Trabalho (Backlog Weeks)</span>
                      <span className="font-mono text-sm font-bold bg-white px-2 py-0.5 border border-slate-300">{backlog.toFixed(2)}</span>
                    </div>
                    <div className="flex-1 bg-white border border-slate-300 p-2 overflow-hidden shadow-inner">
                       <TrendAreaChart data={historyData.map(h => h.backlog)} stroke="#2563eb" fill="#bfdbfe" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* L4: AUDITORIA */}
            {activeTab === 'AUDIT' && (
              <div className="h-full flex flex-col animate-in fade-in duration-300">
                <h2 className="text-sm font-black uppercase mb-4 flex items-center gap-2 text-slate-800"><History size={18} /> Histórico de Eventos e Auditoria (ISA-99)</h2>
                <div className="flex-1 border-2 border-slate-800 bg-white overflow-y-auto shadow-inner">
                  <table className="w-full text-[10px] font-mono border-collapse">
                    <thead className="sticky top-0 bg-slate-900 text-white uppercase">
                      <tr>
                        <th className="p-3 text-left border-b-2 border-slate-950">Horário</th>
                        <th className="p-3 text-left border-b-2 border-slate-950">Evento / Ação</th>
                        <th className="p-3 text-center border-b-2 border-slate-950">Nível</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map((log, i) => (
                        <tr key={i} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                          <td className="p-3 text-slate-500">{log.time}</td>
                          <td className="p-3 font-bold uppercase text-slate-800">{log.message}</td>
                          <td className={`p-3 text-center font-black ${
                            log.type === 'CRITICAL' ? 'text-red-600' : log.type === 'WARNING' ? 'text-yellow-600' : 'text-green-600'
                          }`}>{log.type}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>

          <footer className="border-t-2 border-slate-800 p-3 bg-slate-200 flex justify-between items-center text-[9px] font-black uppercase z-10">
             <div className="flex gap-6 text-slate-700">
                <span className="flex items-center gap-1"><Database size={12}/> Redundância: Hot-Standby</span>
                <span className="flex items-center gap-1"><Zap size={12}/> Amostragem: 10Hz</span>
             </div>
             <div className="flex gap-4">
                <span className="opacity-50 text-slate-800">ISA-101 | HPA Standard</span>
             </div>
          </footer>
        </section>
      </main>

      {/* ========================================== */}
      {/* MODAL NR-10: INTERTRAVAMENTO DA IA         */}
      {/* ========================================== */}
      {showChecklist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-slate-100 border-8 border-slate-900 w-full max-w-xl shadow-[20px_20px_0px_0px_rgba(0,0,0,0.5)] overflow-hidden">
            
            <header className={`p-6 border-b-4 border-slate-900 flex items-center gap-4 ${systemStatus === 'CRITICAL' ? 'bg-red-600 text-white' : 'bg-yellow-400 text-slate-900'}`}>
              <ShieldAlert size={48} />
              <div>
                <h2 className="text-2xl font-black uppercase leading-none">Intervenção de Campo Requerida</h2>
                <p className="text-[10px] font-bold uppercase opacity-90 mt-1 tracking-widest">Protocolo de Segurança NR-10 Ativo</p>
              </div>
            </header>

            <div className="p-8 space-y-4">
              <div className="bg-white border-2 border-slate-300 p-4 flex gap-4 italic text-xs font-bold text-slate-600 shadow-sm">
                 <PenTool size={32} className="flex-shrink-0 opacity-40 text-slate-800" />
                 <p>A IA decidiu suspender o processo determinístico. É necessário input consciente e validação física dos itens da Norma Regulamentadora 10 antes da máquina prosseguir.</p>
              </div>

              {['loto', 'tensao', 'apr'].map(id => (
                <button 
                  key={id}
                  onClick={() => {
                    playSound('click');
                    setIsSigning(id);
                    setTimeout(() => { setChecklist(prev => ({ ...prev, [id]: !prev[id] })); setIsSigning(null); }, 400);
                  }}
                  className={`w-full p-5 border-2 border-slate-900 flex items-center gap-4 transition-all shadow-sm
                    ${checklist[id] ? 'bg-slate-900 text-white' : 'bg-white hover:bg-slate-50 text-slate-800'}
                    ${isSigning === id ? 'scale-95 opacity-80 border-dashed' : ''}
                  `}
                >
                  {checklist[id] ? <CheckSquare size={30} /> : <Square size={30} />}
                  <span className="font-black uppercase tracking-wide text-sm flex-1 text-left">
                    {id === 'loto' && 'Verificar Bloqueio LOTO (Eletro-Mecânico)'}
                    {id === 'tensao' && 'Confirmar Ausência de Tensão Residual'}
                    {id === 'apr' && 'Assinar APR de Retomada Industrial'}
                  </span>
                  {isSigning === id && <div className="w-5 h-5 border-2 border-current border-t-transparent animate-spin rounded-full" />}
                </button>
              ))}
            </div>

            <footer className="p-6 bg-slate-300 border-t-4 border-slate-900 flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="text-[9px] font-bold text-slate-600 uppercase max-w-[200px] leading-tight">
                A responsabilidade jurídica da retomada é atribuída ao Operador OP_2026.
              </div>
              <button 
                onClick={() => {
                  if (Object.values(checklist).every(v => v)) {
                    addLog("Intervenção manual concluída. Soberania aplicada.", "SUCCESS");
                    setMtbf(95); setBacklog(0.8); setShowChecklist(false);
                    setChecklist({ loto: false, tensao: false, apr: false });
                    
                    if (operationMode === 'MANUAL' && count > 0) {
                      setCount(c => c - 1);
                    }
                    setIsAutoRunning(false); 
                  }
                }}
                disabled={!Object.values(checklist).every(v => v)}
                className={`px-10 py-5 border-4 border-slate-900 text-xl font-black uppercase shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all
                  ${Object.values(checklist).every(v => v) ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-slate-400 text-slate-500 cursor-not-allowed border-slate-400 shadow-none'}
                `}
              >
                Confirmar e Retomar
              </button>
            </footer>
          </div>
        </div>
      )}

    </div>
  );
}
