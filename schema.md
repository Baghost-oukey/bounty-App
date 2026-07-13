

admin

────────────────────────────────────

id_admin (UUID)

username

password

nama_admin

email

status

terakhir_login

dibuat_pada

diubah_pada



pengguna

────────────────────────────────────

id_pengguna (UUID)

username

email

nomor_hp

password

status_akun

email_terverifikasi

nomor_hp_terverifikasi

terakhir_login

dibuat_pada

diubah_pada



profil

────────────────────────────────────

id_profil

id_pengguna

nama_lengkap

foto_profil

jenis_kelamin

tanggal_lahir

dibuat_pada

diubah_pada



alamat

────────────────────────────────────

id_alamat

id_pengguna

label_alamat

provinsi

kabupaten

kecamatan

kelurahan

kode_pos

alamat_lengkap

latitude

longitude

catatan

alamat_utama

status_alamat

dibuat_pada

diubah_pada



pengajuan_pekerja

────────────────────────────────────

id_pengajuan

id_pengguna

foto_identitas

foto_selfie

deskripsi_diri

pengalaman

status_pengajuan

catatan_admin

dibuat_pada

diproses_pada



pekerja

────────────────────────────────────

id_pekerja

id_pengguna

rating

jumlah_tugas_selesai

status_verifikasi

status_online

dibuat_pada

diubah_pada



dompet_pekerja

────────────────────────────────────

id_dompet

id_pekerja

saldo

total_pendapatan

total_penarikan

dibuat_pada

diubah_pada



riwayat_saldo

────────────────────────────────────

id_riwayat

id_dompet

id_tugas

jenis_transaksi

nominal

saldo_sebelum

saldo_sesudah

keterangan

dibuat_pada



layanan

────────────────────────────────────

id_layanan

nama_layanan

ikon

deskripsi

status

dibuat_pada



jenis_layanan

────────────────────────────────────

id_jenis_layanan

id_layanan

nama_jenis

deskripsi

dibuat_pada



tugas

────────────────────────────────────

id_tugas

kode_tugas

id_pengguna

id_pekerja

id_alamat

id_jenis_layanan

judul

deskripsi

anggaran

harga_disepakati

tanggal_pengerjaan

jam_pengerjaan

status_tugas

mulai_pada

selesai_pada

dibuat_pada

diubah_pada





pembayaran

────────────────────────────────────

id_pembayaran

id_tugas

nominal

metode_pembayaran

status_pembayaran

bukti_pembayaran

dibayar_pada



penilaian

────────────────────────────────────

id_penilaian

id_tugas

id_pengguna

id_pekerja

nilai

ulasan

dibuat_pada





ruang_chat

────────────────────────────────────

id_ruang_chat

id_tugas

dibuat_pada



riwayat_status

────────────────────────────────────

id_riwayat

id_tugas

status

keterangan

dibuat_pada





trust_score

────────────────────────────────────

id_trust

id_pengguna

nilai

jumlah_strike

terakhir_diperbarui



