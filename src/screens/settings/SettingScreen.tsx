import { useState, useCallback } from 'react'
import {
    SafeAreaView,
    View,
    ScrollView,
    StyleSheet,
    RefreshControl,
} from 'react-native'

import {
    Header,
    Typography,
    DashboardCard,
    DashboardStatRow,
    SettingsSwitchRow,
} from '../../components'
import { CREAM, INK } from '../../constants/appColors'
import { APP_NAME, APP_VERSION } from '../../constants/appInfo'

const SettingScreen = () => {
    const [isNotificationEnabled, setIsNotificationEnabled] =
        useState<boolean>(false)
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false)
    const [refreshing, setRefreshing] = useState(false)

    const onRefresh = useCallback(() => {
        setRefreshing(true)
        setTimeout(() => setRefreshing(false), 280)
    }, [])

    return (
        <View style={styles.root}>
            <Header title="설정" showBackButton={false} />
            <SafeAreaView style={styles.safe}>
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={INK}
                        />
                    }
                >
                    <Typography variant="bodySm" style={styles.lead}>
                        알림과 화면 옵션을 정리할 수 있어요.
                    </Typography>

                    <DashboardCard title="알림">
                        <SettingsSwitchRow
                            label="푸시 알림"
                            description="루틴·투두 알림 등(추후 연동)"
                            value={isNotificationEnabled}
                            onValueChange={setIsNotificationEnabled}
                        />
                    </DashboardCard>

                    <DashboardCard title="화면">
                        <SettingsSwitchRow
                            label="다크 모드"
                            description="앱 전체 어두운 테마(준비 중)"
                            value={isDarkMode}
                            onValueChange={setIsDarkMode}
                            disabled
                        />
                    </DashboardCard>

                    <DashboardCard title="앱 정보">
                        <DashboardStatRow label="이름" value={APP_NAME} />
                        <DashboardStatRow label="버전" value={APP_VERSION} />
                    </DashboardCard>
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}

export default SettingScreen

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
})
