import { createStackNavigator } from "@react-navigation/stack"
import {
    ScheduleScreen,
    CalendarScreen,
    RoutineScreen,
    RoutineFormScreen,
    TodoScreen,
    TodoFormScreen,
    EventScreen,
    EventFormScreen
} from '../screens'

export type ScheduleStackParamList = {
    ScheduleScreen: undefined,
    CalendarScreen: undefined,
    RoutineScreen: undefined,
    RoutineFormScreen: undefined,
    TodoScreen: undefined,
    TodoFormScreen: undefined,
    EventScreen: undefined,
    EventFormScreen: undefined
}

const Stack = createStackNavigator<ScheduleStackParamList>()

const ScheduleStackNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ScheduleScreen" component={ScheduleScreen} />
            <Stack.Screen name="CalendarScreen" component={CalendarScreen} />
            <Stack.Screen name="RoutineScreen" component={RoutineScreen} />
            <Stack.Screen name="RoutineFormScreen" component={RoutineFormScreen} />
            <Stack.Screen name="TodoScreen" component={TodoScreen} />
            <Stack.Screen name="TodoFormScreen" component={TodoFormScreen} />
            <Stack.Screen name="EventScreen" component={EventScreen} />
            <Stack.Screen name="EventFormScreen" component={EventFormScreen} />
        </Stack.Navigator>
    )
}

export default ScheduleStackNavigator