import { useEffect, useRef, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:7000";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hai, saya CORA. Saya bisa membantu menjawab pertanyaan terkait layanan cloud dan rekomendasi CORA. Silakan mulai bertanya 🙂",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // otomatis scroll ke bawah setiap ada pesan baru
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input.trim() };
    const newHistory = [...messages, userMessage];

    // tampilkan dulu pesan user
    setMessages(newHistory);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          history: newHistory.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "HTTP error");
      }

      const data = await res.json();
      const reply = data.reply || "Maaf, saya tidak mendapatkan balasan dari server.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: reply,
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Maaf, terjadi kesalahan saat menghubungi server chatbot. Coba lagi beberapa saat.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-col h-[600px] bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-sky-600 px-4 py-3 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-xl">
              ☁️
            </div>
            <div>
              <div className="text-sm font-semibold">CORA Chatbot</div>
              <div className="text-xs text-white/80">
                Asisten Rekomendasi Layanan Cloud
              </div>
            </div>
          </div>
          <span className="text-[11px] bg-white/15 px-2 py-1 rounded-full">
            Online
          </span>
        </div>

        {/* Chat area */}
        <div className="flex-1 bg-slate-50 px-3 py-3 overflow-y-auto space-y-2">
          {messages.map((m, idx) => {
            const isUser = m.role === "user";
            return (
              <div
                key={idx}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div className="max-w-[80%]">
                  <div
                    className={[
                      "px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-line",
                      isUser
                        ? "bg-slate-200 text-slate-900 rounded-br-sm"
                        : "bg-sky-500 text-white rounded-bl-sm",
                    ].join(" ")}
                  >
                    {m.content}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {isUser ? "Anda" : "CORA"}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="text-xs text-slate-500 italic">
              CORA sedang mengetik...
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <form
          onSubmit={handleSend}
          className="border-t border-slate-200 bg-white px-3 py-2 flex items-center gap-2"
        >
          <input
            type="text"
            className="flex-1 text-sm px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
            placeholder="Tulis pertanyaan Anda di sini..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-2 text-sm rounded-xl bg-sky-600 text-white hover:bg-sky-700 disabled:bg-slate-300"
          >
            Kirim
          </button>
        </form>
      </div>
    </div>
  );
}