import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from 'react-native'
import type { LedgerCustomCategory } from '../../types/ledger'
import { INK, INK_MUTED, WHITE, BORDER } from '../../constants/appColors'

type Props = {
    items: LedgerCustomCategory[]
    onRemove: (id: string) => void
}

const CustomCategoriesSection = ({ items, onRemove }: Props) => {
    if (items.length === 0) {
        return null
    }

    const confirmRemove = (c: LedgerCustomCategory) => {
        Alert.alert(
            '카테고리 삭제',
            `"${c.label}"을(를) 삭제할까요?\n이미 쓴 지출 내역은「기타」로만 보일 수 있어요.`,
            [
                { text: '취소', style: 'cancel' },
                {
                    text: '삭제',
                    style: 'destructive',
                    onPress: () => onRemove(c.id),
                },
            ]
        )
    }

    return (
        <View style={styles.wrap}>
            <Text style={styles.title}>내 카테고리</Text>
            <Text style={styles.sub}>
                직접 추가한 항목이에요. 지출 추가 시에도 같은 목록에서 고를 수
                있어요.
            </Text>
            <View style={styles.grid}>
                {items.map(c => (
                    <View key={c.id} style={styles.pill}>
                        <View
                            style={[
                                styles.dot,
                                { backgroundColor: c.color },
                            ]}
                        />
                        <Text style={styles.pillTxt} numberOfLines={1}>
                            {c.label}
                        </Text>
                        <TouchableOpacity
                            onPress={() => confirmRemove(c)}
                            hitSlop={{
                                top: 8,
                                bottom: 8,
                                left: 8,
                                right: 8,
                            }}
                            style={styles.delHit}
                        >
                            <Text style={styles.del}>×</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </View>
    )
}

export default CustomCategoriesSection

const styles = StyleSheet.create({
    wrap: {
        marginBottom: 16,
    },
    title: {
        fontSize: 17,
        fontWeight: '700',
        color: INK,
        marginBottom: 4,
    },
    sub: {
        fontSize: 13,
        color: INK_MUTED,
        lineHeight: 18,
        marginBottom: 12,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: WHITE,
        borderWidth: 1,
        borderColor: BORDER,
        borderRadius: 20,
        paddingVertical: 8,
        paddingLeft: 12,
        paddingRight: 6,
        maxWidth: '100%',
        marginRight: 8,
        marginBottom: 8,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 8,
    },
    pillTxt: {
        fontSize: 14,
        fontWeight: '600',
        color: INK,
        flexShrink: 1,
        maxWidth: 140,
    },
    delHit: {
        padding: 4,
        marginLeft: 4,
    },
    del: {
        fontSize: 20,
        color: INK_MUTED,
        lineHeight: 20,
    },
})
