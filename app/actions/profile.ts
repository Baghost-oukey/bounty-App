"use server";

import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { JenisKelamin } from "@prisma/client";

export interface CompleteProfileInput {
  firstName: string;
  lastName: string;
  jenisKelamin?: JenisKelamin;
  tanggalLahir?: string;
  username: string;
  nomorHp?: string;
  fotoProfil?: string;
  // Address
  labelAlamat?: string;
  alamatLengkap?: string;
  provinsi?: string;
  kabupaten?: string;
  kecamatan?: string;
  kelurahan?: string;
  kodePos?: string;
  catatanAlamat?: string;
  latitude?: number;
  longitude?: number;
}

export async function getProfileStatus() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { authenticated: false, registered: false, user: null };
    }

    const dbUser = await prisma.pengguna.findUnique({
      where: { email: user.email! },
      include: {
        profil: true,
        alamat: true,
      },
    });

    if (!dbUser || !dbUser.profil) {
      return { authenticated: true, registered: false, user };
    }

    return { authenticated: true, registered: true, dbUser };
  } catch (error) {
    console.error("Error checking profile status:", error);
    return { authenticated: false, registered: false, error: String(error) };
  }
}

export async function completeUserProfile(data: CompleteProfileInput) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Sesi tidak valid. Silakan login kembali." };
    }

    const username = data.username.trim().toLowerCase();
    const namaLengkap = `${data.firstName.trim()} ${data.lastName.trim()}`.trim();
    const nomorHp = data.nomorHp?.trim() || null;

    if (!username || !data.firstName.trim()) {
      return { success: false, error: "Username dan Nama Depan wajib diisi." };
    }

    // 1. Check unique username
    const existingUsername = await prisma.pengguna.findUnique({
      where: { username },
    });
    if (existingUsername) {
      return { success: false, error: "Username sudah digunakan oleh orang lain." };
    }

    // 2. Check unique nomorHp
    if (nomorHp) {
      const existingPhone = await prisma.pengguna.findUnique({
        where: { nomorHp },
      });
      if (existingPhone) {
        return { success: false, error: "Nomor HP sudah terdaftar pada akun lain." };
      }
    }

    // 3. Check required address fields (Prisma schema requires them)
    if (
      !data.alamatLengkap?.trim() ||
      !data.provinsi?.trim() ||
      !data.kabupaten?.trim() ||
      !data.kecamatan?.trim() ||
      !data.kelurahan?.trim()
    ) {
      return { success: false, error: "Seluruh data alamat (Alamat Lengkap, Provinsi, Kota/Kabupaten, Kecamatan, Kelurahan) wajib diisi." };
    }

    // Fetch avatar URL from Supabase if none provided
    const fotoProfil = data.fotoProfil || user.user_metadata?.avatar_url || user.user_metadata?.picture || null;

    // Perform atomic transaction
    await prisma.$transaction(async (tx) => {
      // 1. Create Pengguna
      const pg = await tx.pengguna.create({
        data: {
          id: user.id, // matches Supabase auth user id
          username,
          email: user.email!,
          nomorHp,
          emailTerverifikasi: !!user.email_confirmed_at,
          nomorHpTerverifikasi: false,
        },
      });

      // 2. Create Profil
      await tx.profil.create({
        data: {
          idPengguna: pg.id,
          namaLengkap,
          fotoProfil,
          jenisKelamin: data.jenisKelamin || null,
          tanggalLahir: data.tanggalLahir ? new Date(data.tanggalLahir) : null,
        },
      });

      // 3. Create TrustScore
      await tx.trustScore.create({
        data: {
          idPengguna: pg.id,
          nilai: 100,
          jumlahStrike: 0,
        },
      });

      // 4. Create Alamat if address details provided
      if (data.alamatLengkap && data.provinsi) {
        await tx.alamat.create({
          data: {
            idPengguna: pg.id,
            labelAlamat: data.labelAlamat?.trim() || "Rumah",
            provinsi: data.provinsi,
            kabupaten: data.kabupaten || "",
            kecamatan: data.kecamatan || "",
            kelurahan: data.kelurahan || "",
            kodePos: data.kodePos || null,
            alamatLengkap: data.alamatLengkap,
            latitude: data.latitude ?? -6.2297, // default Jakarta
            longitude: data.longitude ?? 106.8295,
            catatan: data.catatanAlamat?.trim() || null,
            alamatUtama: true,
          },
        });
      }
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error completing user profile:", error);
    return { success: false, error: error?.message || "Terjadi kesalahan pada server." };
  }
}
