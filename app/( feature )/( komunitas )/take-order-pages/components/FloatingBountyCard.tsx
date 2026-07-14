"use client";

import { useState, useRef, useEffect } from "react";
import { MapPin, Clock, Zap, Star, ChevronRight, CheckCircle2, TrendingUp, Filter, Send, Phone, MoreVertical } from "lucide-react";
import type { SidebarView } from "./IconSidebar";
import ViewAktif from "./ViewAktif";

const BOUNTIES = [
    { id:"B001",emoji:"🧹",layanan:"Bersih-Bersih",    tugas:"Sapu & Pel, Kamar Mandi, Dapur",    jarak:"0.8 km",jadwal:"Hari ini, 14:00",budget:85000, pesaing:2,rating:4.9},
    { id:"B002",emoji:"🚗",layanan:"Antar Jemput",     tugas:"Antar ke Bandara Soekarno-Hatta",   jarak:"2.1 km",jadwal:"Besok, 06:00",   budget:120000,pesaing:4,rating:4.7},
    { id:"B003",emoji:"🛍️",layanan:"Jasa Titip",       tugas:"Beli obat apotek + snack Indomaret",jarak:"1.4 km",jadwal:"Hari ini, 16:30",budget:30000, pesaing:1,rating:4.8},
    { id:"B004",emoji:"💻",layanan:"Bantuan Digital",  tugas:"Desain logo brand kopi — minimalis",jarak:"—",     jadwal:"Deadline 3 hari",budget:200000,pesaing:7,rating:5.0},
    { id:"B005",emoji:"📚",layanan:"Bimbingan Belajar",tugas:"Les matematika SMA — persiapan UN", jarak:"3.2 km",jadwal:"Sabtu, 09:00",   budget:150000,pesaing:3,rating:4.6},
];
const HISTORY=[
    {emoji:"🧹",tugas:"Bersih-Bersih Rumah",waktu:"2 jam lalu", nominal:85000, done:true },
    {emoji:"🚗",tugas:"Antar ke Kantor",     waktu:"Kemarin",    nominal:65000, done:true },
    {emoji:"🛍️",tugas:"Jasa Titip Makanan",  waktu:"2 hari lalu",nominal:25000, done:false},
    {emoji:"📚",tugas:"Les Matematika SMP",  waktu:"3 hari lalu",nominal:100000,done:true },
];
const CHAT_ROOMS=[
    {id:"C001",name:"Siti Rahayu",   task:"Bersih-Bersih Rumah",avatar:"SR",last:"Oke, saya segera ke sana",time:"5 mnt", unread:2,online:true },
    {id:"C002",name:"Budi Santoso",  task:"Antar ke Bandara",    avatar:"BS",last:"Berapa lama estimasinya?", time:"12 mnt",unread:0,online:false},
    {id:"C003",name:"Dewi Anggraini",task:"Les Matematika SMA",  avatar:"DA",last:"Sampai ketemu besok ya!",  time:"1 jam", unread:0,online:true },
];
interface Message{id:number;from:"me"|"them";text:string;time:string}
const SAMPLE_MESSAGES:Message[]=[
    {id:1,from:"them",text:"Halo, saya Ahmad Fauzi yang akan mengerjakan bounty bersih-bersih kamu.",time:"14:02"},
    {id:2,from:"me",  text:"Halo! Oke bagus, jam 14:00 ya sesuai jadwal?",                            time:"14:03"},
    {id:3,from:"them",text:"Siap, saya sudah dalam perjalanan. ETA sekitar 10 menit.",                time:"14:05"},
    {id:4,from:"me",  text:"Oke, pintunya tidak dikunci ya.",                                         time:"14:06"},
];
const TITLE_MAP:Record<SidebarView,string>={bounty:"Ambil Bounty",aktif:"Bounty Aktif",stats:"Statistik Saya",history:"Riwayat Tugas",chat:"Pesan"};
const WEEK_DATA=[2,5,3,7,4,6,3];
const DAYS=["S","S","R","K","J","S","M"];
const formatRupiah=(v:number)=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(v);

