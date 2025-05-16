import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Home/HomeScreen';

const BottomTab = createBottomTabNavigator();

const TabNavigation = () => {
    return (
        <BottomTab.Navigator>
            <BottomTab.Screen name="Home" component={HomeScreen} />
        </BottomTab.Navigator>
    )
}
export default TabNavigation