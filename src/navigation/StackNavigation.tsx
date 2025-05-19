
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/home/HomeScreen';
import TabNavigation from './TabNavigation';
const Stack = createStackNavigator();

const StackNavigation = () => {
    return (

        <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
    )
}

export default StackNavigation