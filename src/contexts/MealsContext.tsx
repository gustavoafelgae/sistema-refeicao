import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { Meal } from '../types';
import { loadMeals, saveMeals } from '../storage';

type MealInput = Omit<Meal, 'id'>;

type MealsContextData = {
  meals: Meal[];
  loading: boolean;
  addMeal: (meal: MealInput) => Promise<Meal>;
  updateMeal: (id: string, meal: MealInput) => Promise<Meal | undefined>;
  removeMeal: (id: string) => Promise<void>;
  getMealById: (id: string) => Meal | undefined;
};

const MealsContext = createContext<MealsContextData>({} as MealsContextData);

function createMealId() {
  return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

export function MealsProvider({ children }: { children: React.ReactNode }) {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMeals() {
      const stored = await loadMeals();
      setMeals(stored);
      setLoading(false);
    }

    fetchMeals();
  }, []);

  useEffect(() => {
    if (!loading) {
      saveMeals(meals);
    }
  }, [meals, loading]);

  const addMeal = async (mealData: MealInput) => {
    const newMeal: Meal = { id: createMealId(), ...mealData };
    setMeals((prev) => [newMeal, ...prev]);
    return newMeal;
  };

  const updateMeal = async (id: string, mealData: MealInput) => {
    let updatedMeal: Meal | undefined;

    setMeals((prev) =>
      prev.map((meal) => {
        if (meal.id !== id) return meal;
        updatedMeal = { ...meal, ...mealData };
        return updatedMeal;
      }),
    );

    return updatedMeal;
  };

  const removeMeal = async (id: string) => {
    setMeals((prev) => prev.filter((meal) => meal.id !== id));
  };

  const getMealById = (id: string) => meals.find((meal) => meal.id === id);

  const value = useMemo(
    () => ({ meals, loading, addMeal, updateMeal, removeMeal, getMealById }),
    [meals, loading],
  );

  return <MealsContext.Provider value={value}>{children}</MealsContext.Provider>;
}

export function useMeals() {
  const context = useContext(MealsContext);
  if (!context) {
    throw new Error('useMeals must be used within MealsProvider');
  }
  return context;
}
