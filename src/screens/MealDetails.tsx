import React, { useMemo } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMeals } from '../contexts/MealsContext';
import { Button } from '../components/Button';
import { theme } from '../theme';

type RootStackParamList = {
  MealDetails: { mealId: string };
  MealForm: { mealId?: string; mode: 'create' | 'edit' };
  Home: undefined;
};

type MealDetailsRouteProp = RouteProp<RootStackParamList, 'MealDetails'>;

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'MealDetails'>;

export function MealDetails() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<MealDetailsRouteProp>();
  const { mealId } = route.params;
  const { getMealById, removeMeal } = useMeals();

  const meal = useMemo(() => getMealById(mealId), [getMealById, mealId]);

  if (!meal) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Registro não encontrado</Text>
      </SafeAreaView>
    );
  }

  const handleDelete = () => {
    Alert.alert('Excluir refeição', 'Deseja realmente excluir esta refeição?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sim, excluir',
        style: 'destructive',
        onPress: async () => {
          await removeMeal(meal.id);
          navigation.navigate('Home');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.topHeader, meal.inDiet ? styles.headerInside : styles.headerOutside]}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name='chevron-back' size={24} color={theme.colors.title} />
        </Pressable>
        <Text style={styles.headerTitle}>Refeição</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.detailsCard}>
          <Text style={styles.title}>{meal.name}</Text>
          <Text style={styles.label}>Descrição</Text>
          <Text style={styles.value}>{meal.description || 'Sem descrição'}</Text>
          <Text style={styles.label}>Data e hora</Text>
          <Text style={styles.value}>{`${meal.date} às ${meal.time}`}</Text>
          <Text style={styles.label}>Status</Text>
          <View style={[styles.status, meal.inDiet ? styles.statusInside : styles.statusOutside]}>
            <Text style={styles.statusText}>{meal.inDiet ? 'Dentro da dieta' : 'Fora da dieta'}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Button title="Editar refeição" onPress={() => navigation.navigate('MealForm', { mode: 'edit', mealId: meal.id })} />
          <Button title="Excluir refeição" variant="danger-outline" style={styles.deleteButton} onPress={handleDelete} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.grayBackground,
  },
  topHeader: {
    paddingTop: 40,
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  headerInside: {
    backgroundColor: theme.colors.primaryLight,
  },
  headerOutside: {
    backgroundColor: theme.colors.dangerLight,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  headerTitle: {
    color: theme.colors.title,
    fontSize: 20,
    fontWeight: '900',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 0,
  },
  detailsCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  title: {
    color: theme.colors.title,
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 16,
  },
  label: {
    color: theme.colors.subtitle,
    marginBottom: 4,
    fontSize: 14,
    fontWeight: '600',
  },
  value: {
    color: theme.colors.title,
    marginBottom: 16,
    fontSize: 16,
  },
  status: {
    padding: 14,
    borderRadius: 16,
    marginBottom: 24,
  },
  statusInside: {
    backgroundColor: '#DCFCE7',
  },
  statusOutside: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    color: theme.colors.title,
    fontWeight: '700',
    textAlign: 'center',
  },
  actions: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  deleteButton: {
    marginTop: 12,
    borderRadius: 16,
  },
});
