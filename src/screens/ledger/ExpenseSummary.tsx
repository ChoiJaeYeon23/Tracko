import React, { useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    TextInput,
    Pressable,
    Keyboard,
} from 'react-native'
import {
    CREAM,
    WHITE,
    INK,
    INK_MUTED,
    INK_FAINT,
    PLACEHOLDER,
    BORDER,
    TRACK_BG,
    SCRIM,
} from '../../constants/appColors'

type Props = {
    monthLabel: string
    budget: number
    totalSpent: number
    spentPercent: number
    displayPercent: number
    onSaveBudget: (amount: number) => void
}

const ExpenseSummary = ({
    monthLabel,
    budget,
    totalSpent,
    spentPercent,
    displayPercent,
    onSaveBudget,
}: Props) => {
    const [budgetModal, setBudgetModal] = useState(false)
    const [draft, setDraft] = useState('')

    const openBudget = () => {
        setDraft(budget > 0 ? String(budget) : '')
        setBudgetModal(true)
    }

    const saveBudget = () => {
        const n = Number(String(draft).replace(/[^0-9]/g, ''))
        onSaveBudget(n)
        Keyboard.dismiss()
        setBudgetModal(false)
    }

    const remaining = budget - totalSpent
    const overBudget = budget > 0 && totalSpent > budget
    const barColor = INK

    return (
        <View style={styles.card}>
            <View style={styles.rowBetween}>
                <Text style={styles.month}>{monthLabel}</Text>
                <TouchableOpacity onPress={openBudget} style={styles.editChip}>
                    <Text style={styles.editChipText}>
                        {budget > 0 ? '예산 수정' : '예산 설정'}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.budgetRow}>
                <Text style={styles.muted}>이번 달 예산</Text>
                <Text style={styles.budgetAmount}>
                    {budget > 0 ? `${budget.toLocaleString()}원` : '미설정'}
                </Text>
            </View>

            <Text style={styles.spentLabel}>지출 합계</Text>
            <Text style={styles.spentBig}>{totalSpent.toLocaleString()}원</Text>

            {budget > 0 ? (
                <>
                    <View style={styles.track}>
                        <View
                            style={[
                                styles.fill,
                                {
                                    width: `${spentPercent}%`,
                                    backgroundColor: barColor,
                                },
                            ]}
                        />
                    </View>
                    <View style={styles.percentRow}>
                        <Text style={styles.percentText}>
                            예산 대비{' '}
                            <Text style={styles.percentBold}>
                                {Math.round(displayPercent)}%
                            </Text>{' '}
                            사용
                        </Text>
                        <Text
                            style={[
                                styles.remain,
                                {
                                    color: overBudget ? INK : INK_MUTED,
                                    fontWeight: overBudget ? '800' : '600',
                                },
                            ]}
                        >
                            {overBudget
                                ? `${Math.abs(remaining).toLocaleString()}원 초과`
                                : `남음 ${remaining.toLocaleString()}원`}
                        </Text>
                    </View>
                </>
            ) : (
                <Text style={styles.hint}>
                    예산을 정하면 상단 막대로 사용 비율을 볼 수 있어요.
                </Text>
            )}

            <Modal
                visible={budgetModal}
                transparent
                animationType="fade"
                onRequestClose={() => setBudgetModal(false)}
            >
                <View style={styles.modalRoot}>
                    <Pressable
                        style={styles.backdrop}
                        onPress={() => setBudgetModal(false)}
                    />
                    <View style={styles.dialog}>
                        <Text style={styles.dialogTitle}>한 달 예산 (원)</Text>
                        <TextInput
                            value={draft}
                            onChangeText={setDraft}
                            keyboardType="number-pad"
                            placeholder="예: 500000"
                            placeholderTextColor={PLACEHOLDER}
                            style={styles.input}
                        />
                        <View style={styles.dialogActions}>
                            <TouchableOpacity
                                onPress={() => setBudgetModal(false)}
                                style={[styles.btn, styles.btnGhost]}
                            >
                                <Text style={styles.btnGhostText}>취소</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={saveBudget}
                                style={[styles.btn, styles.btnPrimary]}
                            >
                                <Text style={styles.btnPrimaryText}>저장</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default ExpenseSummary

const styles = StyleSheet.create({
    card: {
        backgroundColor: WHITE,
        borderRadius: 16,
        padding: 18,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: BORDER,
        shadowColor: INK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    month: {
        fontSize: 17,
        fontWeight: '700',
        color: INK,
    },
    editChip: {
        backgroundColor: CREAM,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: BORDER,
    },
    editChipText: {
        fontSize: 13,
        fontWeight: '600',
        color: INK,
    },
    budgetRow: {
        marginBottom: 14,
    },
    muted: {
        fontSize: 13,
        color: INK_MUTED,
        marginBottom: 4,
    },
    budgetAmount: {
        fontSize: 20,
        fontWeight: '700',
        color: INK,
    },
    spentLabel: {
        fontSize: 13,
        color: INK_MUTED,
    },
    spentBig: {
        fontSize: 28,
        fontWeight: '800',
        color: INK,
        marginTop: 4,
        marginBottom: 12,
    },
    track: {
        height: 10,
        borderRadius: 5,
        backgroundColor: TRACK_BG,
        overflow: 'hidden',
    },
    fill: {
        height: '100%',
        borderRadius: 5,
    },
    percentRow: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    percentText: {
        fontSize: 14,
        color: INK_MUTED,
    },
    percentBold: {
        fontWeight: '800',
        color: INK,
    },
    remain: {
        fontSize: 13,
        fontWeight: '600',
    },
    hint: {
        marginTop: 4,
        fontSize: 14,
        color: INK_FAINT,
        lineHeight: 20,
    },
    modalRoot: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: SCRIM,
    },
    dialog: {
        backgroundColor: WHITE,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: BORDER,
    },
    dialogTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: INK,
        marginBottom: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: BORDER,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 16,
        color: INK,
    },
    dialogActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 18,
    },
    btn: {
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 12,
        minWidth: 72,
        alignItems: 'center',
    },
    btnGhost: {
        backgroundColor: CREAM,
        marginRight: 12,
        borderWidth: 1,
        borderColor: BORDER,
    },
    btnGhostText: {
        color: INK_MUTED,
        fontWeight: '600',
    },
    btnPrimary: {
        backgroundColor: INK,
    },
    btnPrimaryText: {
        color: WHITE,
        fontWeight: '700',
    },
})
