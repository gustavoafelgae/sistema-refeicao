import React, { useMemo } from 'react';
import {
  Pressable,
  SafeAreaView,
  SectionList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMeals } from '../contexts/MealsContext';
import { MealCard } from '../components/MealCard';
import { Button } from '../components/Button';
import { theme } from '../theme';

type RootStackParamList = {
  Home: undefined;
  MealForm: { mealId?: string; mode: 'create' | 'edit' };
  MealDetails: { mealId: string };
  Stats: undefined;
  Feedback: { inDiet: boolean; label: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export function Home() {
  const navigation = useNavigation<NavigationProp>();
  const { meals } = useMeals();

  const totalMeals = meals.length;
  const mealsInside = meals.filter((meal) => meal.inDiet).length;
  const percentInside = totalMeals ? Math.round((mealsInside / totalMeals) * 100) : 0;
  const isInsidePositive = percentInside >= 70;

  const sections = useMemo(() => {
    const grouped: Record<string, typeof meals> = {};

    meals
      .slice()
      .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.time.localeCompare(b.time)))
      .forEach((meal) => {
        if (!grouped[meal.date]) {
          grouped[meal.date] = [];
        }
        grouped[meal.date].push(meal);
      });

    return Object.entries(grouped).map(([date, data]) => ({ title: date, data }));
  }, [meals]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.topSection, isInsidePositive ? styles.topSectionInside : styles.topSectionOutside]}>
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <Ionicons name='restaurant' size={24} color={theme.colors.title} />
            <Text style={styles.logoTitle}>Daily Diet</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>GA</Text>
          </View>
        </View>

        <View style={styles.summaryCardWrapper}>
          <View style={[styles.summaryCard, isInsidePositive ? styles.summaryCardInside : styles.summaryCardOutside]}>
            <Text style={styles.summaryLabel}>das refeições dentro da dieta</Text>
            <Text style={styles.summaryValue}>{percentInside}%</Text>
            <View style={styles.summaryBottom}>
              <Text style={styles.summarySubtext}>{totalMeals} refeição{totalMeals === 1 ? '' : 's'}</Text>
              <Ionicons
                name={isInsidePositive ? 'arrow-up' : 'arrow-down'}
                size={18}
                color={theme.colors.title}
              />
            </View>
          </View>
        </View>
      </View>

      <View style={styles.contentArea}>
        <View style={styles.mealsHeader}>
          <Text style={styles.mealsTitle}>Refeições</Text>
          <Button
            label='+ Nova refeição'
            variant='primary'
            onPress={() => navigation.navigate('MealForm', { mode: 'create' })}
            style={styles.newButton}
          />
        </View>

        {sections.length === 0 ? (
          <Text style={styles.emptyText}>Você ainda não registrou nenhuma refeição.</Text>
        ) : (
          <SectionList
            sections={sections}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <MealCard
                meal={item}
                onPress={() => navigation.navigate('MealDetails', { mealId: item.id })}
              />
            )}
            renderSectionHeader={({ section: { title } }) => (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{title}</Text>
              </View>
            )}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.grayBackground,
  },
  topSection: {
    paddingBottom: 30,
    paddingTop: 20,
  },
  topSectionInside: {
    backgroundColor: theme.colors.primaryLight,
  },
  topSectionOutside: {
    backgroundColor: theme.colors.dangerLight,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: theme.colors.title,
    marginLeft: 10,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: theme.colors.title,
    fontWeight: '900',
  },
  summaryCardWrapper: {
    paddingHorizontal: 24,
    marginTop: 8,
  },
  summaryCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  summaryCardInside: {
    backgroundColor: theme.colors.surface,
  },
  summaryCardOutside: {
    backgroundColor: theme.colors.surface,
  },
  summaryLabel: {
    color: theme.colors.subtitle,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 14,
  },
  summaryValue: {
    color: theme.colors.title,
    fontSize: 42,
    fontWeight: '900',
    marginBottom: 14,
  },
  summaryBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summarySubtext: {
    color: theme.colors.subtitle,
    fontSize: 14,
    fontWeight: '600',
  },
  contentArea: {
    flex: 1,
    marginTop: -20,
    paddingTop: 24,
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  mealsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  mealsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.title,
  },
  newButton: {
    borderRadius: 16,
    paddingHorizontal: 18,
  },
  sectionHeader: {
    marginBottom: 10,
    paddingHorizontal: 24,
    marginTop: 16,
  },
  sectionTitle: {
    color: theme.colors.subtitle,
    fontSize: 13,
    fontWeight: '600',
  },
  emptyText: {
    color: theme.colors.subtitle,
    textAlign: 'center',
    marginTop: 48,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
});
