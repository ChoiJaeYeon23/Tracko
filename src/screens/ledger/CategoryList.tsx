import React, { useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    LayoutAnimation,
    Platform,
    UIManager,
} from 'react-native'
import dayjs from 'dayjs'
import 'dayjs/locale/ko'
import type { CategoryAggregate } from '../../hooks/useLedger'
import {
    CREAM,
    WHITE,
    INK,
    INK_MUTED,
    INK_FAINT,
    BORDER,
    TRACK_BG,
} from '../../constants/appColors'

if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true)
}

dayjs.locale('ko')

type Props = {
    aggregates: CategoryAggregate[]
    totalSpent: number
    onDeleteExpense: (id: string) => void
}

const CategoryList = ({ aggregates, totalSpent, onDeleteExpense }: Props) => {
    const [openKey, setOpenKey] = useState<string | null>(null)

    const toggle = (key: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
        setOpenKey(prev => (prev === key ? null : key))
    }

    if (aggregates.length === 0) {
        return (
            <View style={styles.emptyCard}>
                <Text style={styles.sectionTitle}>카테고리별 지출</Text>
                <Text style={styles.emptyText}>
                    아직 이번 달 지출이 없어요.{'\n'}
                    오른쪽 아래 + 로 항목을 추가해 보세요.
                </Text>
            </View>
        )
    }

    return (
        <View style={styles.wrap}>
            <Text style={styles.sectionTitle}>카테고리별 지출</Text>
            <Text style={styles.sectionSub}>
                항목을 누르면 해당 카테고리의 최근 내역이 펼쳐져요.
            </Text>
            {aggregates.map(agg => {
                const open = openKey === agg.categoryKey
                return (
                    <View key={agg.categoryKey} style={styles.card}>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={styles.cardHead}
                            onPress={() => toggle(agg.categoryKey)}
                        >
                            <View style={styles.headLeft}>
                                <View
                                    style={[
                                        styles.dot,
                                        { backgroundColor: agg.color },
                                    ]}
                                />
                                <Text style={styles.catName}>{agg.label}</Text>
                            </View>
                            <View style={styles.headRight}>
                                <Text style={styles.catAmount}>
                                    {agg.total.toLocaleString()}원
                                </Text>
                                <Text style={styles.catShare}>
                                    {totalSpent > 0
                                        ? `${Math.round(agg.shareOfMonth)}%`
                                        : '—'}
                                </Text>
                                <Text style={styles.chev}>{open ? '▲' : '▼'}</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={styles.shareTrack}>
                            <View
                                style={[
                                    styles.shareFill,
                                    {
                                        width: `${agg.shareOfMonth}%`,
                                        backgroundColor: agg.color,
                                    },
                                ]}
                            />
                        </View>
                        {open && (
                            <View style={styles.detail}>
                                {agg.items.slice(0, 8).map(item => (
                                    <View key={item.id} style={styles.itemRow}>
                                        <View style={styles.itemMain}>
                                            <Text style={styles.itemDate}>
                                                {dayjs(item.createdAt).format(
                                                    'M/D (ddd)'
                                                )}
                                            </Text>
                                            <Text
                                                style={styles.itemMemo}
                                                numberOfLines={1}
                                            >
                                                {item.memo || '메모 없음'}
                                            </Text>
                                        </View>
                                        <Text style={styles.itemAmt}>
                                            {item.amount.toLocaleString()}
                                        </Text>
                                        <TouchableOpacity
                                            onPress={() =>
                                                onDeleteExpense(item.id)
                                            }
                                            hitSlop={{
                                                top: 8,
                                                bottom: 8,
                                                left: 8,
                                                right: 8,
                                            }}
                                            style={styles.del}
                                        >
                                            <Text style={styles.delTxt}>×</Text>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                )
            })}
        </View>
    )
}

export default CategoryList

const styles = StyleSheet.create({
    wrap: {
        marginBottom: 96,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: INK,
        marginBottom: 4,
    },
    sectionSub: {
        fontSize: 13,
        color: INK_FAINT,
        marginBottom: 14,
        lineHeight: 18,
    },
    emptyCard: {
        backgroundColor: WHITE,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: BORDER,
        marginBottom: 96,
    },
    emptyText: {
        fontSize: 14,
        color: INK_MUTED,
        lineHeight: 22,
        marginTop: 8,
    },
    card: {
        backgroundColor: WHITE,
        borderRadius: 14,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: BORDER,
        overflow: 'hidden',
    },
    cardHead: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 14,
    },
    headLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    catName: {
        fontSize: 16,
        fontWeight: '600',
        color: INK,
    },
    headRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    catAmount: {
        fontSize: 15,
        fontWeight: '700',
        color: INK,
        marginRight: 8,
    },
    catShare: {
        fontSize: 13,
        color: INK_MUTED,
        width: 36,
        textAlign: 'right',
    },
    chev: {
        fontSize: 12,
        color: INK_FAINT,
        marginLeft: 6,
        width: 20,
        textAlign: 'center',
    },
    shareTrack: {
        height: 4,
        backgroundColor: TRACK_BG,
    },
    shareFill: {
        height: 4,
    },
    detail: {
        borderTopWidth: 1,
        borderTopColor: CREAM,
        paddingBottom: 8,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 14,
    },
    itemMain: {
        flex: 1,
    },
    itemDate: {
        fontSize: 12,
        color: INK_FAINT,
        marginBottom: 2,
    },
    itemMemo: {
        fontSize: 14,
        color: INK,
    },
    itemAmt: {
        fontSize: 14,
        fontWeight: '700',
        color: INK,
        marginRight: 8,
    },
    del: {
        padding: 4,
    },
    delTxt: {
        fontSize: 22,
        color: INK_MUTED,
        lineHeight: 22,
    },
})