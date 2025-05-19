import { useState } from 'react'
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    Switch
} from 'react-native'

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
        <SafeAreaView>
            <View>
                <View>
                    <Text>알림 설정</Text>
                    <Switch
                        value={isNotificationEnabled}
                        onValueChange={toggleNotification}
                        trackColor={{ false: '#767577', true: '#666666' }}
                    />
                </View>


            </View>
        </SafeAreaView>
    )
}

export default SettingScreen