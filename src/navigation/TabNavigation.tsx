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
                tabBarActiveTintColor: '#FF8F00',
                tabBarInactiveTintColor: '#FFB74D',
                tabBarStyle: {
                    backgroundColor: '#FFF8E1',
                    borderTopWidth: 1,
                    borderTopColor: '#FFE082',
                    paddingBottom: 5,
                    paddingTop: 5,
                    height: 60,
                    shadowColor: '#FFC107',
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                    elevation: 5,
                }
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