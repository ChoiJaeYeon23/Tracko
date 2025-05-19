import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import {
    AnalysisScreen,
    HomeScreen,
    LedgerScreen,
    ScheduleScreen,
    SettingScreen
} from '../screens'
import ScheduleStackNavigator from './ScheduleStackNavigator'

const BottomTab = createBottomTabNavigator()

const TabNavigation = () => {
    return (
        <BottomTab.Navigator screenOptions={{ headerShown: false }}>
            <BottomTab.Screen
                name='LedgerScreen'
                component={LedgerScreen}
            />
            <BottomTab.Screen
                name='ScheduleTab'
                component={ScheduleStackNavigator}
            />
            <BottomTab.Screen
                name='HomeScreen'
                component={HomeScreen}
            />
            <BottomTab.Screen
                name='AnalysisScreen'
                component={AnalysisScreen}
            />
            <BottomTab.Screen
                name='SettingScreen'
                component={SettingScreen}
            />
        </BottomTab.Navigator>
    )
}
export default TabNavigation