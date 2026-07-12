"use client";

import { CATEGORIES } from "./constants";

interface Props {
    selected: string[];
    customText: string;
    onChange: (selected: string[]) => void;
    onCustomChange: (text: string) => void;
}

export default function KategoriInput({ selected, customText, onChange, onCustomChange }: Props) {
    const toggle = (id: string) =>
        onChange(selected.includes(id) ? selected.filter((c) => c !== id) : [...selected, id]);

    const selectAll = () => onChange(CATEGORIES.map((c) => c.id));
    const clearAll  = () => {
        onChange([]);
        onCustomChange("");
    };

    const anySelected = selected.length > 0;
    const allSelected = selected.length === CATEGORIES.length;
    const lainnyaSelected = selected.includes("lainnya");

    return (
        <div className="space-y-2">
            {/* Label row */}
            <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-foreground">
                    Yang perlu dibersihkan
                </label>
                <div className="flex items-center gap-2.5">
                    {anySelected && (
                        <button
                            onClick={clearAll}
                            className="text-[11px] font-semibold text-red-500 hover:text-red-600 transition-colors"
                        >
                            Hapus semua
                        </button>
                    )}
                    {!allSelected && (
                        <button
                            onClick={selectAll}
                            className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                        >
                            Pilih semua
                        </button>
                    )}
                </div>
            </div>

            {/* Counter */}
            {anySelected && (
                <p className="text-[11px] text-blue-600 font-medium">
                    {selected.length} dari {CATEGORIES.length} dipilih
                </p>
            )}

            {/* Chips */}
            <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => {
                    const isSelected = selected.includes(cat.id);
                    return (
                        <button
                            key={cat.id}
                            onClick={() => toggle(cat.id)}
                            className={`px-3 py-2 rounded-2xl border text-xs font-semibold transition-all ${
                                isSelected
                                    ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-600/20"
                                    : "bg-muted/50 border-border/50 text-foreground hover:border-blue-300 hover:bg-blue-50"
                            }`}
                        >
                            {cat.label}
                        </button>
                    );
                })}
            </div>

            {/* Text field muncul saat "Lainnya" dipilih */}
            {lainnyaSelected && (
                <div className="mt-1 space-y-1.5">
                    <label className="text-[11px] font-semibold text-foreground">
                        Sebutkan kategori lainnya
                    </label>
                    <input
                        type="text"
                        value={customText}
                        onChange={(e) => onCustomChange(e.target.value)}
                        placeholder="Misal: Cuci mobil, bersihkan AC, dll..."
                        className="w-full bg-muted/50 border border-border/50 rounded-2xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        autoFocus
                    />
                </div>
            )}
        </div>
    );
}
