export type Step = "input" | "confirm" | "done";

export interface CardContentProps {
    step: Step;
    setStep: (s: Step) => void;
    selectedCategories: string[];
    setSelectedCategories: (v: string[]) => void;
    customCategory: string;
    setCustomCategory: (v: string) => void;
    description: string;
    setDescription: (v: string) => void;
    date: string;
    setDate: (v: string) => void;
    time: string;
    setTime: (v: string) => void;
    price: string;
    handlePriceInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
    selectedLabels: string[];
    finalPrice: number;
    canPost: boolean;
    handlePost: () => void;
}
