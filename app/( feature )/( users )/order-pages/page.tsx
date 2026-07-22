import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import TextArea from "./components/textArea";
import GridCardArea from "./components/gridCard";

export default async function OrderPages() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login-pages");
  }

  const dbUser = await prisma.pengguna.findUnique({
    where: { email: user.email! },
    include: {
      profil: true,
      alamat: {
        where: { statusAlamat: "AKTIF" },
        orderBy: { dibuatPada: "desc" },
      },
    },
  });

  if (!dbUser || !dbUser.profil) {
    redirect("/complete-profile");
  }

  const name = dbUser.profil.namaLengkap || dbUser.username || "Pengguna";

  // Ensure default services are seeded in database if none exist
  let dbServices = await prisma.layanan.findMany({
    where: { status: "AKTIF" },
    orderBy: { dibuatPada: "asc" },
  });

  if (dbServices.length === 0) {
    // Seed default services in transaction
    await prisma.$transaction([
      prisma.layanan.create({
        data: {
          namaLayanan: "Layanan Bersih - Bersih",
          deskripsi: "Rumah bersih tanpa repot! Pesan jasa kebersihan untuk membantu menyapu, mengepel, mencuci, membersihkan kamar mandi, dapur, dan berbagai pekerjaan rumah tangga lainnya dengan mudah.",
          status: "AKTIF",
        },
      }),
      prisma.layanan.create({
        data: {
          namaLayanan: "Layanan Jasa Titip Barang",
          deskripsi: "Butuh sesuatu tapi tidak ingin keluar rumah? Gunakan layanan jasa titip untuk membeli dan mengantarkan barang yang Anda inginkan dengan cepat dan praktis.",
          status: "AKTIF",
        },
      }),
      prisma.layanan.create({
        data: {
          namaLayanan: "Layanan Antar Jemput",
          deskripsi: "Layanan Antar Jemput menyediakan jasa transportasi dan pengantaran untuk membantu mobilitas Anda, mulai dari mengantar makanan, barang, hingga mengantar penumpang ke tujuan dengan aman dan nyaman.",
          status: "AKTIF",
        },
      }),
      prisma.layanan.create({
        data: {
          namaLayanan: "Layanan Tenaga Kerja",
          deskripsi: "Layanan Tenaga Kerja membantu Anda menemukan tenaga kerja yang sesuai untuk berbagai kebutuhan, mulai dari pekerjaan harian, bantuan proyek, hingga pekerjaan khusus dengan mudah dan terpercaya.",
          status: "AKTIF",
        },
      }),
      prisma.layanan.create({
        data: {
          namaLayanan: "Layanan Bantuan Digital",
          deskripsi: "Layanan Bantuan Digital membantu Anda menemukan tenaga untuk berbagai kebutuhan digital, seperti desain grafis, editing foto dan video, penulisan, pengelolaan media sosial, hingga layanan digital lainnya.",
          status: "AKTIF",
        },
      }),
      prisma.layanan.create({
        data: {
          namaLayanan: "Layanan Bimbingan Belajar",
          deskripsi: "Layanan Bimbingan Belajar membantu Anda meningkatkan kemampuan akademik melalui bimbingan dan tutor yang profesional, cocok untuk semua tingkat usia dan kebutuhan belajar.",
          status: "AKTIF",
        },
      }),
    ]);

    dbServices = await prisma.layanan.findMany({
      where: { status: "AKTIF" },
      orderBy: { dibuatPada: "asc" },
    });
  }

  // Format addresses list for the selector
  const savedAddresses = dbUser.alamat.map((addr) => ({
    id: addr.id,
    label: addr.labelAlamat,
    alamatLengkap: addr.alamatLengkap,
    catatan: addr.catatan || "",
    latitude: String(addr.latitude),
    longitude: String(addr.longitude),
    isUtama: addr.alamatUtama,
  }));

  const primaryAddress = savedAddresses.find((addr) => addr.isUtama) || savedAddresses[0] || null;

  // Format services mapping them to key values that UI matches
  const servicesData = dbServices.map((service) => {
    let href = "/";
    let imageKey = "bersih";
    const serviceName = service.namaLayanan.toLowerCase();

    if (serviceName.includes("bersih")) {
      href = "/layanan-bersih";
      imageKey = "bersih";
    } else if (serviceName.includes("titip") || serviceName.includes("jastip")) {
      href = "/layanan-jastip";
      imageKey = "jastip";
    } else if (serviceName.includes("antar") || serviceName.includes("jemput")) {
      href = "/layanan-antar-jemput";
      imageKey = "antarJemput";
    } else if (serviceName.includes("tenaga") || serviceName.includes("kerja")) {
      href = "/layanan-tenaga-kerja";
      imageKey = "tenagaKerja";
    } else if (serviceName.includes("digital") || serviceName.includes("bantuan")) {
      href = "/layanan-bantuan-digital";
      imageKey = "bantuanDigital";
    } else if (serviceName.includes("bimbingan") || serviceName.includes("belajar")) {
      href = "/layanan-bimbingan";
      imageKey = "bimbingan";
    }

    return {
      id: service.id,
      title: service.namaLayanan,
      description: service.deskripsi || "",
      href,
      imageKey,
    };
  });

  // Deduplicate services by href to prevent duplicate cards in UI
  const uniqueServicesMap = new Map<string, any>();
  servicesData.forEach((s) => {
    if (!uniqueServicesMap.has(s.href)) {
      uniqueServicesMap.set(s.href, s);
    }
  });
  const uniqueServices = Array.from(uniqueServicesMap.values());

  return (
    <div className="w-full py-10 flex flex-col gap-6">
      {/* Centered Address Input Section */}
      <div className="w-full flex justify-center">
        <TextArea 
          userName={name}
          savedAddresses={savedAddresses}
          initialAddress={primaryAddress}
        />
      </div>

      {/* Grid of Cards Section */}
      <div className="w-full">
        <GridCardArea services={uniqueServices} />
      </div>
    </div>
  );
}