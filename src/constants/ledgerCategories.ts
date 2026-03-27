import { PASTEL_RAINBOW } from './categoryPastels'
import {
    getCustomLedgerCategories,
    customCategoryStorageKey,
} from '../database/ledger/ledgerStorage'

export type LedgerCategoryDef = {
    key: string
    label: string
    color: string
}

const pc = (i: number) => PASTEL_RAINBOW[i % PASTEL_RAINBOW.length]

export const LEDGER_CATEGORIES: LedgerCategoryDef[] = [
    { key: 'food', label: '식비', color: pc(0) },
    { key: 'transport', label: '교통', color: pc(1) },
    { key: 'shopping', label: '쇼핑', color: pc(2) },
    { key: 'culture', label: '문화/여가', color: pc(3) },
    { key: 'health', label: '의료/건강', color: pc(4) },
    { key: 'fixed', label: '고정비', color: pc(5) },
    { key: 'other', label: '기타', color: pc(6) },
]

export const getAllLedgerCategories = (): LedgerCategoryDef[] => {
    const custom = getCustomLedgerCategories().map(c => ({
        key: customCategoryStorageKey(c.id),
        label: c.label,
        color: c.color,
    }))
    return [...LEDGER_CATEGORIES, ...custom]
}

export const getLedgerCategory = (key: string): LedgerCategoryDef => {
    const preset = LEDGER_CATEGORIES.find(c => c.key === key)
    if (preset) return preset
    if (key.startsWith('custom:')) {
        const id = key.slice('custom:'.length)
        const c = getCustomLedgerCategories().find(x => x.id === id)
        if (c) {
            return {
                key,
                label: c.label,
                color: c.color,
            }
        }
    }
    return LEDGER_CATEGORIES[LEDGER_CATEGORIES.length - 1]
}
