-- CreateEnum
CREATE TYPE "StatusAkun" AS ENUM ('AKTIF', 'NONAKTIF', 'DIBLOKIR');

-- CreateEnum
CREATE TYPE "StatusAdmin" AS ENUM ('AKTIF', 'NONAKTIF');

-- CreateEnum
CREATE TYPE "JenisKelamin" AS ENUM ('LAKI_LAKI', 'PEREMPUAN', 'LAINNYA');

-- CreateEnum
CREATE TYPE "StatusPengajuan" AS ENUM ('MENUNGGU', 'DISETUJUI', 'DITOLAK');

-- CreateEnum
CREATE TYPE "StatusVerifikasi" AS ENUM ('BELUM_TERVERIFIKASI', 'TERVERIFIKASI', 'DITANGGUHKAN');

-- CreateEnum
CREATE TYPE "StatusTugas" AS ENUM ('TERBUKA', 'DIAMBIL', 'BERJALAN', 'SELESAI', 'DIBATALKAN', 'SENGKETA');

-- CreateEnum
CREATE TYPE "StatusPembayaran" AS ENUM ('MENUNGGU', 'BERHASIL', 'GAGAL', 'DIKEMBALIKAN');

-- CreateEnum
CREATE TYPE "MetodePembayaran" AS ENUM ('TRANSFER_BANK', 'DOMPET_DIGITAL', 'TUNAI');

-- CreateEnum
CREATE TYPE "JenisTransaksi" AS ENUM ('PENDAPATAN', 'PENARIKAN', 'REFUND', 'BONUS');

-- CreateEnum
CREATE TYPE "StatusAlamat" AS ENUM ('AKTIF', 'DIHAPUS');

-- CreateEnum
CREATE TYPE "StatusLayanan" AS ENUM ('AKTIF', 'NONAKTIF');

