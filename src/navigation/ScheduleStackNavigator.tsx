import { createStackNavigator } from "@react-navigation/stack";
import {
    ScheduleScreen,
    CalendarScreen,
    RoutineFormScreen,
    RoutineScreen,
    TaskListFormScreen,
    TaskListScreen
} from '../screens'

export type ScheduleStackParamList = {
    ScheduleScreen: undefined,
    CalendarScreen: undefined,
    RoutineFormScreen: undefined,
    RoutineScreen: undefined,
    TaskListFormScreen: undefined,
    TaskListScreen: undefined
}


const Stack = createStackNavigator<ScheduleStackParamList>()

const ScheduleStackNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ScheduleScreen" component={ScheduleScreen} />
            <Stack.Screen name="CalendarScreen" component={CalendarScreen} />
            <Stack.Screen name="RoutineFormScreen" component={RoutineFormScreen} />
            <Stack.Screen name="RoutineScreen" component={RoutineScreen} />
            <Stack.Screen name="TaskListFormScreen" component={TaskListFormScreen} />
            <Stack.Screen name="TaskListScreen" component={TaskListScreen} />
        </Stack.Navigator>
    )
}

export default ScheduleStackNavigator