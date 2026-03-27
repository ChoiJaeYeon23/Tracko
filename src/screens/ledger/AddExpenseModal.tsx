import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Modal,
    Pressable,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
} from 'react-native'
import type { LedgerCategoryDef } from '../../constants/ledgerCategories'
import { PASTEL_RAINBOW } from '../../constants/categoryPastels'
import {
    CREAM,
    WHITE,
    INK,
    INK_MUTED,
    PLACEHOLDER,
    BORDER,
    TRACK_BG,
    SCRIM,
} from '../../constants/appColors'

type Props = {
    visible: boolean
    onClose: () => void
    categories: LedgerCategoryDef[]
    onSubmit: (payload: {
        amount: number
        categoryKey: string
        memo: string
    }) => void
    onAddCategory: (label: string, color: string) => string | null
}

const AddExpenseModal = ({
    visible,
    onClose,
    categories,
    onSubmit,
    onAddCategory,
}: Props) => {
    const [amount, setAmount] = useState('')
    const [memo, setMemo] = useState('')
    const [categoryKey, setCategoryKey] = useState(categories[0]?.key ?? 'food')
    const [addCatOpen, setAddCatOpen] = useState(false)
    const [newCatLabel, setNewCatLabel] = useState('')
    const [newCatColor, setNewCatColor] = useState<string>(PASTEL_RAINBOW[0])

    useEffect(() => {
        if (visible) {
            setAmount('')
            setMemo('')
            const first = categories[0]?.key ?? 'food'
            setCategoryKey(first)
        } else {
            setAddCatOpen(false)
        }
    }, [visible, categories])

    useEffect(() => {
        if (!visible || categories.length === 0) return
        const keys = new Set(categories.map(c => c.key))
        if (!keys.has(categoryKey)) {
            setCategoryKey(categories[0].key)
        }
    }, [visible, categories, categoryKey])

    const save = () => {
        const n = Number(String(amount).replace(/[^0-9]/g, ''))
        if (n <= 0) return
        onSubmit({ amount: n, categoryKey, memo })
        Keyboard.dismiss()
        onClose()
    }

    const saveNewCategory = () => {
        const key = onAddCategory(newCatLabel, newCatColor)
        Keyboard.dismiss()
        if (key) {
            setCategoryKey(key)
            setNewCatLabel('')
            setNewCatColor(PASTEL_RAINBOW[0])
            setAddCatOpen(false)
        }
    }

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <Pressable style={styles.backdrop} onPress={onClose} />
                <View style={styles.sheet}>
                    <View style={styles.grab} />
                    <Text style={styles.title}>지출 추가</Text>

                    <Text style={styles.label}>금액 (원)</Text>
                    <TextInput
                        value={amount}
                        onChangeText={setAmount}
                        keyboardType="number-pad"
                        placeholder="금액 입력"
                        placeholderTextColor={PLACEHOLDER}
                        style={styles.input}
                    />

                    <View style={styles.catHeaderRow}>
                        <Text style={[styles.label, styles.labelSpNone]}>
                            카테고리
                        </Text>
                        <TouchableOpacity
                            onPress={() => setAddCatOpen(true)}
                            style={styles.addCatBtn}
                        >
                            <Text style={styles.addCatBtnTxt}>+ 직접 추가</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.chips}
                    >
                        {categories.map(c => {
                            const sel = c.key === categoryKey
                            return (
                                <TouchableOpacity
                                    key={c.key}
                                    onPress={() => setCategoryKey(c.key)}
                                    style={[
                                        styles.chip,
                                        sel && {
                                            borderColor: c.color,
                                            backgroundColor: CREAM,
                                            borderWidth: 2,
                                        },
                                    ]}
                                >
                                    <View
                                        style={[
                                            styles.chipDot,
                                            { backgroundColor: c.color },
                                        ]}
                                    />
                                    <Text
                                        style={[
                                            styles.chipTxt,
                                            sel && { fontWeight: '700' },
                                        ]}
                                    >
                                        {c.label}
                                    </Text>
                                </TouchableOpacity>
                            )
                        })}
                    </ScrollView>

                    <Text style={[styles.label, styles.labelSp]}>메모 (선택)</Text>
                    <TextInput
                        value={memo}
                        onChangeText={setMemo}
                        placeholder="어디에 썼는지 짧게"
                        placeholderTextColor={PLACEHOLDER}
                        style={styles.input}
                    />

                    <View style={styles.actions}>
                        <TouchableOpacity
                            onPress={onClose}
                            style={[styles.btn, styles.cancel]}
                        >
                            <Text style={styles.cancelTxt}>취소</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={save}
                            style={[styles.btn, styles.save]}
                        >
                            <Text style={styles.saveTxt}>저장</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>

            <Modal
                visible={addCatOpen}
                transparent
                animationType="fade"
                onRequestClose={() => setAddCatOpen(false)}
            >
                <View style={styles.innerRoot}>
                    <Pressable
                        style={styles.innerBackdrop}
                        onPress={() => setAddCatOpen(false)}
                    />
                    <View style={styles.innerCard}>
                        <Text style={styles.innerTitle}>카테고리 추가</Text>
                        <Text style={styles.innerHint}>이름</Text>
                        <TextInput
                            value={newCatLabel}
                            onChangeText={setNewCatLabel}
                            placeholder="예: 반려동물"
                            placeholderTextColor={PLACEHOLDER}
                            style={styles.input}
                        />
                        <Text style={[styles.innerHint, styles.innerHintSp]}>
                            색상 (옅은 무지개)
                        </Text>
                        <View style={styles.colorRow}>
                            {PASTEL_RAINBOW.map(col => {
                                const sel = col === newCatColor
                                return (
                                    <TouchableOpacity
                                        key={col}
                                        onPress={() => setNewCatColor(col)}
                                        style={[
                                            styles.colorSwatch,
                                            { backgroundColor: col },
                                            sel && styles.colorSwatchSel,
                                        ]}
                                    />
                                )
                            })}
                        </View>
                        <View style={styles.innerActions}>
                            <TouchableOpacity
                                style={[styles.btn, styles.cancel]}
                                onPress={() => setAddCatOpen(false)}
                            >
                                <Text style={styles.cancelTxt}>닫기</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.btn, styles.save]}
                                onPress={saveNewCategory}
                            >
                                <Text style={styles.saveTxt}>추가</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </Modal>
    )
}

