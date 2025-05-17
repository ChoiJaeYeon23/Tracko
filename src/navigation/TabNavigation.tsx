import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import {
    AnalysisScreen,
    HomeScreen,
    LedgerScreen,
    PlannerScreen,
    SettingScreen
} from '../screens'

const BottomTab = createBottomTabNavigator()

const TabNavigation = () => {
    return (
        <BottomTab.Navigator>
            <BottomTab.Screen
                name='LedgerScreen'
                component={LedgerScreen}
            />
            <BottomTab.Screen
                name='PlannerScreen'
                component={PlannerScreen}
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