-- CreateTable
CREATE TABLE "admin" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nama_admin" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" "StatusAdmin" NOT NULL DEFAULT 'AKTIF',
    "terakhir_login" TIMESTAMP(3),
    "dibuat_pada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diubah_pada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pengguna" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nomor_hp" TEXT,
    "password" TEXT NOT NULL,
    "status_akun" "StatusAkun" NOT NULL DEFAULT 'AKTIF',
    "email_terverifikasi" BOOLEAN NOT NULL DEFAULT false,
    "nomor_hp_terverifikasi" BOOLEAN NOT NULL DEFAULT false,
    "terakhir_login" TIMESTAMP(3),
    "dibuat_pada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diubah_pada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pengguna_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profil" (
    "id" TEXT NOT NULL,
    "id_pengguna" TEXT NOT NULL,
    "nama_lengkap" TEXT NOT NULL,
    "foto_profil" TEXT,
    "jenis_kelamin" "JenisKelamin",
    "tanggal_lahir" TIMESTAMP(3),
    "dibuat_pada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diubah_pada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profil_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alamat" (
    "id" TEXT NOT NULL,
    "id_pengguna" TEXT NOT NULL,
    "label_alamat" TEXT NOT NULL,
    "provinsi" TEXT NOT NULL,
    "kabupaten" TEXT NOT NULL,
    "kecamatan" TEXT NOT NULL,
    "kelurahan" TEXT NOT NULL,
    "kode_pos" TEXT,
    "alamat_lengkap" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "catatan" TEXT,
    "alamat_utama" BOOLEAN NOT NULL DEFAULT false,
    "status_alamat" "StatusAlamat" NOT NULL DEFAULT 'AKTIF',
    "dibuat_pada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diubah_pada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "alamat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pengajuan_pekerja" (
    "id" TEXT NOT NULL,
    "id_pengguna" TEXT NOT NULL,
    "foto_identitas" TEXT NOT NULL,
    "foto_selfie" TEXT NOT NULL,
    "deskripsi_diri" TEXT,
    "pengalaman" TEXT,
    "status_pengajuan" "StatusPengajuan" NOT NULL DEFAULT 'MENUNGGU',
    "catatan_admin" TEXT,
    "dibuat_pada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diproses_pada" TIMESTAMP(3),

    CONSTRAINT "pengajuan_pekerja_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pekerja" (
    "id" TEXT NOT NULL,
    "id_pengguna" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "jumlah_tugas_selesai" INTEGER NOT NULL DEFAULT 0,
    "status_verifikasi" "StatusVerifikasi" NOT NULL DEFAULT 'BELUM_TERVERIFIKASI',
    "status_online" BOOLEAN NOT NULL DEFAULT false,
    "dibuat_pada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diubah_pada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pekerja_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dompet_pekerja" (
    "id" TEXT NOT NULL,
    "id_pekerja" TEXT NOT NULL,
    "saldo" INTEGER NOT NULL DEFAULT 0,
    "total_pendapatan" INTEGER NOT NULL DEFAULT 0,
    "total_penarikan" INTEGER NOT NULL DEFAULT 0,
    "dibuat_pada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diubah_pada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dompet_pekerja_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "riwayat_saldo" (
    "id" TEXT NOT NULL,
    "id_dompet" TEXT NOT NULL,
    "id_tugas" TEXT,
    "jenis_transaksi" "JenisTransaksi" NOT NULL,
    "nominal" INTEGER NOT NULL,
    "saldo_sebelum" INTEGER NOT NULL,
    "saldo_sesudah" INTEGER NOT NULL,
    "keterangan" TEXT,
    "dibuat_pada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "riwayat_saldo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "layanan" (
    "id" TEXT NOT NULL,
    "nama_layanan" TEXT NOT NULL,
    "ikon" TEXT,
    "deskripsi" TEXT,
    "status" "StatusLayanan" NOT NULL DEFAULT 'AKTIF',
    "dibuat_pada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "layanan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jenis_layanan" (
    "id" TEXT NOT NULL,
    "id_layanan" TEXT NOT NULL,
    "nama_jenis" TEXT NOT NULL,
    "deskripsi" TEXT,
    "dibuat_pada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "jenis_layanan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tugas" (
    "id" TEXT NOT NULL,
    "kode_tugas" TEXT NOT NULL,
    "id_pengguna" TEXT NOT NULL,
    "id_pekerja" TEXT,
    "id_alamat" TEXT NOT NULL,
    "id_jenis_layanan" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "deskripsi" TEXT,
    "anggaran" INTEGER NOT NULL,
    "harga_disepakati" INTEGER,
    "tanggal_pengerjaan" TIMESTAMP(3) NOT NULL,
    "jam_pengerjaan" TEXT NOT NULL,
    "status_tugas" "StatusTugas" NOT NULL DEFAULT 'TERBUKA',
    "mulai_pada" TIMESTAMP(3),
    "selesai_pada" TIMESTAMP(3),
    "dibuat_pada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diubah_pada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tugas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pembayaran" (
    "id" TEXT NOT NULL,
    "id_tugas" TEXT NOT NULL,
    "nominal" INTEGER NOT NULL,
    "metode_pembayaran" "MetodePembayaran" NOT NULL,
    "status_pembayaran" "StatusPembayaran" NOT NULL DEFAULT 'MENUNGGU',
    "bukti_pembayaran" TEXT,
    "dibayar_pada" TIMESTAMP(3),

    CONSTRAINT "pembayaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "penilaian" (
    "id" TEXT NOT NULL,
    "id_tugas" TEXT NOT NULL,
    "id_pengguna" TEXT NOT NULL,
    "id_pekerja" TEXT NOT NULL,
    "nilai" INTEGER NOT NULL,
    "ulasan" TEXT,
    "dibuat_pada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "penilaian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ruang_chat" (
    "id" TEXT NOT NULL,
    "id_tugas" TEXT NOT NULL,
    "dibuat_pada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ruang_chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pesan" (
    "id" TEXT NOT NULL,
    "id_ruang_chat" TEXT NOT NULL,
    "id_pengirim" TEXT NOT NULL,
    "isi_pesan" TEXT NOT NULL,
    "sudah_dibaca" BOOLEAN NOT NULL DEFAULT false,
    "dibuat_pada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pesan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "riwayat_status" (
    "id" TEXT NOT NULL,
    "id_tugas" TEXT NOT NULL,
    "status" "StatusTugas" NOT NULL,
    "keterangan" TEXT,
    "dibuat_pada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "riwayat_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trust_score" (
    "id" TEXT NOT NULL,
    "id_pengguna" TEXT NOT NULL,
    "nilai" INTEGER NOT NULL DEFAULT 100,
    "jumlah_strike" INTEGER NOT NULL DEFAULT 0,
    "terakhir_diperbarui" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trust_score_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_username_key" ON "admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "admin_email_key" ON "admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "pengguna_username_key" ON "pengguna"("username");

-- CreateIndex
CREATE UNIQUE INDEX "pengguna_email_key" ON "pengguna"("email");

-- CreateIndex
CREATE UNIQUE INDEX "pengguna_nomor_hp_key" ON "pengguna"("nomor_hp");

-- CreateIndex
CREATE UNIQUE INDEX "profil_id_pengguna_key" ON "profil"("id_pengguna");

-- CreateIndex
CREATE INDEX "alamat_id_pengguna_idx" ON "alamat"("id_pengguna");

-- CreateIndex
CREATE UNIQUE INDEX "pengajuan_pekerja_id_pengguna_key" ON "pengajuan_pekerja"("id_pengguna");

-- CreateIndex
CREATE UNIQUE INDEX "pekerja_id_pengguna_key" ON "pekerja"("id_pengguna");

-- CreateIndex
CREATE UNIQUE INDEX "dompet_pekerja_id_pekerja_key" ON "dompet_pekerja"("id_pekerja");

-- CreateIndex
CREATE INDEX "riwayat_saldo_id_dompet_idx" ON "riwayat_saldo"("id_dompet");

-- CreateIndex
CREATE INDEX "jenis_layanan_id_layanan_idx" ON "jenis_layanan"("id_layanan");

-- CreateIndex
CREATE UNIQUE INDEX "tugas_kode_tugas_key" ON "tugas"("kode_tugas");

-- CreateIndex
CREATE INDEX "tugas_id_pengguna_idx" ON "tugas"("id_pengguna");

-- CreateIndex
CREATE INDEX "tugas_id_pekerja_idx" ON "tugas"("id_pekerja");

-- CreateIndex
CREATE INDEX "tugas_status_tugas_idx" ON "tugas"("status_tugas");

-- CreateIndex
CREATE INDEX "tugas_tanggal_pengerjaan_idx" ON "tugas"("tanggal_pengerjaan");

-- CreateIndex
CREATE UNIQUE INDEX "pembayaran_id_tugas_key" ON "pembayaran"("id_tugas");

-- CreateIndex
CREATE UNIQUE INDEX "penilaian_id_tugas_key" ON "penilaian"("id_tugas");

-- CreateIndex
CREATE INDEX "penilaian_id_pekerja_idx" ON "penilaian"("id_pekerja");

-- CreateIndex
CREATE UNIQUE INDEX "ruang_chat_id_tugas_key" ON "ruang_chat"("id_tugas");

-- CreateIndex
CREATE INDEX "pesan_id_ruang_chat_idx" ON "pesan"("id_ruang_chat");

-- CreateIndex
CREATE INDEX "riwayat_status_id_tugas_idx" ON "riwayat_status"("id_tugas");

-- CreateIndex
CREATE UNIQUE INDEX "trust_score_id_pengguna_key" ON "trust_score"("id_pengguna");

-- AddForeignKey
ALTER TABLE "profil" ADD CONSTRAINT "profil_id_pengguna_fkey" FOREIGN KEY ("id_pengguna") REFERENCES "pengguna"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alamat" ADD CONSTRAINT "alamat_id_pengguna_fkey" FOREIGN KEY ("id_pengguna") REFERENCES "pengguna"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pengajuan_pekerja" ADD CONSTRAINT "pengajuan_pekerja_id_pengguna_fkey" FOREIGN KEY ("id_pengguna") REFERENCES "pengguna"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pekerja" ADD CONSTRAINT "pekerja_id_pengguna_fkey" FOREIGN KEY ("id_pengguna") REFERENCES "pengguna"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dompet_pekerja" ADD CONSTRAINT "dompet_pekerja_id_pekerja_fkey" FOREIGN KEY ("id_pekerja") REFERENCES "pekerja"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "riwayat_saldo" ADD CONSTRAINT "riwayat_saldo_id_dompet_fkey" FOREIGN KEY ("id_dompet") REFERENCES "dompet_pekerja"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "riwayat_saldo" ADD CONSTRAINT "riwayat_saldo_id_tugas_fkey" FOREIGN KEY ("id_tugas") REFERENCES "tugas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jenis_layanan" ADD CONSTRAINT "jenis_layanan_id_layanan_fkey" FOREIGN KEY ("id_layanan") REFERENCES "layanan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tugas" ADD CONSTRAINT "tugas_id_pengguna_fkey" FOREIGN KEY ("id_pengguna") REFERENCES "pengguna"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tugas" ADD CONSTRAINT "tugas_id_pekerja_fkey" FOREIGN KEY ("id_pekerja") REFERENCES "pekerja"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tugas" ADD CONSTRAINT "tugas_id_alamat_fkey" FOREIGN KEY ("id_alamat") REFERENCES "alamat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tugas" ADD CONSTRAINT "tugas_id_jenis_layanan_fkey" FOREIGN KEY ("id_jenis_layanan") REFERENCES "jenis_layanan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pembayaran" ADD CONSTRAINT "pembayaran_id_tugas_fkey" FOREIGN KEY ("id_tugas") REFERENCES "tugas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penilaian" ADD CONSTRAINT "penilaian_id_tugas_fkey" FOREIGN KEY ("id_tugas") REFERENCES "tugas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penilaian" ADD CONSTRAINT "penilaian_id_pengguna_fkey" FOREIGN KEY ("id_pengguna") REFERENCES "pengguna"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penilaian" ADD CONSTRAINT "penilaian_id_pekerja_fkey" FOREIGN KEY ("id_pekerja") REFERENCES "pekerja"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ruang_chat" ADD CONSTRAINT "ruang_chat_id_tugas_fkey" FOREIGN KEY ("id_tugas") REFERENCES "tugas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pesan" ADD CONSTRAINT "pesan_id_ruang_chat_fkey" FOREIGN KEY ("id_ruang_chat") REFERENCES "ruang_chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "riwayat_status" ADD CONSTRAINT "riwayat_status_id_tugas_fkey" FOREIGN KEY ("id_tugas") REFERENCES "tugas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trust_score" ADD CONSTRAINT "trust_score_id_pengguna_fkey" FOREIGN KEY ("id_pengguna") REFERENCES "pengguna"("id") ON DELETE CASCADE ON UPDATE CASCADE;
