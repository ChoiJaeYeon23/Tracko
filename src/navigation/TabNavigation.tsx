import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Icon from 'react-native-vector-icons/MaterialIcons'
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
                tabBarActiveTintColor: '#FFB643',

                tabBarStyle: {
                    backgroundColor: '#FFF8E1',
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
                        <Icon name="account-balance-wallet" size={size ?? 24} color={color ?? '#FFB74D'} />
                    ),
                }}
            />
            <BottomTab.Screen
                name='ScheduleTab'
                component={ScheduleStackNavigator}
                options={{
                    tabBarLabel: '일정',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="calendar-today" size={size ?? 24} color={color ?? '#FFB74D'} />
                    ),
                }}
            />
            <BottomTab.Screen
                name='HomeScreen'
                component={HomeScreen}
                options={{
                    tabBarLabel: '홈',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="home" size={size ?? 24} color={color ?? '#FFB74D'} />
                    ),
                }}
            />
            <BottomTab.Screen
                name='AnalysisScreen'
                component={AnalysisScreen}
                options={{
                    tabBarLabel: '분석',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="analytics" size={size ?? 24} color={color ?? '#FFB74D'} />
                    ),
                }}
            />
            <BottomTab.Screen
                name='SettingScreen'
                component={SettingScreen}
                options={{
                    tabBarLabel: '설정',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="settings" size={size ?? 24} color={color ?? '#FFB74D'} />
                    ),
                }}
            />
        </BottomTab.Navigator>
    )
}
export default TabNavigation