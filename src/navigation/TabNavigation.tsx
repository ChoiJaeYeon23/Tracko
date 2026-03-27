import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { CREAM, WHITE, INK, INK_MUTED } from '../constants/appColors'
import {
    AnalysisScreen,
    HomeScreen,
    LedgerScreen,
    SettingScreen
} from '../screens'
import ScheduleStackNavigator from './ScheduleStackNavigator'

const BottomTab = createBottomTabNavigator()

const TabNavigation = () => {
    return (
        <BottomTab.Navigator 
            screenOptions={{ 
                headerShown: false,
                tabBarActiveTintColor: INK,
                tabBarInactiveTintColor: INK_MUTED,

                tabBarStyle: {
                    backgroundColor: CREAM,
                    borderTopWidth: 1,
                    borderTopColor: WHITE,
                    height: 60,
                },
                tabBarItemStyle: {
                    alignItems: 'center',
                    justifyContent: 'center',
                },
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: '600',
                },
            }}
        >
            <BottomTab.Screen
                name='LedgerScreen'
                component={LedgerScreen}
                options={{
                    tabBarLabel: '가계부',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="account-balance-wallet" size={size} color={color} />
                    ),
                }}
            />
            <BottomTab.Screen
                name='ScheduleTab'
                component={ScheduleStackNavigator}
                options={{
                    tabBarLabel: '일정',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="calendar-today" size={size} color={color} />
                    ),
                }}
            />
            <BottomTab.Screen
                name='HomeScreen'
                component={HomeScreen}
                options={{
                    tabBarLabel: '홈',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="home" size={size} color={color} />
                    ),
                }}
            />
            <BottomTab.Screen
                name='AnalysisScreen'
                component={AnalysisScreen}
                options={{
                    tabBarLabel: '분석',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="analytics" size={size} color={color} />
                    ),
                }}
            />
            <BottomTab.Screen
                name='SettingScreen'
                component={SettingScreen}
                options={{
                    tabBarLabel: '설정',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="settings" size={size} color={color} />
                    ),
                }}
            />
        </BottomTab.Navigator>
    )
}
export default TabNavigation