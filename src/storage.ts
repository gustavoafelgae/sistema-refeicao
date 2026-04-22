import AsyncStorage from '@react-native-async-storage/async-storage';
import { Meal } from './types';

const MEALS_KEY = '@sistema_refeicao:meals';

export async function loadMeals(): Promise<Meal[]> {
  try {
    const stored = await AsyncStorage.getItem(MEALS_KEY);
    return stored ? (JSON.parse(stored) as Meal[]) : [];
  } catch (error) {
    console.error('Failed to load meals', error);
    return [];
  }
}

export async function saveMeals(meals: Meal[]) {
  try {
    await AsyncStorage.setItem(MEALS_KEY, JSON.stringify(meals));
  } catch (error) {
    console.error('Failed to save meals', error);
  }
}
