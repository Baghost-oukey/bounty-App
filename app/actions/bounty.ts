"use server";

import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";

export interface CreateBountyInput {
  serviceName: string; // e.g. "Layanan Bersih - Bersih"
  categories: string[]; // e.g. ["Menyapu & Mengepel", "Kamar Mandi"]
  date: string; // e.g. "2026-07-25"
  time: string; // e.g. "09:00"
  description?: string;
  price: number;
  // Location
  address: string;
  lat: number;
  lng: number;
}

export async function createBountyTask(data: CreateBountyInput) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Sesi tidak valid. Silakan login kembali." };
    }

    // 1. Find or Seed the parent Layanan ("Layanan Bersih - Bersih")
    let parentLayanan = await prisma.layanan.findFirst({
      where: { namaLayanan: { contains: data.serviceName, mode: "insensitive" } },
    });

    if (!parentLayanan) {
      parentLayanan = await prisma.layanan.create({
        data: {
          namaLayanan: data.serviceName,
          deskripsi: "Pekerjaan pembersihan dan perawatan ruangan",
          status: "AKTIF",
        },
      });
    }

    // 2. Find or Seed default JenisLayanan (under parentLayanan)
    let jenisLayanan = await prisma.jenisLayanan.findFirst({
      where: { idLayanan: parentLayanan.id },
    });

    if (!jenisLayanan) {
      jenisLayanan = await prisma.jenisLayanan.create({
        data: {
          idLayanan: parentLayanan.id,
          namaJenis: data.categories[0] || "Umum",
          deskripsi: "Pekerjaan kebersihan umum",
        },
      });
    }

    // 3. Find or Create Alamat
    let matchedAlamat = await prisma.alamat.findFirst({
      where: {
        idPengguna: user.id,
        alamatLengkap: data.address,
        statusAlamat: "AKTIF",
      },
    });

    if (!matchedAlamat) {
      matchedAlamat = await prisma.alamat.create({
        data: {
          idPengguna: user.id,
          labelAlamat: "Lokasi Bounty",
          provinsi: "DKI Jakarta",
          kabupaten: "Jakarta",
          kecamatan: "Kecamatan",
          kelurahan: "Kelurahan",
          alamatLengkap: data.address,
          latitude: data.lat,
          longitude: data.lng,
          alamatUtama: false,
        },
      });
    }

    // 4. Generate unique kodeTugas (e.g. BTY-123456)
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const kodeTugas = `BTY-${randomSuffix}`;

    // 5. Create Tugas record
    const title = `${data.serviceName}: ${data.categories.join(", ")}`;
    
    const tugas = await prisma.tugas.create({
      data: {
        kodeTugas,
        idPengguna: user.id,
        idAlamat: matchedAlamat.id,
        idJenisLayanan: jenisLayanan.id,
        judul: title,
        deskripsi: data.description || "Tidak ada deskripsi tambahan.",
        anggaran: data.price,
        tanggalPengerjaan: new Date(data.date),
        jamPengerjaan: data.time,
        statusTugas: "TERBUKA",
      },
    });

    return { success: true, tugasId: tugas.id, kodeTugas: tugas.kodeTugas };
  } catch (error: any) {
    console.error("Error creating bounty task:", error);
    return { success: false, error: error?.message || "Terjadi kesalahan server saat memposting bounty." };
  }
}

export async function getActiveBountyTasks() {
  try {
    const activeTasks = await prisma.tugas.findMany({
      where: { statusTugas: "TERBUKA" },
      include: {
        alamat: true,
        jenisLayanan: {
          include: {
            layanan: true
          }
        }
      },
      orderBy: { dibuatPada: "desc" },
    });

    return {
      success: true,
      tasks: activeTasks.map((t) => ({
        id: t.id,
        lat: t.alamat.latitude,
        lng: t.alamat.longitude,
        layanan: t.jenisLayanan.layanan.namaLayanan,
        tugas: t.judul,
        lokasi: t.alamat.alamatLengkap,
        jadwal: `${t.tanggalPengerjaan.toLocaleDateString("id-ID", { day: "numeric", month: "short" })}, ${t.jamPengerjaan}`,
        budget: t.anggaran,
        pesaing: Math.floor(Math.random() * 4), // random simulator
        jarak: "Terdekat",
        rating: 5.0,
      })),
    };
  } catch (error: any) {
    console.error("Error fetching active bounties:", error);
    return { success: false, error: error?.message || "Gagal memuat daftar bounty." };
  }
}

export async function claimBountyTask(tugasId: string) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Sesi tidak valid. Silakan login kembali." };
    }

    // Find or create Pekerja record for this user
    let pekerja = await prisma.pekerja.findUnique({
      where: { idPengguna: user.id },
    });

    if (!pekerja) {
      pekerja = await prisma.pekerja.create({
        data: {
          idPengguna: user.id,
          rating: 5.0,
          statusVerifikasi: "TERVERIFIKASI",
          statusOnline: true,
        },
      });
      
      // Also create dompet for pekerja
      await prisma.dompetPekerja.create({
        data: {
          idPekerja: pekerja.id,
          saldo: 0,
        },
      });
    }

    // Update Tugas status and assign to this worker
    const updatedTugas = await prisma.tugas.update({
      where: { id: tugasId },
      data: {
        idPekerja: pekerja.id,
        statusTugas: "DIAMBIL",
        mulaiPada: new Date(),
      },
    });

    return { success: true, tugasId: updatedTugas.id, kodeTugas: updatedTugas.kodeTugas };
  } catch (error: any) {
    console.error("Error claiming bounty task:", error);
    return { success: false, error: error?.message || "Gagal mengambil bounty." };
  }
}
