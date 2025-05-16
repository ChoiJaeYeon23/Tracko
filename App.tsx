import { NavigationContainer } from '@react-navigation/native'
import StackNavigation from './src/navigation/StackNavigation'
import { GestureHandlerRootView } from 'react-native-gesture-handler';


const App = () => {

  return (
    <GestureHandlerRootView>
      <NavigationContainer>
        <StackNavigation />
      </NavigationContainer>
    </GestureHandlerRootView>
  )
}

export default App