import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function App() {
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // ⚠️ 여기에 본인의 Gemini API 키를 넣으세요!
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

  const askAI = async () => {
    if (!question) return alert("고민을 입력해야 팩폭을 날리지!");
    setLoading(true);

    try {
      // 가장 안정적인 모델 설정
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

      const prompt = `
        너는 아주 냉철하고 유머러스한 결정 장애 치료사야. 
        사용자의 고민: "${question}"
        결정은 딱 두 글자(사라, 마라, 숏쳐, 롱쳐 등)로 하고, 이유는 한 문장으로 짧고 킹받게 답해.
        형식은 반드시 딱 이렇게만 해:
        결정: []
        이유: [한문장]
      `;

      const response = await model.generateContent(prompt);
      const aiResponse = response.response.text();
      
      // 혹시나 섞여 나올 별표 제거 및 줄바꿈 정리
      const cleanResponse = aiResponse.replace(/\*\*/g, "").trim();

      setResult({ 
        comment: cleanResponse,
        color: "bg-white" 
      });

    } catch (error) {
      console.error("에러 발생:", error);
      setResult({ 
        comment: "내 지능이 네 고민을 감당 못 하네. (키 확인해봐!)", 
        color: "bg-gray-200" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFDE4D] flex flex-col items-center justify-center p-6 font-mono text-black">
      {/* 메인 컨테이너 */}
      <div className="w-full max-w-md bg-white border-[4px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter">HAL-MAL</h1>
            <p className="text-xs font-bold bg-black text-white px-2 py-0.5 inline-block mt-1">
              AI DECIDER
            </p>
          </div>
          <div className="text-right text-[10px] font-black leading-none uppercase">
            {/* System: Online<br/>Status: Savage */}
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="relative">
            <label className="block text-sm font-black mb-2 uppercase">Your Stupid Worry:</label>
            <textarea 
              className="w-full h-32 p-4 border-[3px] border-black focus:outline-none focus:bg-yellow-50 text-lg font-bold resize-none placeholder:text-gray-400"
              placeholder="예: 지금 코인 풀매수 때릴까?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>
          
          <button 
            onClick={askAI}
            disabled={loading}
            className="w-full bg-[#FF4E4E] text-white font-black text-2xl py-5 border-[3px] border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all disabled:bg-gray-400"
          >
            {loading ? "기다려봐, 팩폭 장전 중..." : "AI의 계시 받기"}
          </button>
        </div>

        {/* 결과 섹션 */}
        {result && !loading && (
  <div className="mt-10 animate-in zoom-in duration-300">
    <div className="border-[4px] border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
      
      {/* 결정 (BIG BOX) */}
      <div className="bg-black text-white p-4 text-center">
        <span className="text-xs font-black tracking-[0.3em] uppercase opacity-70 block mb-1">The Decision</span>
        <h2 className="text-6xl font-black tracking-tighter italic">
          {result.comment.split('이유:')[0].replace('결정:', '').trim()}
        </h2>
      </div>

      {/* 이유 (Reason) */}
      <div className="p-6 border-t-[4px] border-black">
        <p className="text-lg font-bold leading-tight break-keep">
          <span className="text-red-500 mr-2">WHY?</span>
          {result.comment.split('이유:')[1]?.trim()}
        </p>
      </div>

      {/* 하단 액션 */}
      <div className="bg-gray-100 p-3 border-t-[2px] border-black flex justify-between items-center">
        {/* <span className="text-[10px] font-black opacity-50">SAVAGE MODE ACTIVE</span> */}
        <button 
          onClick={() => { setQuestion(''); setResult(null); }}
          className="text-xs font-black underline hover:text-red-500"
        >
          NEXT WORRY →
        </button>
      </div>
    </div>
  </div>
)}
      </div>

      <p className="mt-10 text-[10px] font-black text-black/40 uppercase tracking-[0.2em]">
        {/* Design by Neubrutalism Style */}
      </p>
    </div>
  );
}