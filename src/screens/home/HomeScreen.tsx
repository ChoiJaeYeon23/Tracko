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
import type { MainTabParamList } from '../../navigation/mainTabTypes'
import {
    Header,
    Typography,
    DashboardCard,
    DashboardStatRow,
} from '../../components'
import { useHomeDashboard } from '../../hooks/useHomeDashboard'
import { formatKrw } from '../../utils/formatKrw'
import { CREAM, INK } from '../../constants/appColors'

const HomeScreen = () => {
    const navigation =
        useNavigation<BottomTabNavigationProp<MainTabParamList>>()
    const {
        refresh,
        monthLabel,
        totalSpent,
        totalIncome,
        budget,
        dateLine,
        weekdayLabel,
        todosTodayTotal,
        todosTodayOpen,
        eventsTodayCount,
        routinesTodayCount,
    } = useHomeDashboard()
    const [refreshing, setRefreshing] = useState(false)

    const onRefresh = useCallback(() => {
        setRefreshing(true)
        refresh()
        setTimeout(() => setRefreshing(false), 320)
    }, [refresh])

    const budgetLine =
        budget > 0 ? `${formatKrw(budget)}원` : '미설정'

    const spentLine = `${formatKrw(totalSpent)}원`
    const incomeLine =
        totalIncome > 0
            ? `+${formatKrw(totalIncome)}원`
            : `${formatKrw(0)}원`

    const todoLine =
        todosTodayTotal === 0
            ? '없음'
            : `${todosTodayOpen}개 남음 · 전체 ${todosTodayTotal}개`

    return (
        <View style={styles.root}>
            <Header title="홈" showBackButton={false} />
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
                    <Typography variant="titleBold" style={styles.greeting}>
                        {dateLine} {weekdayLabel}
                    </Typography>
                    <Typography variant="bodySm" style={styles.subGreeting}>
                        이번 달 가계부와 오늘 일정을 한눈에 볼 수 있어요.
                    </Typography>

                    <DashboardCard
                        title="이번 달 가계부"
                        footer={
                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate('LedgerScreen')
                                }
                                activeOpacity={0.7}
                                accessibilityRole="button"
                                accessibilityLabel="가계부 탭으로 이동"
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
                            style={styles.mutedCaption}
                        >
                            {monthLabel}
                        </Typography>
                        <DashboardStatRow label="지출 합계" value={spentLine} />
                        <DashboardStatRow
                            label="수입 합계"
                            value={incomeLine}
                        />
                        <DashboardStatRow label="이번 달 예산" value={budgetLine} />
                    </DashboardCard>

                    <DashboardCard
                        title="오늘 일정"
                        footer={
                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate('ScheduleTab')
                                }
                                activeOpacity={0.7}
                                accessibilityRole="button"
                                accessibilityLabel="일정 탭으로 이동"
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
                        <DashboardStatRow label="투두" value={todoLine} />
                        <DashboardStatRow
                            label="일정(이벤트)"
                            value={
                                eventsTodayCount === 0
                                    ? '없음'
                                    : `${eventsTodayCount}건`
                            }
                        />
                        <DashboardStatRow
                            label="오늘 루틴"
                            value={
                                routinesTodayCount === 0
                                    ? '없음'
                                    : `${routinesTodayCount}개`
                            }
                        />
                    </DashboardCard>
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}

export default HomeScreen

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
    greeting: {
        color: INK,
        marginBottom: 6,
    },
    subGreeting: {
        color: INK,
        opacity: 0.55,
        marginBottom: 20,
        lineHeight: 20,
    },
    mutedCaption: {
        marginTop: -4,
        marginBottom: 2,
        opacity: 0.55,
    },
    link: {
        color: INK,
    },
})
