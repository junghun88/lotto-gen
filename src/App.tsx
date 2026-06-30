/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Copy, 
  Bookmark, 
  Trash2, 
  Moon, 
  Calendar, 
  Info, 
  Dices, 
  TrendingUp,
  Sliders,
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  FileText,
  Activity,
  Mail,
  Send
} from "lucide-react";
import { 
  DREAM_DICTIONARY, 
  ZODIAC_SIGNS, 
  getBallColorClass, 
  generateBalancedNumbers, 
  generateNumbersFromDreamText, 
  generateDestinyNumbers,
  generateHistoricalFirstPlacePatternNumbers,
  generatePatternReport,
  AdvancedLottoReport,
  HISTORICAL_HOT_NUMBERS,
  HISTORICAL_COLD_NUMBERS
} from "./utils/lotto";
import { DisqusComments } from "./components/DisqusComments";

interface SavedTicket {
  id: string;
  numbers: number[];
  mode: string;
  timestamp: string;
  ratingGrade: string;
  score: number;
}

export default function App() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<"ai_historical" | "dream" | "destiny" | "machine">("ai_historical");

  // State for current generated numbers
  const [currentNumbers, setCurrentNumbers] = useState<number[]>([1, 12, 23, 25, 34, 41]);
  
  // Advanced report state
  const [report, setReport] = useState<AdvancedLottoReport>(() => generatePatternReport([1, 12, 23, 25, 34, 41]));

  // AI Generation configuration states
  const [consecutiveMode, setConsecutiveMode] = useState<"auto" | "must" | "never">("auto");
  const [hotColdBalance, setHotColdBalance] = useState<"balanced" | "aggressive" | "stable">("balanced");
  const [sumConstraint, setSumConstraint] = useState<"optimal" | "wide">("optimal");

  // Saved tickets list (with localStorage persistence)
  const [savedTickets, setSavedTickets] = useState<SavedTicket[]>(() => {
    try {
      const saved = localStorage.getItem("lucky_lotto_tickets");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // State for Dream Decoder
  const [dreamInput, setDreamInput] = useState("");
  const [selectedDreamPreset, setSelectedDreamPreset] = useState<string | null>(null);

  // State for Destiny Birthdate & Zodiac
  const [birthdate, setBirthdate] = useState("1995-12-15");
  const [selectedZodiac, setSelectedZodiac] = useState(0); // Index of Zodiac animal

  // State for Virtual Lottery Machine
  const [machineBalls, setMachineBalls] = useState<number[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawProgress, setDrawProgress] = useState(0); // count of balls drawn so far

  // State for interactive UI elements
  const [isCopied, setIsCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Show detailed statistical help modal
  const [showHelpModal, setShowHelpModal] = useState(false);

  // State for partnership inquiries (Formspree)
  const [partnerName, setPartnerName] = useState("");
  const [partnerEmail, setPartnerEmail] = useState("");
  const [partnerPhone, setPartnerPhone] = useState("");
  const [partnerType, setPartnerType] = useState("business");
  const [partnerMessage, setPartnerMessage] = useState("");
  const [isSubmittingPartner, setIsSubmittingPartner] = useState(false);
  const [partnerSubmitSuccess, setPartnerSubmitSuccess] = useState<boolean | null>(null);

  // Persist saved tickets
  useEffect(() => {
    localStorage.setItem("lucky_lotto_tickets", JSON.stringify(savedTickets));
  }, [savedTickets]);

  // Recalculate statistical report whenever currentNumbers change
  useEffect(() => {
    setReport(generatePatternReport(currentNumbers));
  }, [currentNumbers]);

  // Trigger brief alert/toast message
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // 1. Generate via AI Historical Pattern Algorithm
  const handleGenerateAIHistorical = () => {
    const nums = generateHistoricalFirstPlacePatternNumbers({
      consecutiveMode,
      hotColdBalance,
      sumConstraint
    });
    setCurrentNumbers(nums);
    showToast("✨ 역대 1등 당첨 패턴 분석 및 필터링 완료!");
  };

  // 2. Generate via Dream text or preset
  const handleGenerateDream = (presetText?: string) => {
    const textToUse = presetText || dreamInput;
    if (!textToUse.trim()) {
      showToast("⚠️ 꿈의 내용이나 키워드를 입력해 주세요.");
      return;
    }
    const nums = generateNumbersFromDreamText(textToUse);
    setCurrentNumbers(nums);
    showToast(`🔮 꿈 키워드 '${textToUse}' 분석 행운 번호 완성!`);
  };

  // 3. Generate via Saju Birthdate / Zodiac
  const handleGenerateDestiny = () => {
    const nums = generateDestinyNumbers(birthdate, selectedZodiac);
    setCurrentNumbers(nums);
    showToast(`🍀 ${ZODIAC_SIGNS[selectedZodiac].name} 맞춤 사주 번호 추출 완료!`);
  };

  // 4. Interactive Draw Machine
  const startMachineDraw = () => {
    if (isDrawing) return;
    setIsDrawing(true);
    setMachineBalls([]);
    setDrawProgress(0);

    const fullPool = generateHistoricalFirstPlacePatternNumbers({
      consecutiveMode: "auto",
      hotColdBalance: "balanced",
      sumConstraint: "optimal"
    });
    let drawn: number[] = [];

    // Incrementally pull balls with beautiful delays
    const interval = setInterval(() => {
      if (drawn.length < 6) {
        const nextNum = fullPool[drawn.length];
        drawn.push(nextNum);
        setMachineBalls([...drawn]);
        setDrawProgress(drawn.length);
      } else {
        clearInterval(interval);
        // Sort and finalize numbers
        const sorted = [...drawn].sort((a, b) => a - b);
        setCurrentNumbers(sorted);
        setIsDrawing(false);
        showToast("🎟️ 실시간 가상 추첨 완료!");
      }
    }, 850);
  };

  // Save current combination
  const handleSaveTicket = () => {
    // Check if already saved
    const isAlreadySaved = savedTickets.some(
      t => JSON.stringify(t.numbers) === JSON.stringify(currentNumbers)
    );
    if (isAlreadySaved) {
      showToast("✨ 이미 저장된 조합입니다.");
      return;
    }

    let modeLabel = "패턴 추천";
    if (activeTab === "dream") modeLabel = `꿈해몽 (${selectedDreamPreset || dreamInput || "직접 입력"})`;
    else if (activeTab === "destiny") modeLabel = `사주 (${ZODIAC_SIGNS[selectedZodiac].name.split(" ")[0]})`;
    else if (activeTab === "machine") modeLabel = "실시간 추첨";

    const currentReport = generatePatternReport(currentNumbers);

    const newTicket: SavedTicket = {
      id: Math.random().toString(36).substr(2, 9),
      numbers: [...currentNumbers],
      mode: modeLabel,
      timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
      ratingGrade: currentReport.ratingGrade,
      score: currentReport.score
    };

    setSavedTickets([newTicket, ...savedTickets]);
    showToast("💾 보관함에 안전하게 저장되었습니다!");
  };

  // Delete individual saved ticket
  const handleDeleteTicket = (id: string) => {
    setSavedTickets(savedTickets.filter(t => t.id !== id));
    showToast("🗑️ 번호 조합이 보관함에서 삭제되었습니다.");
  };

  // Clear all saved tickets
  const handleClearAllTickets = () => {
    if (window.confirm("보관된 모든 번호 조합을 삭제하시겠습니까?")) {
      setSavedTickets([]);
      showToast("🗑️ 보관함이 완전히 비워졌습니다.");
    }
  };

  // Copy current numbers to clipboard
  const handleCopyToClipboard = (nums: number[]) => {
    const text = nums.join(", ");
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      showToast("📋 행운의 번호가 클립보드에 복사되었습니다!");
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  // Submit partnership form to Formspree
  const handlePartnerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!partnerName.trim() || !partnerEmail.trim() || !partnerMessage.trim()) {
      showToast("⚠️ 필수 입력 항목(* )을 모두 채워주세요.");
      return;
    }
    
    setIsSubmittingPartner(true);
    setPartnerSubmitSuccess(null);

    try {
      const response = await fetch("https://formspree.io/f/maqgdwjg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          name: partnerName,
          email: partnerEmail,
          phone: partnerPhone,
          type: partnerType,
          message: partnerMessage,
        }),
      });

      if (response.ok) {
        setPartnerSubmitSuccess(true);
        setPartnerName("");
        setPartnerEmail("");
        setPartnerPhone("");
        setPartnerType("business");
        setPartnerMessage("");
        showToast("✉️ 제휴 및 비즈니스 제안이 성공적으로 발송되었습니다!");
      } else {
        setPartnerSubmitSuccess(false);
        showToast("❌ 제안 전송에 실패했습니다. 다시 시도해 주세요.");
      }
    } catch (err) {
      console.error(err);
      setPartnerSubmitSuccess(false);
      showToast("❌ 네트워크 오류가 발생했습니다.");
    } finally {
      setIsSubmittingPartner(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-amber-500 selection:text-slate-900">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-amber-400 text-slate-950 px-5 py-3 rounded-xl shadow-xl border border-amber-300 font-medium text-sm"
          >
            <Sparkles className="w-4 h-4 animate-spin" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative top ambient light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[320px] bg-gradient-to-b from-amber-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* App Container */}
      <div className="relative max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Header */}
        <header className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-amber-400 text-xs font-semibold mb-3"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            1ST PLACE HISTORICAL ALGORITHM
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-100 bg-clip-text text-transparent"
          >
            로또 1등 당첨 패턴 연구소
          </motion.h1>
          
          <p className="mt-2 text-slate-400 text-sm max-w-2xl mx-auto leading-relaxed">
            무작위 번호 추출이 아닙니다. 역대 1등 실제 당첨번호들의 <strong>홀짝/고저 비율, 총합 평균값, 산술 복잡도(AC값), 연속 번호쌍의 빈도수</strong>를 분석 필터링하여 최적의 추천 조합을 추출합니다.
          </p>
        </header>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Generator controls (7 cols) */}
          <main className="lg:col-span-7 space-y-6">
            
            {/* Main Interactive Screen */}
            <section className="bg-slate-900/60 border border-slate-800/85 rounded-2xl p-6 shadow-2xl backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/10 to-transparent blur-xl pointer-events-none" />
              
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                  실시간 추천 조합
                </h2>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setShowHelpModal(true)}
                    className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800 transition-colors"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                    당첨 법칙 안내
                  </button>
                </div>
              </div>

              {/* Lotto Ball Display Deck */}
              <div className="min-h-[140px] flex items-center justify-center bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-8 mb-6 relative">
                
                {activeTab === "machine" && isDrawing ? (
                  // Spinning animation inside machine mode
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex flex-wrap justify-center gap-3">
                      {Array.from({ length: 6 }).map((_, idx) => {
                        const ballValue = machineBalls[idx];
                        return (
                          <motion.div
                            key={idx}
                            initial={{ scale: 0, rotate: -180 }}
                            animate={ballValue ? { scale: 1, rotate: 0 } : { scale: [0.9, 1.1, 0.9], rotate: [0, 10, -10, 0] }}
                            transition={ballValue ? { type: "spring", damping: 12 } : { repeat: Infinity, duration: 1.5 }}
                            className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold text-lg text-white shadow-lg ${
                              ballValue ? getBallColorClass(ballValue) : "bg-slate-900 border-dashed border-slate-700 text-slate-600 shadow-none"
                            }`}
                          >
                            {ballValue || "?"}
                          </motion.div>
                        );
                      })}
                    </div>
                    <p className="text-xs text-amber-400 animate-pulse font-medium">
                      최적 역학 회전하며 분석 중... ({drawProgress}/6)
                    </p>
                  </div>
                ) : (
                  // General generated balls displaying standard/fade animations
                  <div className="flex flex-wrap justify-center gap-3.5 sm:gap-4">
                    <AnimatePresence mode="popLayout">
                      {currentNumbers.map((num, idx) => (
                        <motion.div
                          key={`${num}-${idx}`}
                          initial={{ opacity: 0, scale: 0.3, y: 30 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          transition={{ 
                            type: "spring", 
                            stiffness: 260, 
                            damping: 20,
                            delay: idx * 0.08 
                          }}
                          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 flex items-center justify-center font-extrabold text-lg sm:text-xl text-white shadow-md relative overflow-hidden group ${getBallColorClass(num)}`}
                        >
                          {/* Glossy overlay */}
                          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/20 pointer-events-none" />
                          <div className="absolute top-1 left-2.5 w-3 h-1.5 bg-white/20 rounded-full blur-[0.5px]" />
                          
                          <span className="relative z-10 drop-shadow-md">{num}</span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Quick Actions for active deck */}
              <div className="flex items-center gap-2 justify-between">
                <div className="text-xs text-slate-500">
                  {report.ratingGrade === "S+" ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 shrink-0" /> S급 명품 조합 필터 통과
                    </span>
                  ) : report.ratingGrade === "A" ? (
                    <span className="text-amber-400/90 font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 shrink-0" /> A급 우수 조합 필터 통과
                    </span>
                  ) : (
                    <span className="text-slate-400 flex items-center gap-1">
                      일반 조합 필터 적용 상태
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyToClipboard(currentNumbers)}
                    disabled={isDrawing}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-300 bg-slate-800/80 border border-slate-700/60 hover:bg-slate-700 transition-colors disabled:opacity-50"
                    title="번호 복사"
                  >
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    복사하기
                  </button>
                  <button
                    onClick={handleSaveTicket}
                    disabled={isDrawing}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-amber-400 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-colors disabled:opacity-50"
                    title="조합 보관"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    보관하기
                  </button>
                </div>
              </div>
            </section>

            {/* Selection modes card */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              
              {/* Tab Navigation header */}
              <div className="grid grid-cols-4 border-b border-slate-800 bg-slate-950/40">
                <button
                  onClick={() => !isDrawing && setActiveTab("ai_historical")}
                  className={`py-3.5 px-2 text-center flex flex-col items-center gap-1.5 border-b-2 transition-all ${
                    activeTab === "ai_historical" 
                      ? "border-amber-400 text-amber-400 bg-slate-900/60" 
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                  disabled={isDrawing}
                >
                  <Activity className="w-4 h-4" />
                  <span className="text-xs sm:text-sm font-semibold">1등 패턴분석</span>
                </button>
                <button
                  onClick={() => !isDrawing && setActiveTab("dream")}
                  className={`py-3.5 px-2 text-center flex flex-col items-center gap-1.5 border-b-2 transition-all ${
                    activeTab === "dream" 
                      ? "border-amber-400 text-amber-400 bg-slate-900/60" 
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                  disabled={isDrawing}
                >
                  <Moon className="w-4 h-4" />
                  <span className="text-xs sm:text-sm font-semibold">꿈해몽 번호</span>
                </button>
                <button
                  onClick={() => !isDrawing && setActiveTab("destiny")}
                  className={`py-3.5 px-2 text-center flex flex-col items-center gap-1.5 border-b-2 transition-all ${
                    activeTab === "destiny" 
                      ? "border-amber-400 text-amber-400 bg-slate-900/60" 
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                  disabled={isDrawing}
                >
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs sm:text-sm font-semibold">사주명리학</span>
                </button>
                <button
                  onClick={() => !isDrawing && setActiveTab("machine")}
                  className={`py-3.5 px-2 text-center flex flex-col items-center gap-1.5 border-b-2 transition-all ${
                    activeTab === "machine" 
                      ? "border-amber-400 text-amber-400 bg-slate-900/60" 
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                  disabled={isDrawing}
                >
                  <Dices className="w-4 h-4" />
                  <span className="text-xs sm:text-sm font-semibold">가상추첨기</span>
                </button>
              </div>

              {/* Tab Contents */}
              <div className="p-6">
                
                {/* TAB 1: AI Historical Pattern Optimizer */}
                {activeTab === "ai_historical" && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="bg-amber-400/10 text-amber-400 text-[10px] px-2 py-0.5 rounded font-mono border border-amber-500/10">CORE ENGINE v2.1</span>
                        <h3 className="text-sm font-bold text-slate-200">역대 1등 당첨 통계 필터링 엔진</h3>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        실제 당첨 데이터에서 70% 이상의 빈도로 도출되는 가중치를 부여합니다. 연속성 제어, 빈출수 배분, AC 복잡성 필터 등 1등 당첨 패턴을 만족하는 조합을 찾아낼 때까지 고속 필터 시뮬레이션을 돌려 결과를 제시합니다.
                      </p>
                    </div>

                    {/* Options Panel */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-4">
                      <div className="flex items-center gap-1.5 text-xs text-amber-400/90 font-semibold border-b border-slate-800 pb-2">
                        <Sliders className="w-3.5 h-3.5" />
                        분석 필터 세부 커스터마이징
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        {/* 1. Consecutive numbers option */}
                        <div className="space-y-1.5">
                          <span className="text-slate-400 font-medium">연속 번호쌍 제어</span>
                          <div className="flex gap-1">
                            {(["auto", "must", "never"] as const).map((mode) => (
                              <button
                                key={mode}
                                onClick={() => setConsecutiveMode(mode)}
                                className={`flex-1 py-1.5 px-1 text-center rounded text-[10px] font-medium border transition-colors ${
                                  consecutiveMode === mode
                                    ? "bg-amber-400/10 border-amber-400 text-amber-300"
                                    : "bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300"
                                }`}
                              >
                                {mode === "auto" ? "자동 추천" : mode === "must" ? "필수 포함" : "완전 제외"}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* 2. Hot-Cold weight option */}
                        <div className="space-y-1.5">
                          <span className="text-slate-400 font-medium">빈출수(Hot)/희귀수(Cold) 배합</span>
                          <div className="flex gap-1">
                            {(["balanced", "aggressive", "stable"] as const).map((balance) => (
                              <button
                                key={balance}
                                onClick={() => setHotColdBalance(balance)}
                                className={`flex-1 py-1.5 px-1 text-center rounded text-[10px] font-medium border transition-colors ${
                                  hotColdBalance === balance
                                    ? "bg-amber-400/10 border-amber-400 text-amber-300"
                                    : "bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300"
                                }`}
                              >
                                {balance === "balanced" ? "균형 배분" : balance === "aggressive" ? "빈출 집중" : "동등 확률"}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* 3. Sum limitation range */}
                        <div className="space-y-1.5">
                          <span className="text-slate-400 font-medium">총합 제한 구간</span>
                          <div className="flex gap-1">
                            {(["optimal", "wide"] as const).map((sumOpt) => (
                              <button
                                key={sumOpt}
                                onClick={() => setSumConstraint(sumOpt)}
                                className={`flex-1 py-1.5 px-1 text-center rounded text-[10px] font-medium border transition-colors ${
                                  sumConstraint === sumOpt
                                    ? "bg-amber-400/10 border-amber-400 text-amber-300"
                                    : "bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300"
                                }`}
                              >
                                {sumOpt === "optimal" ? "최적 (110~170)" : "허용 (95~185)"}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleGenerateAIHistorical}
                      className="w-full py-4 px-4 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 active:scale-[0.99] text-slate-950 font-extrabold rounded-xl shadow-lg shadow-amber-500/10 transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      <Sparkles className="w-4 h-4" />
                      당첨 패턴 필터링 조합 생성하기
                    </button>
                  </motion.div>
                )}

                {/* TAB 2: Dream Interpreter */}
                {activeTab === "dream" && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-5"
                  >
                    <div>
                      <h3 className="text-sm font-semibold text-slate-200 mb-1">꿈해몽 번호 해독기</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        간밤에 꾸었던 특별한 꿈의 키워드를 분석해 보세요. 길몽으로 잘 알려진 핵심 키워드를 클릭하거나 꿈꾸신 단어를 직접 한글로 입력하시면 연관 해몽 수와 해시 알고리즘을 조합하여 강력한 에너지를 머금은 행운번호로 변환해 드립니다.
                      </p>
                    </div>

                    {/* Pre-defined dream keywords */}
                    <div className="space-y-2">
                      <span className="text-xs font-medium text-slate-400 block">자주 찾는 길몽 테마</span>
                      <div className="flex flex-wrap gap-1.5">
                        {DREAM_DICTIONARY.map((d, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setSelectedDreamPreset(d.keyword);
                              setDreamInput("");
                              handleGenerateDream(d.keyword);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                              selectedDreamPreset === d.keyword
                                ? "bg-amber-500/10 border-amber-500/50 text-amber-300"
                                : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                            }`}
                          >
                            {d.keyword.split(" ")[0]}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Direct Input */}
                    <div className="space-y-2.5">
                      <span className="text-xs font-medium text-slate-400 block">꿈 키워드 직접 쓰기</span>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={dreamInput}
                          onChange={(e) => {
                            setDreamInput(e.target.value);
                            setSelectedDreamPreset(null);
                          }}
                          placeholder="예: 돼지, 똥, 불이 활활 타는 꿈, 은가락지"
                          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors relative z-20 cursor-text caret-amber-400"
                        />
                        <button
                          onClick={() => handleGenerateDream()}
                          className="px-4 bg-slate-800 hover:bg-slate-700 active:scale-[0.98] border border-slate-700 text-slate-200 text-sm font-semibold rounded-xl transition-all"
                        >
                          해독
                        </button>
                      </div>
                    </div>

                    {/* Dream description box if preset matched */}
                    {selectedDreamPreset && (
                      <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex gap-3 items-start">
                        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div className="space-y-0.5">
                          <span className="text-xs font-semibold text-slate-300">
                            {selectedDreamPreset} 꿈풀이 정보
                          </span>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            {DREAM_DICTIONARY.find(d => d.keyword === selectedDreamPreset)?.meaning}
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* TAB 3: Destiny Numerology */}
                {activeTab === "destiny" && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-5"
                  >
                    <div>
                      <h3 className="text-sm font-semibold text-slate-200 mb-1">생년월일 사주 수리궁합</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        태어난 생일의 고유한 수리적 기운과 고유 띠에 깃든 오행의 수리 에너지를 산출하여 행운번호를 엮어냅니다. 생일과 해당하는 띠를 선택하고 우주 에너지의 흐름을 번호로 치환해 보세요.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-400 block">생년월일 입력</label>
                        <input
                          type="date"
                          value={birthdate}
                          onChange={(e) => setBirthdate(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500 transition-colors relative z-20 cursor-text caret-amber-400"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-400 block">본인의 띠 (Zodiac)</label>
                        <select
                          value={selectedZodiac}
                          onChange={(e) => setSelectedZodiac(Number(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500 transition-colors"
                        >
                          {ZODIAC_SIGNS.map((z, idx) => (
                            <option key={idx} value={idx}>
                              {z.animal} {z.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={handleGenerateDestiny}
                      className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 active:scale-[0.99] text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/10 transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      <Calendar className="w-4 h-4" />
                      사주 오행기운 행운 번호 산출하기
                    </button>
                  </motion.div>
                )}

                {/* TAB 4: Lottery Machine */}
                {activeTab === "machine" && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-5"
                  >
                    <div>
                      <h3 className="text-sm font-semibold text-slate-200 mb-1">실시간 로또 추첨 가상 머신</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        실제 로또 추첨 구슬 기계를 시뮬레이션합니다. 아래의 버튼을 누르면 가상의 45개 행운 구슬들이 마찰과 기류 속에 임의로 뒤섞이고, 정교한 통계 역학으로 완성된 최고의 행운 번호들이 순차적으로 번호판에 드랍됩니다.
                      </p>
                    </div>

                    <div className="border border-dashed border-slate-800 rounded-xl p-6 bg-slate-950/50 flex flex-col items-center justify-center relative overflow-hidden">
                      {/* Interactive visual sphere container */}
                      <div className="relative w-28 h-28 rounded-full border-4 border-slate-800 flex items-center justify-center bg-slate-950 shadow-inner overflow-hidden mb-4">
                        <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 via-transparent to-transparent" />
                        
                        {/* Shaking simulation inside the glass sphere */}
                        <div className="flex flex-wrap gap-1 justify-center max-w-[80%]">
                          {Array.from({ length: 12 }).map((_, i) => (
                            <motion.div
                              key={i}
                              animate={isDrawing ? {
                                x: [Math.random() * 20 - 10, Math.random() * 20 - 10, Math.random() * 20 - 10],
                                y: [Math.random() * 20 - 10, Math.random() * 20 - 10, Math.random() * 20 - 10],
                              } : {}}
                              transition={{
                                repeat: Infinity,
                                duration: 0.35,
                                ease: "linear"
                              }}
                              className={`w-3.5 h-3.5 rounded-full ${
                                i % 3 === 0 ? "bg-amber-400" : i % 3 === 1 ? "bg-blue-500" : "bg-red-500"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={startMachineDraw}
                        disabled={isDrawing}
                        className={`w-full py-3.5 px-4 font-bold rounded-xl active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm ${
                          isDrawing
                            ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                            : "bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 hover:from-amber-400 hover:to-yellow-400 shadow-lg shadow-amber-500/10"
                        }`}
                      >
                        <Dices className={`w-4 h-4 ${isDrawing ? "animate-spin" : ""}`} />
                        {isDrawing ? "추첨 기계 가동 중..." : "실시간 추첨 가동하기"}
                      </button>
                    </div>
                  </motion.div>
                )}

              </div>
            </section>

            {/* Lotto Reference Table */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-300">구간별 출현 분석판</span>
                <div className="flex gap-4 text-[10px] text-slate-500">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" />1-10</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" />11-20</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" />21-30</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-stone-500" />31-40</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" />41-45</span>
                </div>
              </div>
              <div className="grid grid-cols-9 gap-1.5 max-w-lg mx-auto">
                {Array.from({ length: 45 }).map((_, idx) => {
                  const num = idx + 1;
                  const isHighlighted = currentNumbers.includes(num);
                  return (
                    <div
                      key={num}
                      className={`text-center py-1.5 rounded-md text-[11px] font-bold border transition-all ${
                        isHighlighted
                          ? `${getBallColorClass(num)} border-transparent text-white scale-105 shadow-md`
                          : "bg-slate-950/60 border-slate-800 text-slate-600"
                      }`}
                    >
                      {num}
                    </div>
                  );
                })}
              </div>
            </section>

          </main>

          {/* RIGHT: Stats & Saved combinations (5 cols) */}
          <aside className="lg:col-span-5 space-y-6">
            
            {/* STATS ANALYZER */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-sm font-bold text-slate-200">조합 정밀 분석 리포트</h3>
                <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  실시간 역학 연산
                </span>
              </div>

              {/* Luck percentage score and Grade card */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-emerald-500/10 to-transparent pointer-events-none" />
                
                <div className="flex items-center gap-5">
                  <div className="relative w-16 h-16 shrink-0 flex items-center justify-center bg-slate-900 rounded-xl border border-slate-800">
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-semibold">GRADE</span>
                      <span className={`text-2xl font-extrabold ${
                        report.ratingGrade === "S+" ? "text-emerald-400 animate-pulse" : report.ratingGrade === "A" ? "text-amber-400" : "text-blue-400"
                      }`}>
                        {report.ratingGrade}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">종합 당첨 지수: {report.score}점</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                      {report.ratingGrade === "S+" 
                        ? "최상의 1등 통계 요건을 모두 만족합니다. 역대 1등 번호들의 수학적 구조와 동일합니다."
                        : report.ratingGrade === "A" 
                          ? "매우 조화롭고 뛰어난 밸런스의 조합입니다. 안정적인 배분이 돋보입니다."
                          : "특징이 강한 개성적 조합입니다. 의외의 구역 변칙수를 정밀히 반영했습니다."}
                    </p>
                  </div>
                </div>
              </div>

              {/* STATS DETAILS FEEDBACK LIST */}
              <div className="space-y-3.5">
                
                {/* 1. Sum feedback */}
                <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-800/80 flex gap-2.5 items-start">
                  <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                    report.sumStatus === "good" ? "bg-emerald-400" : report.sumStatus === "warning" ? "bg-amber-400" : "text-red-400"
                  }`} />
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 justify-between w-full">
                      <span className="text-xs font-semibold text-slate-300">총합 분석 (Sum: {report.sum})</span>
                      <span className={`text-[10px] ${report.sumStatus === "good" ? "text-emerald-400" : "text-amber-400"}`}>
                        {report.sumStatus === "good" ? "최적구간" : "허용범위"}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-normal">{report.sumDescription}</p>
                  </div>
                </div>

                {/* 2. Odd : Even feedback */}
                <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-800/80 flex gap-2.5 items-start">
                  <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                    report.oddEvenStatus === "good" ? "bg-emerald-400" : "bg-red-400"
                  }`} />
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 justify-between w-full">
                      <span className="text-xs font-semibold text-slate-300">홀짝 배분 (Odd:Even {report.oddEvenRatio})</span>
                      <span className={`text-[10px] ${report.oddEvenStatus === "good" ? "text-emerald-400" : "text-red-400"}`}>
                        {report.oddEvenStatus === "good" ? "정상" : "경고"}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-normal">{report.oddEvenDescription}</p>
                  </div>
                </div>

                {/* 3. High : Low feedback */}
                <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-800/80 flex gap-2.5 items-start">
                  <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                    report.highLowStatus === "good" ? "bg-emerald-400" : "bg-red-400"
                  }`} />
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 justify-between w-full">
                      <span className="text-xs font-semibold text-slate-300">고저 비율 (High:Low {report.highLowRatio})</span>
                      <span className={`text-[10px] ${report.highLowStatus === "good" ? "text-emerald-400" : "text-red-400"}`}>
                        {report.highLowStatus === "good" ? "정상" : "경고"}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-normal">{report.highLowDescription}</p>
                  </div>
                </div>

                {/* 4. AC value feedback */}
                <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-800/80 flex gap-2.5 items-start">
                  <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                    report.acStatus === "good" ? "bg-emerald-400" : "bg-red-400"
                  }`} />
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 justify-between w-full">
                      <span className="text-xs font-semibold text-slate-300">산술 복잡성 (AC값: {report.acValue})</span>
                      <span className={`text-[10px] ${report.acStatus === "good" ? "text-emerald-400" : "text-red-400"}`}>
                        {report.acStatus === "good" ? "적합" : "부적합"}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-normal">{report.acDescription}</p>
                  </div>
                </div>

                {/* 5. Consecutive pairs and Hot/Cold feedback */}
                <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-800/80 flex gap-2.5 items-start">
                  <div className="mt-0.5 w-2 h-2 rounded-full shrink-0 bg-blue-400" />
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-slate-300">연속 분포 & 빈출도</span>
                    <p className="text-[11px] text-slate-500 leading-normal mb-1">{report.consecutiveDescription}</p>
                    <p className="text-[11px] text-slate-500 leading-normal">{report.hotColdDescription}</p>
                  </div>
                </div>

              </div>
            </section>

            {/* MY SAVED TICKETS */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                  <Bookmark className="w-4 h-4 text-amber-400" />
                  나만의 번호 보관함
                  <span className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-400 rounded-full font-mono font-bold">
                    {savedTickets.length}
                  </span>
                </h3>
                {savedTickets.length > 0 && (
                  <button
                    onClick={handleClearAllTickets}
                    className="text-[10px] text-slate-500 hover:text-red-400 transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    전체삭제
                  </button>
                )}
              </div>

              {savedTickets.length === 0 ? (
                <div className="py-12 border border-dashed border-slate-800 rounded-xl bg-slate-950/30 flex flex-col items-center justify-center text-center">
                  <Bookmark className="w-8 h-8 text-slate-700 mb-2" />
                  <span className="text-xs text-slate-500 block">보관된 행운 조합이 아직 없습니다.</span>
                  <span className="text-[10px] text-slate-600 mt-1 max-w-[200px]">마음에 드는 조합이 나오면 보관하기 단추를 눌러 기록해보세요.</span>
                </div>
              ) : (
                <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                  <AnimatePresence initial={false}>
                    {savedTickets.map((ticket) => (
                      <motion.div
                        key={ticket.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 hover:border-slate-700 transition-all group relative flex flex-col gap-2.5"
                      >
                        {/* Header of individual card */}
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-slate-400 font-semibold bg-slate-900 px-2 py-0.5 rounded border border-slate-800/80">
                            {ticket.mode}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-emerald-400 font-bold">Grade {ticket.ratingGrade}</span>
                            <span className="text-slate-600 font-mono">
                              {ticket.timestamp}
                            </span>
                          </div>
                        </div>

                        {/* Balls */}
                        <div className="flex gap-1.5 items-center">
                          {ticket.numbers.map((num, i) => (
                            <span
                              key={i}
                              className={`w-7 h-7 rounded-full text-[11px] font-extrabold text-white flex items-center justify-center shadow ${getBallColorClass(num)}`}
                            >
                              {num}
                            </span>
                          ))}
                        </div>

                        {/* Interactive utilities */}
                        <div className="flex items-center gap-1.5 self-end opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setCurrentNumbers([...ticket.numbers]);
                              showToast("🔮 선택한 번호 조합을 분석판에 로드했습니다.");
                            }}
                            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded text-xs"
                            title="분석판에 불러오기"
                          >
                            열기
                          </button>
                          <button
                            onClick={() => handleCopyToClipboard(ticket.numbers)}
                            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-amber-400 rounded"
                            title="번호 복사"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteTicket(ticket.id)}
                            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-red-400 rounded"
                            title="삭제"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </section>

          </aside>

        </div>

        {/* Partnership / Contact Form */}
        <section className="mt-8 bg-slate-900/60 border border-slate-800/90 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-500/5 to-transparent blur-2xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Mail className="w-5 h-5 text-amber-400" />
                제휴 및 비즈니스 문의
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                로또 1등 당첨 패턴 연구소와의 광고 제휴, 데이터 연동, 공동 비즈니스 협업 제안을 환영합니다.
              </p>
            </div>
            <div className="text-xs text-amber-400/80 bg-amber-400/5 border border-amber-400/10 px-3 py-1.5 rounded-lg flex items-center gap-1.5 self-start md:self-auto">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              신속 검토 및 답변
            </div>
          </div>

          <form onSubmit={handlePartnerSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                  성함 / 기업명 <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  placeholder="예: 홍길동 또는 (주)행운컴퍼니"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors relative z-20 cursor-text caret-amber-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                  이메일 주소 <span className="text-amber-400">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={partnerEmail}
                  onChange={(e) => setPartnerEmail(e.target.value)}
                  placeholder="예: contact@domain.com"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors relative z-20 cursor-text caret-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  연락처 (선택)
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={partnerPhone}
                  onChange={(e) => setPartnerPhone(e.target.value)}
                  placeholder="예: 010-1234-5678"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors relative z-20 cursor-text caret-amber-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  문의 / 제휴 유형
                </label>
                <select
                  name="type"
                  value={partnerType}
                  onChange={(e) => setPartnerType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500 transition-colors"
                >
                  <option value="business">광고 및 제휴 마케팅</option>
                  <option value="api">로또 통계 API / 데이터 제휴</option>
                  <option value="tech">기술 제휴 및 솔루션 도입</option>
                  <option value="etc">기타 문의 및 제안</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                제안 및 문의 상세 내용 <span className="text-amber-400">*</span>
              </label>
              <textarea
                name="message"
                value={partnerMessage}
                onChange={(e) => setPartnerMessage(e.target.value)}
                placeholder="제안서 요약, 협업 형태 등 구체적인 상세 내용을 입력해 주세요."
                required
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors resize-none relative z-20 cursor-text caret-amber-400"
              />
            </div>

            {partnerSubmitSuccess === true && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex gap-3 items-center text-emerald-400 text-xs">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <div>
                  <span className="font-semibold block">제휴 문의 접수 완료!</span>
                  <span>작성하신 이메일로 담당자가 검토 후 빠른 시일 내 연락드리겠습니다.</span>
                </div>
              </div>
            )}

            {partnerSubmitSuccess === false && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex gap-3 items-center text-red-400 text-xs">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <div>
                  <span className="font-semibold block">전송 오류가 발생했습니다.</span>
                  <span>임시적인 문제일 수 있으니 이메일로 직접 제안을 전송하시거나 잠시 후 다시 이용해 주세요.</span>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-3 justify-end pt-2">
              <span className="text-[10px] text-slate-500">
                광고 차단 확장 프로그램이 활성화된 경우 전송이 실패할 수 있습니다.
              </span>
              <button
                type="submit"
                disabled={isSubmittingPartner}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 active:scale-[0.98] text-slate-950 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-xs disabled:opacity-50"
              >
                {isSubmittingPartner ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    제출하는 중...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    제휴 문의 보내기
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Disqus comments section */}
        <DisqusComments />

        {/* Footer info banner */}
        <footer className="mt-16 text-center text-[11px] text-slate-600 border-t border-slate-900 pt-6">
          <p>© {new Date().getFullYear()} Lucky Number Lab. 모든 추천 번호는 통계 분석 및 시뮬레이션 기반이며, 1등 당첨을 보장하지 않습니다.</p>
          <p className="mt-1 text-slate-700">과도한 복권 구매는 건강에 해로울 수 있으니 가벼운 행운 찾기 놀이로 즐겨주시기 바랍니다.</p>
        </footer>

      </div>

      {/* STATISTICAL LAWS MODAL */}
      <AnimatePresence>
        {showHelpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHelpModal(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            
            {/* Dialog Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative max-w-lg w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl z-10 overflow-hidden"
            >
              <h3 className="text-base font-bold text-slate-200 flex items-center gap-2 mb-4">
                <FileText className="w-4 h-4 text-amber-400" />
                로또 1등 당첨 통계 법칙 분석서
              </h3>
              
              <div className="space-y-4 text-xs text-slate-400 max-h-[380px] overflow-y-auto pr-1 leading-relaxed">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="font-semibold text-slate-200 block mb-1">💡 1. 총합 분포 법칙 (Sum Range)</span>
                  <span>로또 1등 번호 6개의 합은 거의 언제나 <strong>110에서 170 사이</strong>에 가장 빽빽하게 분포합니다. 이 범위를 벗어난 조합(예: 극단적으로 낮은 수들의 합 40 또는 높은 수들의 합 220)은 역사상 1등으로 뽑힐 확률이 극히 희박합니다.</span>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="font-semibold text-slate-200 block mb-1">💡 2. 홀수 대 짝수 비율 (Odd:Even Ratio)</span>
                  <span>홀짝의 분포는 <strong>3:3, 2:4, 4:2의 비율이 전체 당첨 횟수의 약 81% 이상</strong>을 차지합니다. 올홀수(6:0)나 올짝수(0:6) 조합은 실제 역사적 결과 상 거의 출현하지 않습니다.</span>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="font-semibold text-slate-200 block mb-1">💡 3. 연속 번호의 비밀 (Consecutive Pairs)</span>
                  <span><strong>1등 당첨번호 중 약 40~45%는 연속된 번호(예: 14와 15)를 1쌍 이상 무조건 포함</strong>하고 있습니다. 당 연구소 알고리즘은 연속 번호쌍의 최적 포함 여부를 자동으로 제어하여 자연스러운 구성을 돕습니다.</span>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="font-semibold text-slate-200 block mb-1">💡 4. 산술 복잡성 지수 (AC Value)</span>
                  <span>산술적 불규칙성을 뜻하는 AC값은 <strong>7 이상</strong>이 필수 요건입니다. 만약 2, 4, 6, 8, 10, 12 처럼 등차수열이나 명백한 수학적 규칙성을 띄는 번호 세트는 AC값이 매우 낮게 책정되어 통계상 1등 추천 대상에서 가차없이 배제됩니다.</span>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="font-semibold text-slate-200 block mb-1">💡 5. 뜨거운 수(Hot)와 차가운 수(Cold)</span>
                  <span>역대 가장 출현 빈도가 높은 수(43, 34 등)와 낮은 수(9, 22 등)를 조화롭게 믹스해야 합니다. 1등 번호 조합은 오직 뜨거운 수로만 가득 채워져 있거나 오직 차가운 수로만 이루어져 있지 않고, 1~3개 수준의 빈출수를 안정적으로 분배하고 있습니다.</span>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowHelpModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors"
                >
                  닫기
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
