export const CATEGORIES = [
    { id: "sapu_pel",     label: "Sapu & Pel" },
    { id: "kamar_mandi",  label: "Kamar Mandi" },
    { id: "dapur",        label: "Dapur" },
    { id: "cuci_piring",  label: "Cuci Piring" },
    { id: "cuci_baju",    label: "Cuci Baju" },
    { id: "lap_debu",     label: "Lap Debu" },
    { id: "buang_sampah", label: "Buang Sampah" },
    { id: "kandang",      label: "Kandang Hewan" },
    { id: "jendela",      label: "Kaca & Jendela" },
    { id: "lainnya",      label: "Lainnya" },
] as const;

export const DEFAULT_LAT     = -6.2297;
export const DEFAULT_LNG     = 106.8295;
export const DEFAULT_ADDRESS = "Menara Cyber 2 Lt. 18, Kuningan, Jakarta Selatan";

export const formatRupiah = (val: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);

export const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("id-ID", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
    });
};
