import { createStackNavigator } from "@react-navigation/stack"
import {
    ScheduleScreen,
    RoutineFormScreen,
    TodoFormScreen,
    EventFormScreen
} from '../screens'

export type ScheduleStackParamList = {
    ScheduleScreen: undefined,
    RoutineFormScreen: undefined,
    TodoFormScreen: undefined,
    EventFormScreen: undefined
}

const Stack = createStackNavigator<ScheduleStackParamList>()

const ScheduleStackNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ScheduleScreen" component={ScheduleScreen} />
            <Stack.Screen name="RoutineFormScreen" component={RoutineFormScreen} />
            <Stack.Screen name="TodoFormScreen" component={TodoFormScreen} />
            <Stack.Screen name="EventFormScreen" component={EventFormScreen} />
        </Stack.Navigator>
    )
}

export default ScheduleStackNavigator