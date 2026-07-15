"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronRight, Phone, MoreVertical, Send } from "lucide-react";

const CHAT_ROOMS = [
    { id:"C001", name:"Siti Rahayu",    task:"Bersih-Bersih Rumah", avatar:"SR", last:"Oke, saya segera ke sana", time:"5 mnt",  unread:2, online:true  },
    { id:"C002", name:"Budi Santoso",   task:"Antar ke Bandara",    avatar:"BS", last:"Berapa lama estimasinya?",  time:"12 mnt", unread:0, online:false },
    { id:"C003", name:"Dewi Anggraini", task:"Les Matematika SMA",  avatar:"DA", last:"Sampai ketemu besok ya!",   time:"1 jam",  unread:0, online:true  },
];

interface Message { id: number; from: "me" | "them"; text: string; time: string }
const INITIAL_MESSAGES: Message[] = [
    { id:1, from:"them", text:"Halo, saya Ahmad Fauzi yang akan mengerjakan bounty bersih-bersih kamu.", time:"14:02" },
    { id:2, from:"me",   text:"Halo! Oke bagus, jam 14:00 ya sesuai jadwal?",                            time:"14:03" },
    { id:3, from:"them", text:"Siap, saya sudah dalam perjalanan. ETA sekitar 10 menit.",                time:"14:05" },
    { id:4, from:"me",   text:"Oke, pintunya tidak dikunci ya.",                                         time:"14:06" },
];

export default function ViewChat() {
    const [activeRoom, setActiveRoom] = useState<string | null>(null);
    const [chatInput,  setChatInput]  = useState("");
    const [messages,   setMessages]   = useState<Message[]>(INITIAL_MESSAGES);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = () => {
        if (!chatInput.trim()) return;
        setMessages(p => [...p, {
            id: Date.now(), from: "me", text: chatInput.trim(),
            time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        }]);
        setChatInput("");
    };

    const activeRoomData = CHAT_ROOMS.find(r => r.id === activeRoom);

    // Room list
    if (!activeRoom) return (
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
            {CHAT_ROOMS.map(room => (
                <button key={room.id} onClick={() => setActiveRoom(room.id)}
                    className="w-full flex items-center gap-3 p-3.5 rounded-2xl border border-border/50 hover:border-blue-300 hover:bg-blue-50/30 bg-background transition-all text-left">
                    <div className="relative shrink-0">
                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">{room.avatar}</div>
                        {room.online && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-background" />}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-bold text-foreground">{room.name}</p>
                            <span className="text-[10px] text-muted-foreground">{room.time}</span>
                        </div>
                        <p className="text-[10px] text-blue-600 font-medium truncate">{room.task}</p>
                        <p className="text-[10px] text-muted-foreground truncate mt-0.5">{room.last}</p>
                    </div>
                    {room.unread > 0 && (
                        <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">{room.unread}</span>
                    )}
                </button>
            ))}
        </div>
    );

    // Active chat room
    if (!activeRoomData) return null;
    return (
        <div className="flex flex-col flex-1 overflow-hidden">
            {/* Room header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border/30 shrink-0 bg-blue-50/40">
                <button onClick={() => setActiveRoom(null)}
                    className="w-7 h-7 rounded-xl bg-background border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors shrink-0">
                    <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                </button>
                <div className="relative shrink-0">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">{activeRoomData.avatar}</div>
                    {activeRoomData.online && <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-background" />}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-foreground">{activeRoomData.name}</p>
                    <p className="text-[10px] text-blue-600 font-medium truncate">{activeRoomData.task}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                    <button className="w-7 h-7 rounded-xl hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-blue-600 transition-colors"><Phone className="w-3.5 h-3.5" /></button>
                    <button className="w-7 h-7 rounded-xl hover:bg-muted flex items-center justify-center text-muted-foreground transition-colors"><MoreVertical className="w-3.5 h-3.5" /></button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl ${msg.from === "me" ? "bg-blue-600 text-white rounded-br-md" : "bg-muted/60 text-foreground rounded-bl-md border border-border/40"}`}>
                            <p className="text-xs leading-relaxed">{msg.text}</p>
                            <p className={`text-[9px] mt-1 ${msg.from === "me" ? "opacity-70 text-right" : "text-muted-foreground"}`}>{msg.time}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="shrink-0 px-4 py-3 border-t border-border/30 bg-background">
                <div className="flex items-center gap-2 bg-muted/50 border border-border/50 rounded-2xl px-3.5 py-2 focus-within:border-blue-400 transition-all">
                    <input value={chatInput} onChange={e => setChatInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && sendMessage()}
                        placeholder="Ketik pesan..."
                        className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none" />
                    <button onClick={sendMessage} disabled={!chatInput.trim()}
                        className="w-7 h-7 rounded-xl bg-blue-600 disabled:opacity-40 text-white flex items-center justify-center hover:bg-blue-700 transition-colors shrink-0">
                        <Send className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
