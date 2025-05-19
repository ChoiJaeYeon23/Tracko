import { NavigationContainer } from '@react-navigation/native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import StackNavigation from './src/navigation/StackNavigation'
import TabNavigation from './src/navigation/TabNavigation'


const App = () => {
    return (
        <GestureHandlerRootView>
            <NavigationContainer>
                <TabNavigation />
            </NavigationContainer>
        </GestureHandlerRootView>
    )
}

export default App