export default function FloatingBountyCard({view}:{view:SidebarView}){
    const [filter,setFilter]=useState("Semua");
    const [activeRoom,setActiveRoom]=useState<string|null>(null);
    const [chatInput,setChatInput]=useState("");
    const [messages,setMessages]=useState<Message[]>(SAMPLE_MESSAGES);
    const messagesEndRef=useRef<HTMLDivElement>(null);
    const FILTERS=["Semua","Terdekat","Tertinggi","Terbaru"];
    const maxWeek=Math.max(...WEEK_DATA);
    const filtered=filter==="Tertinggi"?[...BOUNTIES].sort((a,b)=>b.budget-a.budget):filter==="Terdekat"?[...BOUNTIES].sort((a,b)=>parseFloat(a.jarak)-parseFloat(b.jarak)):BOUNTIES;
    useEffect(()=>{messagesEndRef.current?.scrollIntoView({behavior:"smooth"});},[messages]);
    const sendMessage=()=>{if(!chatInput.trim())return;setMessages(p=>[...p,{id:Date.now(),from:"me",text:chatInput.trim(),time:new Date().toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit"})}]);setChatInput("");};
    const activeRoomData=CHAT_ROOMS.find(r=>r.id===activeRoom);

    return(
        <div className="absolute top-4 left-4 bottom-4 z-1000 w-[360px] flex flex-col rounded-3xl bg-background/96 backdrop-blur-xl shadow-2xl shadow-black/15 border border-border/30 overflow-hidden">
            <div className="px-5 pt-5 pb-4 border-b border-border/40 shrink-0 bg-background">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md shadow-blue-600/30">AF</div>
                        <div>
                            <p className="text-xs font-bold text-foreground leading-none">Ahmad Fauzi</p>
                            <div className="flex items-center gap-1 mt-0.5"><div className="w-1.5 h-1.5 rounded-full bg-green-400"/><span className="text-[10px] text-green-600 font-semibold">Online</span></div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-foreground">{TITLE_MAP[view]}</span>
                        {view==="bounty"&&<span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full">{BOUNTIES.length}</span>}
                        {view==="aktif" &&<span className="text-[10px] font-bold bg-green-500 text-white px-2 py-0.5 rounded-full">2</span>}
                        {view==="chat"  &&<span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full">{CHAT_ROOMS.filter(r=>r.unread>0).length}</span>}
                    </div>
                </div>
            </div>

            {view==="bounty"&&(
                <div className="flex flex-col flex-1 overflow-hidden">
                    <div className="flex gap-1.5 px-5 py-3 border-b border-border/30 shrink-0 items-center">
                        <Filter className="w-3.5 h-3.5 text-muted-foreground shrink-0"/>
                        <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
                            {FILTERS.map(f=><button key={f} onClick={()=>setFilter(f)} className={`shrink-0 text-[11px] font-semibold px-3 py-1 rounded-full border transition-all ${filter===f?"bg-blue-600 text-white border-blue-600":"border-border/60 text-muted-foreground hover:border-blue-300 hover:text-blue-600"}`}>{f}</button>)}
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
                        {filtered.map(b=>(
                            <div key={b.id} className="group flex gap-3 p-3.5 rounded-2xl border border-border/50 hover:border-blue-300 hover:bg-blue-50/30 bg-background cursor-pointer transition-all">
                                <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-lg shrink-0">{b.emoji}</div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-1">
                                        <div className="min-w-0">
                                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md">{b.layanan}</span>
                                            <p className="text-xs font-semibold text-foreground truncate mt-1">{b.tugas}</p>
                                        </div>
                                        <p className="text-sm font-bold text-blue-600 shrink-0">{formatRupiah(b.budget)}</p>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                        {b.jarak!=="—"&&<span className="flex items-center gap-0.5 text-[10px] text-muted-foreground"><MapPin className="w-2.5 h-2.5 text-blue-500"/>{b.jarak}</span>}
                                        <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground"><Clock className="w-2.5 h-2.5"/>{b.jadwal}</span>
                                        <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground"><Zap className="w-2.5 h-2.5 text-amber-500"/>{b.pesaing} minat</span>
                                        <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground ml-auto"><Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400"/>{b.rating}</span>
                                    </div>
                                </div>
                                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-blue-600 shrink-0 mt-1 transition-colors"/>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {view==="aktif"&&<ViewAktif/>}

            {view==="stats"&&(
                <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                        {[{label:"Selesai",value:"24",icon:CheckCircle2,color:"text-green-500",bg:"bg-green-50",border:"border-green-100"},{label:"Rating",value:"4.9",icon:Star,color:"text-amber-500",bg:"bg-amber-50",border:"border-amber-100"},{label:"Pendapatan",value:"1.2jt",icon:TrendingUp,color:"text-blue-600",bg:"bg-blue-50",border:"border-blue-100"}].map(({label,value,icon:Icon,color,bg,border})=>(
                            <div key={label} className={`${bg} border ${border} rounded-2xl p-3.5 flex flex-col gap-2`}>
                                <Icon className={`w-4 h-4 ${color}`}/>
                                <p className="text-xl font-bold text-foreground leading-none">{value}</p>
                                <p className="text-[10px] text-muted-foreground font-medium">{label}</p>
                            </div>
                        ))}
                    </div>
                    <div className="bg-background border border-border/50 rounded-2xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-bold text-foreground">Tugas minggu ini</p>
                            <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{WEEK_DATA.reduce((a,b)=>a+b,0)} total</span>
                        </div>
                        <div className="flex items-end gap-2" style={{height:72}}>
                            {WEEK_DATA.map((v,i)=>{const isT=i===4;const h=Math.max((v/maxWeek)*56,6);return(
                                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                    <div className={`w-full rounded-t-xl ${isT?"bg-blue-600 shadow-sm shadow-blue-600/30":"bg-blue-100"}`} style={{height:h}}/>
                                    <span className={`text-[9px] font-semibold ${isT?"text-blue-600":"text-muted-foreground"}`}>{DAYS[i]}</span>
                                </div>
                            );})}
                        </div>
                    </div>
                    <div className="bg-blue-600 rounded-2xl p-5 text-white relative overflow-hidden">
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full"/>
                        <div className="absolute -right-2 top-8 w-14 h-14 bg-white/10 rounded-full"/>
                        <p className="text-[11px] font-semibold opacity-75 mb-1 relative z-10">Pendapatan minggu ini</p>
                        <p className="text-2xl font-bold relative z-10">Rp 485.000</p>
                        <div className="flex items-center gap-1.5 mt-2 relative z-10">
                            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-semibold">↑ 18% dari minggu lalu</span>
                        </div>
                    </div>
                    <div className="bg-background border border-border/50 rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-bold text-foreground">Trust Score</p>
                            <span className="text-sm font-bold text-blue-600">87 / 100</span>
                        </div>
                        <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 rounded-full" style={{width:"87%"}}/>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-2">Kamu termasuk pekerja terpercaya 🏅</p>
                    </div>
                </div>
            )}

            {view==="history"&&(
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
                    {HISTORY.map((a,i)=>(
                        <div key={i} className="flex items-center gap-3 p-3.5 rounded-2xl border border-border/50 bg-background hover:bg-blue-50/30 hover:border-blue-200 transition-all cursor-pointer">
                            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-lg shrink-0">{a.emoji}</div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-foreground truncate">{a.tugas}</p>
                                <p className="text-[10px] text-muted-foreground mt-0.5">{a.waktu}</p>
                            </div>
                            <div className="text-right shrink-0">
                                <p className="text-xs font-bold text-blue-600">{formatRupiah(a.nominal)}</p>
                                <span className={`text-[10px] font-semibold ${a.done?"text-green-600":"text-amber-600"}`}>{a.done?"✓ Selesai":"● Proses"}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {view==="chat"&&!activeRoom&&(
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
                    {CHAT_ROOMS.map(room=>(
                        <button key={room.id} onClick={()=>setActiveRoom(room.id)} className="w-full flex items-center gap-3 p-3.5 rounded-2xl border border-border/50 hover:border-blue-300 hover:bg-blue-50/30 bg-background transition-all text-left">
                            <div className="relative shrink-0">
                                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">{room.avatar}</div>
                                {room.online&&<div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-background"/>}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between"><p className="text-xs font-bold text-foreground">{room.name}</p><span className="text-[10px] text-muted-foreground">{room.time}</span></div>
                                <p className="text-[10px] text-blue-600 font-medium truncate">{room.task}</p>
                                <p className="text-[10px] text-muted-foreground truncate mt-0.5">{room.last}</p>
                            </div>
                            {room.unread>0&&<span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">{room.unread}</span>}
                        </button>
                    ))}
                </div>
            )}

            {view==="chat"&&activeRoom&&activeRoomData&&(
                <div className="flex flex-col flex-1 overflow-hidden">
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-border/30 shrink-0 bg-blue-50/40">
                        <button onClick={()=>setActiveRoom(null)} className="w-7 h-7 rounded-xl bg-background border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors shrink-0">
                            <ChevronRight className="w-3.5 h-3.5 rotate-180"/>
                        </button>
                        <div className="relative shrink-0">
                            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">{activeRoomData.avatar}</div>
                            {activeRoomData.online&&<div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-background"/>}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-foreground">{activeRoomData.name}</p>
                            <p className="text-[10px] text-blue-600 font-medium truncate">{activeRoomData.task}</p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                            <button className="w-7 h-7 rounded-xl hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-blue-600 transition-colors"><Phone className="w-3.5 h-3.5"/></button>
                            <button className="w-7 h-7 rounded-xl hover:bg-muted flex items-center justify-center text-muted-foreground transition-colors"><MoreVertical className="w-3.5 h-3.5"/></button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                        {messages.map(msg=>(
                            <div key={msg.id} className={`flex ${msg.from==="me"?"justify-end":"justify-start"}`}>
                                <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl ${msg.from==="me"?"bg-blue-600 text-white rounded-br-md":"bg-muted/60 text-foreground rounded-bl-md border border-border/40"}`}>
                                    <p className="text-xs leading-relaxed">{msg.text}</p>
                                    <p className={`text-[9px] mt-1 ${msg.from==="me"?"opacity-70 text-right":"text-muted-foreground"}`}>{msg.time}</p>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef}/>
                    </div>
                    <div className="shrink-0 px-4 py-3 border-t border-border/30 bg-background">
                        <div className="flex items-center gap-2 bg-muted/50 border border-border/50 rounded-2xl px-3.5 py-2 focus-within:border-blue-400 transition-all">
                            <input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMessage()} placeholder="Ketik pesan..." className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none"/>
                            <button onClick={sendMessage} disabled={!chatInput.trim()} className="w-7 h-7 rounded-xl bg-blue-600 disabled:opacity-40 text-white flex items-center justify-center hover:bg-blue-700 transition-colors shrink-0"><Send className="w-3.5 h-3.5"/></button>
                        </div>
                    </div>
                </div>
            )}

            <div className="shrink-0 px-5 py-2.5 border-t border-border/30 flex items-center justify-between bg-background">
                <span className="text-[10px] text-muted-foreground/50">© Bounty</span>
                <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"/><span className="text-[10px] text-muted-foreground/50">Live</span></div>
            </div>
        </div>
    );
}