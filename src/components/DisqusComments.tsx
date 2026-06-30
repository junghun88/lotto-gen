import React, { useEffect } from "react";
import { MessageSquare } from "lucide-react";

export function DisqusComments() {
  useEffect(() => {
    // Define disqus_config on the window object
    (window as any).disqus_config = function (this: any) {
      this.page.url = window.location.href;
      this.page.identifier = "lotto-gen-1-home";
    };

    // Check if DISQUS is already loaded
    if ((window as any).DISQUS) {
      try {
        (window as any).DISQUS.reset({
          reload: true,
          config: function (this: any) {
            this.page.url = window.location.href;
            this.page.identifier = "lotto-gen-1-home";
          }
        });
      } catch (err) {
        console.error("Disqus reset error:", err);
      }
    } else {
      const d = document;
      const s = d.createElement("script");
      s.src = "https://lotto-gen-1.disqus.com/embed.js";
      s.setAttribute("data-timestamp", (+new Date()).toString());
      (d.head || d.body).appendChild(s);
    }
  }, []);

  return (
    <section className="mt-8 bg-slate-900/60 border border-slate-800/90 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-500/5 to-transparent blur-2xl pointer-events-none" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-amber-400" />
            자유 토론 및 응원 댓글
          </h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            분석법에 대한 의견을 나누거나 1등 당첨 기원 응원 메시지를 작성해 보세요!
          </p>
        </div>
        <div className="text-xs text-amber-400/80 bg-amber-400/5 border border-amber-400/10 px-3 py-1.5 rounded-lg flex items-center gap-1.5 self-start md:self-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          실시간 소통 커뮤니티
        </div>
      </div>

      <div id="disqus_thread" className="min-h-[300px] text-slate-300" />
      <noscript>
        <div className="text-center py-8 text-xs text-slate-500">
          Disqus 댓글을 확인하려면 자바스크립트를 활성화해 주세요.{" "}
          <a href="https://disqus.com/?ref_noscript" className="text-amber-400 underline">
            comments powered by Disqus.
          </a>
        </div>
      </noscript>
    </section>
  );
}