export default AddExpenseModal

const SWATCH = 36

const styles = StyleSheet.create({
    flex: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: SCRIM,
    },
    sheet: {
        backgroundColor: WHITE,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 28,
        borderTopWidth: 1,
        borderColor: BORDER,
    },
    grab: {
        alignSelf: 'center',
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: TRACK_BG,
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
        color: INK,
        marginBottom: 18,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: INK_MUTED,
        marginBottom: 8,
    },
    labelSp: {
        marginTop: 16,
    },
    labelSpNone: {
        marginBottom: 0,
        marginTop: 0,
    },
    catHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 16,
        marginBottom: 8,
    },
    addCatBtn: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 12,
        backgroundColor: CREAM,
        borderWidth: 1,
        borderColor: BORDER,
    },
    addCatBtnTxt: {
        fontSize: 13,
        fontWeight: '700',
        color: INK,
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
    chips: {
        flexDirection: 'row',
        paddingVertical: 4,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: BORDER,
        marginRight: 8,
        backgroundColor: WHITE,
    },
    chipDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    chipTxt: {
        fontSize: 14,
        color: INK,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 24,
    },
    btn: {
        paddingVertical: 12,
        paddingHorizontal: 22,
        borderRadius: 12,
        minWidth: 88,
        alignItems: 'center',
    },
    cancel: {
        backgroundColor: CREAM,
        marginRight: 12,
        borderWidth: 1,
        borderColor: BORDER,
    },
    cancelTxt: {
        color: INK_MUTED,
        fontWeight: '600',
    },
    save: {
        backgroundColor: INK,
    },
    saveTxt: {
        color: WHITE,
        fontWeight: '700',
    },
    innerRoot: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    innerBackdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: SCRIM,
    },
    innerCard: {
        backgroundColor: WHITE,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: BORDER,
    },
    innerTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: INK,
        marginBottom: 14,
    },
    innerHint: {
        fontSize: 13,
        fontWeight: '600',
        color: INK_MUTED,
        marginBottom: 8,
    },
    innerHintSp: {
        marginTop: 14,
    },
    colorRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 4,
    },
    colorSwatch: {
        width: SWATCH,
        height: SWATCH,
        borderRadius: SWATCH / 2,
        borderWidth: 2,
        borderColor: 'transparent',
        marginRight: 10,
        marginBottom: 10,
    },
    colorSwatchSel: {
        borderColor: INK,
    },
    innerActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 22,
    },
})