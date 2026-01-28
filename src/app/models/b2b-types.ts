export interface Expense {
    id: number;
    name: string;
    net: number;
    vat: number;
}

export interface TaxFormOption {
    key: string;
    label: string;
}

export interface ZusOption {
    key: string;
    label: string;
}

export const TAX_FORM_OPTIONS: TaxFormOption[] = [
    { key: 'SKALA', label: 'Skala Podatkowa (12%/32%)' },
    { key: 'LINIOWY', label: 'Podatek Liniowy (19%)' },
    { key: 'RYCZALT_85', label: 'Ryczałt (8.5%)' },
    { key: 'RYCZALT_12', label: 'Ryczałt (12%)' },
    { key: 'RYCZALT_15', label: 'Ryczałt (15%)' },
    { key: 'RYCZALT_17', label: 'Ryczałt (17%)' },
];

export const ZUS_OPTIONS: ZusOption[] = [
    { key: 'START', label: 'Ulga na start (tylko zdrowotna)' },
    { key: 'MALY', label: 'Mały ZUS (preferencyjny)' },
    { key: 'PELNY', label: 'Pełny ZUS' },
];