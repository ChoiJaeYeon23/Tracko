import { useCallback, useState } from 'react'
import {
    View,
    ScrollView,
    StyleSheet,
    SafeAreaView,
    RefreshControl,
    TouchableOpacity,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'

import {
    Header,
    Typography,
    DashboardCard,
    DashboardStatRow,
} from '../../components'
import { useAnalysisSnapshot } from '../../hooks/useAnalysisSnapshot'
import { formatKrw } from '../../utils/formatKrw'
import { CREAM, INK } from '../../constants/appColors'
import type { MainTabParamList } from '../../navigation/mainTabTypes'

const AnalysisScreen = () => {
    const navigation =
        useNavigation<BottomTabNavigationProp<MainTabParamList>>()
    const {
        refresh,
        thisMonthLabel,
        prevMonthLabel,
        thisSpent,
        prevSpent,
        thisIncome,
        spentVsPrevPercent,
        topCategories,
        todosTotal,
        todosDone,
        eventsTotal,
        routinesTotal,
    } = useAnalysisSnapshot()
    const [refreshing, setRefreshing] = useState(false)

    const onRefresh = useCallback(() => {
        setRefreshing(true)
        refresh()
        setTimeout(() => setRefreshing(false), 320)
    }, [refresh])

    const spentCompareLine =
        spentVsPrevPercent === null
            ? thisSpent > 0
                ? '지난 달 지출 없음 · 이번 달만 비교됨'
                : '이번 달 지출 내역 없음'
            : `${spentVsPrevPercent >= 0 ? '+' : ''}${Math.round(spentVsPrevPercent)}% (지난 달 대비)`

    const todoRate =
        todosTotal === 0
            ? '투두 없음'
            : `${Math.round((todosDone / todosTotal) * 100)}% 완료 (${todosDone}/${todosTotal})`

    return (
        <View style={styles.root}>
            <Header title="분석" showBackButton={false} />
            <SafeAreaView style={styles.safe}>
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={INK}
                        />
                    }
                >
                    <Typography variant="bodySm" style={styles.lead}>
                        {thisMonthLabel} 기준으로 가계부와 일정 데이터를 요약해
                        보여줘요.
                    </Typography>

                    <DashboardCard
                        title="월간 지출·수입"
                        footer={
                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate('LedgerScreen')
                                }
                                activeOpacity={0.7}
                                accessibilityRole="button"
                            >
                                <Typography
                                    variant="bodySmSemi"
                                    style={styles.link}
                                >
                                    가계부에서 자세히 보기
                                </Typography>
                            </TouchableOpacity>
                        }
                    >
                        <Typography
                            variant="bodySmSemi"
                            style={styles.captionMuted}
                        >
                            이번 달 · 지난 달({prevMonthLabel})
                        </Typography>
                        <DashboardStatRow
                            label="이번 달 지출"
                            value={`${formatKrw(thisSpent)}원`}
                        />
                        <DashboardStatRow
                            label="지난 달 지출"
                            value={`${formatKrw(prevSpent)}원`}
                        />
                        <DashboardStatRow
                            label="지출 변화"
                            value={spentCompareLine}
                        />
                        <DashboardStatRow
                            label="이번 달 수입"
                            value={
                                thisIncome > 0
                                    ? `+${formatKrw(thisIncome)}원`
                                    : `${formatKrw(0)}원`
                            }
                        />
                    </DashboardCard>

                    <DashboardCard title="지출 카테고리 (이번 달 상위 3개)">
                        {topCategories.length === 0 ? (
                            <Typography variant="bodySm" style={styles.empty}>
                                이번 달 지출 기록이 없어요.
                            </Typography>
                        ) : (
                            topCategories.map((c, idx) => (
                                <View
                                    key={`${c.label}-${idx}`}
                                    style={styles.catRow}
                                >
                                    <View
                                        style={[
                                            styles.dot,
                                            { backgroundColor: c.color },
                                        ]}
                                    />
                                    <Typography
                                        variant="bodySemi"
                                        style={styles.catLabel}
                                    >
                                        {c.label}
                                    </Typography>
                                    <Typography
                                        variant="bodySemi"
                                        style={styles.catAmt}
                                        numberOfLines={1}
                                    >
                                        {formatKrw(c.total)}원
                                    </Typography>
                                </View>
                            ))
                        )}
                    </DashboardCard>

                    <DashboardCard
                        title="일정·습관 규모"
                        footer={
                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate('ScheduleTab')
                                }
                                activeOpacity={0.7}
                                accessibilityRole="button"
                            >
                                <Typography
                                    variant="bodySmSemi"
                                    style={styles.link}
                                >
                                    일정 탭에서 관리하기
                                </Typography>
                            </TouchableOpacity>
                        }
                    >
                        <DashboardStatRow
                            label="전체 투두"
                            value={`${todosTotal}개 · ${todoRate}`}
                        />
                        <DashboardStatRow
                            label="등록된 일정"
                            value={`${eventsTotal}건`}
                        />
                        <DashboardStatRow
                            label="루틴"
                            value={`${routinesTotal}개`}
                        />
                    </DashboardCard>
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}

export default AnalysisScreen

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: CREAM,
    },
    safe: {
        flex: 1,
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 32,
    },
    lead: {
        color: INK,
        opacity: 0.55,
        marginBottom: 16,
        lineHeight: 20,
    },
    captionMuted: {
        marginTop: -4,
        marginBottom: 2,
        opacity: 0.55,
    },
    link: {
        color: INK,
    },
    empty: {
        opacity: 0.55,
    },
    catRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 10,
    },
    catLabel: {
        flex: 1,
        color: INK,
    },
    catAmt: {
        color: INK,
    },
})
