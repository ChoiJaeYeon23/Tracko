import React, { useMemo } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import dayjs from 'dayjs'
import {
    CREAM,
    WHITE,
    INK,
    INK_MUTED,
    BORDER,
    INK_FAINT,
    LEDGER_CAL_EXPENSE_BG,
    LEDGER_CAL_INCOME_BG,
} from '../../constants/appColors'
import { WEEKDAY_LABELS_KO } from '../../constants/weekdays'
import { getMonthGridCells } from '../../utils/monthCalendarGrid'
import { typography } from '../../theme/typography'

type Props = {
    monthKey: string
    dailyExpense: Record<string, number>
    dailyIncome: Record<string, number>
    selectedDate: string | null
    onSelectDate: (isoDate: string | null) => void
    onShiftMonth: (delta: number) => void
}

const LedgerSpendingCalendar = ({
    monthKey,
    dailyExpense,
    dailyIncome,
    selectedDate,
    onSelectDate,
    onShiftMonth,
}: Props) => {
    const anchor = useMemo(() => dayjs(`${monthKey}-01`), [monthKey])
    const cells = useMemo(() => getMonthGridCells(anchor), [anchor])
    const todayStr = dayjs().format('YYYY-MM-DD')

    return (
        <View style={styles.wrap}>
            <Text style={styles.sectionTitle}>수입·지출 달력</Text>
            <Text style={styles.sectionSub}>
                색으로 하루에 수입·지출이 있었는지 한눈에 보여요. 날짜를 누르면
                상세 내역을 볼 수 있어요.
            </Text>

            <View style={styles.legendRow}>
                <View style={styles.legendItem}>
                    <View
                        style={[
                            styles.legendSwatch,
                            { backgroundColor: LEDGER_CAL_INCOME_BG },
                        ]}
                    />
                    <Text style={styles.legendText}>수입</Text>
                </View>
                <View style={styles.legendItem}>
                    <View
                        style={[
                            styles.legendSwatch,
                            { backgroundColor: LEDGER_CAL_EXPENSE_BG },
                        ]}
                    />
                    <Text style={styles.legendText}>지출</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={styles.legendSplit}>
                        <View
                            style={[
                                styles.legendSplitHalf,
                                { backgroundColor: LEDGER_CAL_INCOME_BG },
                            ]}
                        />
                        <View
                            style={[
                                styles.legendSplitHalf,
                                { backgroundColor: LEDGER_CAL_EXPENSE_BG },
                            ]}
                        />
                    </View>
                    <Text style={styles.legendText}>둘 다</Text>
                </View>
            </View>

            <View style={styles.monthRow}>
                <TouchableOpacity
                    onPress={() => onShiftMonth(-1)}
                    style={styles.monthBtn}
                    accessibilityLabel="이전 달"
                >
                    <Text style={styles.monthChevron}>{'<'}</Text>
                </TouchableOpacity>
                <Text style={styles.monthLabel}>{anchor.format('YYYY년 M월')}</Text>
                <TouchableOpacity
                    onPress={() => onShiftMonth(1)}
                    style={styles.monthBtn}
                    accessibilityLabel="다음 달"
                >
                    <Text style={styles.monthChevron}>{'>'}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.weekRow}>
                {WEEKDAY_LABELS_KO.map(d => (
                    <View key={d} style={styles.weekCell}>
                        <Text style={styles.weekText}>{d}</Text>
                    </View>
                ))}
            </View>

            {Array.from({ length: cells.length / 7 }, (_, week) => (
                <View key={week} style={styles.gridRow}>
                    {cells.slice(week * 7, week * 7 + 7).map((date, idx) => {
                        if (!date) {
                            return <View key={idx} style={styles.gridCell} />
                        }
                        const key = date.format('YYYY-MM-DD')
                        const exp = (dailyExpense[key] ?? 0) > 0
                        const inc = (dailyIncome[key] ?? 0) > 0
                        const sel = key === selectedDate
                        const isToday = key === todayStr

                        return (
                            <TouchableOpacity
                                key={key}
                                style={styles.gridCell}
                                onPress={() =>
                                    onSelectDate(sel ? null : key)
                                }
                                activeOpacity={0.7}
                            >
                                <View
                                    style={[
                                        styles.dayBubble,
                                        sel && styles.dayBubbleSelected,
                                        !sel &&
                                            isToday &&
                                            styles.dayBubbleToday,
                                    ]}
                                >
                                    {inc && exp ? (
                                        <View
                                            style={[
                                                styles.dayTint,
                                                { flexDirection: 'row' },
                                            ]}
                                        >
                                            <View
                                                style={[
                                                    styles.halfTint,
                                                    {
                                                        backgroundColor:
                                                            LEDGER_CAL_INCOME_BG,
                                                    },
                                                ]}
                                            />
                                            <View
                                                style={[
                                                    styles.halfTint,
                                                    {
                                                        backgroundColor:
                                                            LEDGER_CAL_EXPENSE_BG,
                                                    },
                                                ]}
                                            />
                                        </View>
                                    ) : inc ? (
                                        <View
                                            style={[
                                                styles.dayTint,
                                                styles.tintIncomeOnly,
                                            ]}
                                        />
                                    ) : exp ? (
                                        <View
                                            style={[
                                                styles.dayTint,
                                                styles.tintExpenseOnly,
                                            ]}
                                        />
                                    ) : null}
                                    <Text
                                        style={[
                                            styles.dayNum,
                                            (sel || isToday) && styles.dayNumSelected,
                                        ]}
                                    >
                                        {date.date()}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                </View>
            ))}
        </View>
    )
}

export default LedgerSpendingCalendar

const TINT_SIZE = 30

const styles = StyleSheet.create({
    wrap: {
        backgroundColor: WHITE,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: BORDER,
        padding: 14,
        marginBottom: 16,
    },
    sectionTitle: {
        ...typography.bodyLgBold,
        color: INK,
    },
    sectionSub: {
        marginTop: 4,
        ...typography.caption,
        color: INK_MUTED,
        lineHeight: 17,
    },
    legendRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 12,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 14,
        marginBottom: 4,
    },
    legendSwatch: {
        width: 14,
        height: 14,
        borderRadius: 7,
        marginRight: 6,
    },
    legendSplit: {
        flexDirection: 'row',
        width: 14,
        height: 14,
        borderRadius: 7,
        overflow: 'hidden',
        marginRight: 6,
    },
    legendSplitHalf: {
        flex: 1,
        height: '100%',
    },
    legendText: {
        ...typography.captionSemi,
        color: INK_MUTED,
    },
    monthRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 14,
        marginBottom: 10,
    },
    monthBtn: {
        minWidth: 44,
        minHeight: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    monthChevron: {
        ...typography.titleSemi,
        color: INK,
    },
    monthLabel: {
        ...typography.titleMd,
        color: INK,
    },
    weekRow: {
        flexDirection: 'row',
        marginBottom: 6,
    },
    weekCell: {
        flex: 1,
        alignItems: 'center',
    },
    weekText: {
        ...typography.captionSemi,
        color: INK_MUTED,
    },
    gridRow: {
        flexDirection: 'row',
        marginBottom: 6,
    },
    gridCell: {
        flex: 1,
        alignItems: 'center',
        minHeight: 40,
    },
    dayBubble: {
        width: TINT_SIZE,
        height: TINT_SIZE,
        borderRadius: TINT_SIZE / 2,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    dayBubbleSelected: {
        borderWidth: 2,
        borderColor: INK,
        backgroundColor: CREAM,
    },
    /** 선택 안 된 상태의 오늘(새로고침 후 등) — 원형 테두리 유지 */
    dayBubbleToday: {
        borderWidth: 1.5,
        borderColor: INK_FAINT,
    },
    dayTint: {
        ...StyleSheet.absoluteFillObject,
    },
    tintIncomeOnly: {
        backgroundColor: LEDGER_CAL_INCOME_BG,
    },
    tintExpenseOnly: {
        backgroundColor: LEDGER_CAL_EXPENSE_BG,
    },
    halfTint: {
        flex: 1,
        height: '100%',
    },
    dayNum: {
        ...typography.bodySmSemi,
        color: INK_MUTED,
        zIndex: 1,
    },
    dayNumSelected: {
        ...typography.bodySmBold,
        color: INK,
    },
})
