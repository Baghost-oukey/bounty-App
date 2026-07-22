import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import IncomeTracker from "./components/StatistikPendapatan";
import QuickActions from "./components/CardPilih";
import RecentBounty from "./components/HistoryBounty";
import LiveStats from "./components/LiveCardContainer";
import UserStats from "./components/ModalHeader";

function formatRelativeTime(dateStr: Date) {
  const now = new Date();
  const diffMs = now.getTime() - new Date(dateStr).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${Math.max(1, diffMins)} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  return `${diffDays} hari lalu`;
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login-pages");
  }

  const dbUser = await prisma.pengguna.findUnique({
    where: { email: user.email! },
    include: { 
      profil: true,
      pekerja: {
        include: {
          dompet: true
        }
      }
    },
  });

  if (!dbUser || !dbUser.profil) {
    redirect("/complete-profile");
  }

  let name = "Pengguna";
  let completedCount = 0;
  let activeCount = 0;
  let rating = 5.0;
  let totalIncome = 0;

    if (dbUser) {
      if (dbUser.profil?.namaLengkap) {
        name = dbUser.profil.namaLengkap;
      } else if (dbUser.username) {
        name = dbUser.username;
      }

      // Update user's last login status to current time for online calculation
      await prisma.pengguna.update({
        where: { id: dbUser.id },
        data: { terakhirLogin: new Date() },
      });

      // ── Client statistics (Posted Bounties) ──
      const clientCompleted = await prisma.tugas.count({
        where: { idPengguna: dbUser.id, statusTugas: "SELESAI" }
      });
      const clientActive = await prisma.tugas.count({
        where: { idPengguna: dbUser.id, statusTugas: { in: ["DIAMBIL", "BERJALAN"] } }
      });

      // ── Worker statistics (Taken Bounties) ──
      const workerCompleted = dbUser.pekerja?.jumlahTugasSelesai || 0;
      const workerActive = dbUser.pekerja
        ? await prisma.tugas.count({ where: { idPekerja: dbUser.pekerja.id, statusTugas: { in: ["DIAMBIL", "BERJALAN"] } } })
        : 0;

      completedCount = clientCompleted + workerCompleted;
      activeCount = clientActive + workerActive;
      rating = dbUser.pekerja?.rating || 5.0;
      totalIncome = dbUser.pekerja?.dompet?.totalPendapatan || 0;
    }

  // ── Fetch Weekly Activity Data ──
  const startOfWeek = new Date();
  const currentDay = startOfWeek.getDay();
  const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
  startOfWeek.setDate(startOfWeek.getDate() + distanceToMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  const weeklyData = [
    { day: "Sen", value: 0 },
    { day: "Sel", value: 0 },
    { day: "Rab", value: 0 },
    { day: "Kam", value: 0 },
    { day: "Jum", value: 0 },
    { day: "Sab", value: 0 },
    { day: "Min", value: 0 },
  ];

  if (dbUser) {
    const completedTasksThisWeek = await prisma.tugas.findMany({
      where: {
        OR: [
          { idPengguna: dbUser.id },
          dbUser.pekerja ? { idPekerja: dbUser.pekerja.id } : {},
        ].filter(Boolean),
        statusTugas: "SELESAI",
        selesaiPada: {
          gte: startOfWeek,
        },
      },
      select: {
        anggaran: true,
        hargaDisepakati: true,
        selesaiPada: true,
      },
    });

    completedTasksThisWeek.forEach((t) => {
      if (t.selesaiPada) {
        const val = t.hargaDisepakati || t.anggaran;
        const dayIdx = t.selesaiPada.getDay() === 0 ? 6 : t.selesaiPada.getDay() - 1;
        if (dayIdx >= 0 && dayIdx < 7) {
          weeklyData[dayIdx].value += val;
        }
      }
    });
  }

  // ── Fetch Global Live Counters ──
  // onlineCount = users who were active in the last 15 minutes
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
  const onlineCount = await prisma.pengguna.count({
    where: {
      terakhirLogin: {
        gte: fifteenMinutesAgo,
      },
    },
  });

  const waitingCount = await prisma.tugas.count({ where: { statusTugas: "TERBUKA" } });

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const completedTodayCount = await prisma.tugas.count({ 
    where: { 
      statusTugas: "SELESAI", 
      selesaiPada: { gte: startOfToday } 
    } 
  });

  const inProgressCount = await prisma.tugas.count({ 
    where: { 
      statusTugas: { in: ["DIAMBIL", "BERJALAN"] } 
    } 
  });

  // ── Fetch Recent Available Bounties (status = TERBUKA) ──
  const openTasks = await prisma.tugas.findMany({
    where: {
      statusTugas: "TERBUKA",
    },
    include: {
      jenisLayanan: {
        include: {
          layanan: true,
        },
      },
    },
    orderBy: {
      dibuatPada: "desc",
    },
    take: 5,
  });

  const recentBountiesList = openTasks.map((t) => ({
    id: t.id,
    judul: t.judul,
    layanan: t.jenisLayanan?.layanan?.namaLayanan || "Umum",
    status: t.statusTugas,
    nominal: t.hargaDisepakati || t.anggaran,
    waktu: formatRelativeTime(t.dibuatPada),
  }));

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ── Left column (2/3) ── */}
        <div className="lg:col-span-2 flex flex-col gap-5">

          {/* Greeting + stats */}
          <UserStats 
            name={name} 
            completedCount={completedCount}
            activeCount={activeCount}
            rating={rating}
            totalIncome={totalIncome}
          />

          {/* Income tracker */}
          <IncomeTracker weeklyData={weeklyData} />

          {/* Quick action cards */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-foreground">Mulai dari sini</h3>
            </div>
            <QuickActions />
          </div>
        </div>

        {/* ── Right column (1/3) ── */}
        <div className="flex flex-col gap-5">
          <LiveStats 
            initialOnline={onlineCount}
            initialWaiting={waitingCount}
            initialCompleted={completedTodayCount}
            initialInProgress={inProgressCount}
          />
          <RecentBounty bounties={recentBountiesList} />
        </div>
      </div>
    </div>
  );
}
