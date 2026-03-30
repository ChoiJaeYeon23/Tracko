import { NavigationContainer } from '@react-navigation/native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { KeyboardAvoidingView, Platform } from 'react-native'
import TabNavigation from './src/navigation/TabNavigation'
import { CREAM } from './src/constants/appColors'

const App = () => {
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: CREAM }}>
                <KeyboardAvoidingView
                    style={{ flex: 1, backgroundColor: CREAM }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <NavigationContainer>
                        <TabNavigation />
                    </NavigationContainer>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

export default App