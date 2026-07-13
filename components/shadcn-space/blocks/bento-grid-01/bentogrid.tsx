import { Badge } from "@/components/ui/badge";
import ReminderAnimation from "@/components/shadcn-space/blocks/bento-grid-01/ReminderAnimation";
import AnimatedUiBlock from "@/components/shadcn-space/blocks/bento-grid-01/AnimatedUiBlock";
import Image from "next/image";
import Images1 from "@/public/assets/Images/TerimaBarang.png"
import Images2 from "@/public/assets/Images/Belajar.jpg"
import Images3 from "@/public/assets/Images/designer.jpg"

const Bentogrid = () => {
  return (
    <section id="features">
      <div className="py-11 md:py-20">
        <div className="max-w-7xl xl:px-16 lg:px-8 px-4 mx-auto flex flex-col gap-12">
          <div className="grid grid-cols-12 gap-5">
            <div className="lg:col-span-4 col-span-12 overflow-hidden">
              <div className="rounded-xl border border-border">
                <div className="bg-muted rounded-t-xl py-8 px-9 relative">
                  <ReminderAnimation />
                </div>
                <div className="flex flex-col gap-0.5 p-8 border-t border-border">
                  <h3 className="text-xl font-bold">
                    Membantu Pekerjaan Rumah
                  </h3>
                  <p className="text-base font-normal text-muted-foreground">
                    Temukan bantuan untuk bersih-bersih, merapikan rumah,
                    mencuci, hingga pekerjaan rumah tangga lainnya.
                  </p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-8 col-span-12 overflow-hidden">
              <div className="rounded-xl border border-border">
                <div className="bg-muted rounded-t-xl py-7 lg:px-30 px-6 relative">
                  <AnimatedUiBlock />
                </div>
                <div className="flex flex-col gap-0.5 p-8 border-t border-border">
                  <h3 className="text-xl font-bold">
                    Jasa Titip Barang
                  </h3>
                  <p className="text-base font-normal text-muted-foreground">
                    Titip belanja, beli makanan, obat, hadiah, atau ambil pesanan
                    — kurir terdekat siap membantu dengan cepat.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 col-span-12 overflow-hidden">
              <div className="rounded-xl border border-border h-full flex flex-col">
                <div className="p-8 bg-muted rounded-t-xl flex-1 flex items-center justify-center">
                  <Image
                    src={Images1}
                    alt="layout options"
                    className="dark:hidden"
                    width={ 500 }
                    height={500}
                  />
                </div>
                <div className="flex flex-col gap-0.5 p-8 border-t border-border">
                  <h3 className="text-xl font-bold">
                    Pindahan & Pengiriman
                  </h3>
                  <p className="text-base font-normal text-muted-foreground">
                    Dapatkan bantuan untuk mengangkut barang, pindahan kos, atau
                    pengiriman dalam kota.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 col-span-12 overflow-hidden">
              <div className="rounded-xl border border-border h-full flex flex-col">
                <div className="p-8 bg-muted rounded-t-xl flex-1 flex items-center justify-center">
                  <Image
                    src={Images2}
                    alt="color options"
                    className="dark:hidden"
                    width={ 500 }
                    height={500}
                  />
                </div>
                <div className="flex flex-col gap-0.5 p-8 border-t border-border">
                  <h3 className="text-xl font-bold">
                    Bibingan Belajar
                  </h3>
                  <p className="text-base font-normal text-muted-foreground">
                    Temukan pendamping belajar untuk akademik maupun
                    pengembangan keterampilan.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 col-span-12 overflow-hidden">
              <div className="rounded-xl border border-border h-full flex flex-col">
                <div className="p-8 bg-muted rounded-t-xl flex-1 flex items-center justify-center relative">
                  <Image
                    src={Images3}
                    alt="color options"
                    className="dark:hidden"
                    width={ 500 }
                    height={500}
                  />
                </div>
                <div className="flex flex-col gap-0.5 p-8 border-t border-border">
                  <h3 className="text-xl font-bold">
                    Bantuan Digital
                  </h3>
                  <p className="text-base font-normal text-muted-foreground">
                    Selesaikan pekerjaan digital lebih cepat. Mulai dari desain
                    grafis, editing dan lainnya.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Bentogrid;
