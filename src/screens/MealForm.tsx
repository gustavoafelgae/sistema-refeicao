import React, { useEffect, useMemo, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMeals } from '../contexts/MealsContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Meal } from '../types';
import { theme } from '../theme';

type RootStackParamList = {
  MealForm: { mealId?: string; mode: 'create' | 'edit' };
  Feedback: { inDiet: boolean; label: string };
};

type MealFormRouteProp = RouteProp<RootStackParamList, 'MealForm'>;

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'MealForm'>;

export function MealForm() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<MealFormRouteProp>();
  const { mealId, mode } = route.params;
  const { addMeal, getMealById, updateMeal } = useMeals();

  const meal = useMemo(() => (mealId ? getMealById(mealId) : undefined), [getMealById, mealId]);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [inDiet, setInDiet] = useState(true);

  useEffect(() => {
    if (meal && mode === 'edit') {
      setName(meal.name);
      setDescription(meal.description);
      setDate(meal.date);
      setTime(meal.time);
      setInDiet(meal.inDiet);
    }
  }, [meal, mode]);

  const title = mode === 'edit' ? 'Editar refeição' : 'Nova refeição';

  const handleSave = async () => {
    if (!name.trim() || !date.trim() || !time.trim()) {
      Alert.alert('Atenção', 'Preencha nome, data e horário antes de salvar.');
      return;
    }

    const payload: Omit<Meal, 'id'> = { name: name.trim(), description: description.trim(), date, time, inDiet };

    if (mode === 'edit' && meal) {
      await updateMeal(meal.id, payload);
      navigation.goBack();
      return;
    }

    const created = await addMeal(payload);
    navigation.navigate('Feedback', {
      inDiet: created.inDiet,
      label: created.inDiet ? 'Refeição dentro da dieta' : 'Refeição fora da dieta',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.topHeader, inDiet ? styles.topHeaderInside : styles.topHeaderOutside]}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name='chevron-back' size={24} color={theme.colors.title} />
          </Pressable>
          <Text style={styles.headerTitle}>{title}</Text>
        </View>

        <View style={styles.formCard}>
          <Input label="Nome" value={name} onChangeText={setName} placeholder="Nome da refeição" />
          <Input
            label="Descrição"
            value={description}
            onChangeText={setDescription}
            placeholder="O que foi consumido"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          <View style={styles.rowInputs}>
            <View style={styles.halfInput}>
              <Input label="Data" value={date} onChangeText={setDate} placeholder="12/08/2022" />
            </View>
            <View style={styles.halfInput}>
              <Input label="Hora" value={time} onChangeText={setTime} placeholder="16:00" />
            </View>
          </View>

          <Text style={styles.sectionTitle}>Está dentro da dieta?</Text>
          <View style={styles.toggleRow}>
            <Pressable
              style={({ pressed }) => [
                styles.toggleButton,
                inDiet ? styles.toggleInside : undefined,
                pressed && styles.pressed,
              ]}
              onPress={() => setInDiet(true)}
            >
              <Text style={[styles.toggleLabel, inDiet ? styles.toggleLabelInside : undefined]}>Sim</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.toggleButton,
                !inDiet ? styles.toggleOutside : undefined,
                pressed && styles.pressed,
              ]}
              onPress={() => setInDiet(false)}
            >
              <Text style={[styles.toggleLabel, !inDiet ? styles.toggleLabelOutside : undefined]}>Não</Text>
            </Pressable>
          </View>

          <Button title="Cadastrar refeição" style={styles.actionButton} onPress={handleSave} />
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
  content: {
    paddingBottom: 32,
  },
  topHeader: {
    backgroundColor: theme.colors.surface,
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
  topHeaderInside: {
    backgroundColor: theme.colors.primaryLight,
  },
  topHeaderOutside: {
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
  formCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    padding: 20,
    margin: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  toggleButton: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  toggleInside: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primary,
  },
  toggleOutside: {
    backgroundColor: theme.colors.dangerLight,
    borderColor: theme.colors.danger,
  },
  toggleLabel: {
    color: theme.colors.title,
    fontSize: 14,
    fontWeight: '700',
  },
  toggleLabelInside: {
    color: theme.colors.primary,
  },
  toggleLabelOutside: {
    color: theme.colors.danger,
  },
  sectionTitle: {
    color: theme.colors.subtitle,
    marginBottom: 10,
    fontSize: 14,
    fontWeight: '600',
  },
  actionButton: {
    marginTop: 12,
  },
  pressed: {
    opacity: 0.85,
  },
});
