import React, { useMemo } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import dayjs from 'dayjs'
import { getLedgerCategory } from '../../constants/ledgerCategories'
import { ledgerEntryKind } from '../../utils/ledgerEntryKind'
import { formatKrw } from '../../utils/formatKrw'
import type { LedgerExpense } from '../../types/ledger'
import {
    WHITE,
    INK,
    INK_MUTED,
    BORDER,
    INK_FAINT,
    LEDGER_ROW_INCOME,
} from '../../constants/appColors'
import { typography } from '../../theme/typography'

type Props = {
    selectedDate: string
    items: LedgerExpense[]
    onDeleteExpense: (id: string) => void
    onClearSelection: () => void
}

const LedgerDayExpenses = ({
    selectedDate,
    items,
    onDeleteExpense,
    onClearSelection,
}: Props) => {
    const sorted = useMemo(
        () =>
            [...items].sort((a, b) =>
                b.createdAt.localeCompare(a.createdAt)
            ),
        [items]
    )

    const expenseTotal = sorted
        .filter(e => ledgerEntryKind(e) === 'expense')
        .reduce((s, e) => s + e.amount, 0)
    const incomeTotal = sorted
        .filter(e => ledgerEntryKind(e) === 'income')
        .reduce((s, e) => s + e.amount, 0)

    return (
        <View style={styles.wrap}>
            <View style={styles.headRow}>
                <View>
                    <Text style={styles.title}>
                        {dayjs(selectedDate).format('M월 D일')} 내역
                    </Text>
                    <Text style={styles.sub}>
                        수입{' '}
                        <Text style={styles.incomeAmt}>
                            {formatKrw(incomeTotal)}원
                        </Text>
                        {' · '}지출{' '}
                        <Text style={styles.expenseAmt}>
                            {formatKrw(expenseTotal)}원
                        </Text>
                        {' · '}
                        {sorted.length}건
                    </Text>
                </View>
                <TouchableOpacity onPress={onClearSelection} hitSlop={12}>
                    <Text style={styles.close}>닫기</Text>
                </TouchableOpacity>
            </View>
            {sorted.length === 0 ? (
                <Text style={styles.empty}>
                    이 날 기록된 내역이 없어요.
                </Text>
            ) : (
                sorted.map(e => {
                    const cat = getLedgerCategory(e.categoryKey)
                    const inc = ledgerEntryKind(e) === 'income'
                    return (
                        <View key={e.id} style={styles.row}>
                            <View style={styles.rowLeft}>
                                <View
                                    style={[
                                        styles.dot,
                                        { backgroundColor: cat.color },
                                    ]}
                                />
                                <View style={styles.rowText}>
                                    <View style={styles.labelRow}>
                                        <Text
                                            style={[
                                                styles.badge,
                                                inc
                                                    ? styles.badgeIncome
                                                    : styles.badgeExpense,
                                            ]}
                                        >
                                            {inc ? '수입' : '지출'}
                                        </Text>
                                        <Text style={styles.catLabel}>
                                            {cat.label}
                                        </Text>
                                    </View>
                                    {e.memo ? (
                                        <Text
                                            style={styles.memo}
                                            numberOfLines={2}
                                        >
                                            {e.memo}
                                        </Text>
                                    ) : null}
                                </View>
                            </View>
                            <View style={styles.rowRight}>
                                <Text
                                    style={[
                                        styles.amount,
                                        inc && styles.amountIncome,
                                    ]}
                                >
                                    {inc ? '+' : ''}
                                    {formatKrw(e.amount)}원
                                </Text>
                                <TouchableOpacity
                                    onPress={() => onDeleteExpense(e.id)}
                                    hitSlop={{
                                        top: 8,
                                        bottom: 8,
                                        left: 8,
                                        right: 8,
                                    }}
                                >
                                    <Text style={styles.delete}>삭제</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                })
            )}
        </View>
    )
}

export default LedgerDayExpenses

const styles = StyleSheet.create({
    wrap: {
        backgroundColor: WHITE,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: BORDER,
        padding: 14,
        marginBottom: 16,
    },
    headRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    title: {
        ...typography.bodyLgBold,
        color: INK,
    },
    sub: {
        marginTop: 4,
        ...typography.caption,
        color: INK_MUTED,
    },
    incomeAmt: {
        ...typography.captionBold,
        color: LEDGER_ROW_INCOME,
    },
    expenseAmt: {
        ...typography.captionBold,
        color: INK,
    },
    close: {
        ...typography.bodySmSemi,
        color: INK_MUTED,
    },
    empty: {
        ...typography.bodySm,
        color: INK_MUTED,
        paddingVertical: 8,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: INK_FAINT,
    },
    rowLeft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingRight: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginTop: 5,
        marginRight: 8,
    },
    rowText: {
        flex: 1,
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    badge: {
        ...typography.micro,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        overflow: 'hidden',
        marginRight: 6,
        marginBottom: 2,
    },
    badgeIncome: {
        backgroundColor: 'rgba(45, 122, 82, 0.15)',
        color: LEDGER_ROW_INCOME,
    },
    badgeExpense: {
        backgroundColor: 'rgba(22, 22, 22, 0.08)',
        color: INK_MUTED,
    },
    catLabel: {
        ...typography.bodySemi,
        color: INK,
    },
    memo: {
        marginTop: 2,
        ...typography.caption,
        color: INK_MUTED,
    },
    rowRight: {
        alignItems: 'flex-end',
    },
    amount: {
        ...typography.bodyBold,
        color: INK,
    },
    amountIncome: {
        color: LEDGER_ROW_INCOME,
    },
    delete: {
        marginTop: 6,
        ...typography.captionSemi,
        color: INK_MUTED,
    },
})
