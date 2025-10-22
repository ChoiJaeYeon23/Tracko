import { useState } from 'react'
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    Switch
} from 'react-native'
import { Header } from '../../components'

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
        <View style={{ flex: 1, backgroundColor: '#FFFBF0' }}>
            <Header 
                title="설정"
                showBackButton={false}
            />
            <SafeAreaView style={{ flex: 1, padding: 20 }}>
                <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <Text style={{ fontSize: 16, fontWeight: '600' }}>알림 설정</Text>
                        <Switch
                            value={isNotificationEnabled}
                            onValueChange={toggleNotification}
                            trackColor={{ false: '#767577', true: '#666666' }}
                        />
                    </View>
                </View>
            </SafeAreaView>
        </View>
    )
}

export default SettingScreen