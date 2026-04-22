import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { enableScreens } from 'react-native-screens';
import { MealsProvider } from './src/contexts/MealsContext';
import { theme } from './src/theme';
import { Home } from './src/screens/Home';
import { MealForm } from './src/screens/MealForm';
import { MealDetails } from './src/screens/MealDetails';
import { Stats } from './src/screens/Stats';
import { Feedback } from './src/screens/Feedback';

enableScreens();

type RootStackParamList = {
  Home: undefined;
  MealForm: { mealId?: string; mode: 'create' | 'edit' };
  MealDetails: { mealId: string };
  Stats: undefined;
  Feedback: { inDiet: boolean; label: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <MealsProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: theme.colors.background },
          }}
        >
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="MealForm" component={MealForm} />
          <Stack.Screen name="MealDetails" component={MealDetails} />
          <Stack.Screen name="Stats" component={Stats} />
          <Stack.Screen name="Feedback" component={Feedback} />
        </Stack.Navigator>
      </NavigationContainer>
    </MealsProvider>
  );
}
