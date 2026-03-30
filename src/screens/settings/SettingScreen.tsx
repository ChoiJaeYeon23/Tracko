import { useState } from 'react'
import {
    SafeAreaView,
    View,
    TouchableOpacity,
    Switch
} from 'react-native'
import { Typography } from '../../components'
import { Header } from '../../components'
import { CREAM, WHITE, INK, INK_MUTED, BORDER } from '../../constants/appColors'

const SettingScreen = () => {
    const [isNotificationEnabled, setIsNotificationEnabled] = useState<boolean>(false)
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false)

    const toggleNotification = () => {
        setIsNotificationEnabled(prev => !prev)
    }

    const toggleTheme = () => {
        setIsDarkMode(prev => !prev)
    }

    return (
        <View style={{ flex: 1, backgroundColor: CREAM }}>
            <Header 
                title="설정"
                showBackButton={false}
            />
            <SafeAreaView style={{ flex: 1, padding: 20 }}>
                <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <Typography variant="bodyLgSemi" style={{ color: INK }}>
                            알림 설정
                        </Typography>
                        <Switch
                            value={isNotificationEnabled}
                            onValueChange={toggleNotification}
                            trackColor={{ false: BORDER, true: INK_MUTED }}
                            thumbColor={WHITE}
                        />
                    </View>
                </View>
            </SafeAreaView>
        </View>
    )
}

export default SettingScreen