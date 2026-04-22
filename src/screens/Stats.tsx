import React, { useMemo } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMeals } from '../contexts/MealsContext';
import { theme } from '../theme';

type RootStackParamList = {
  Home: undefined;
  Stats: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Stats'>;

export function Stats() {
  const navigation = useNavigation<NavigationProp>();
  const { meals } = useMeals();

  const { total, inside, outside, percentInside, bestSequence } = useMemo(() => {
    const sorted = [...meals].sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.time.localeCompare(b.time);
    });

    let bestSequence = 0;
    let currentSequence = 0;

    sorted.forEach((meal) => {
      if (meal.inDiet) {
        currentSequence += 1;
        bestSequence = Math.max(bestSequence, currentSequence);
      } else {
        currentSequence = 0;
      }
    });

    const total = meals.length;
    const inside = meals.filter((meal) => meal.inDiet).length;
    const outside = total - inside;
    return {
      total,
      inside,
      outside,
      percentInside: total ? Math.round((inside / total) * 100) : 0,
      bestSequence,
    };
  }, [meals]);

  const message = percentInside >= 70 ? 'Excelente progresso!' : percentInside >= 40 ? 'Mantenha o foco!' : 'Vamos recuperar a dieta!';

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.topHeader, percentInside >= 70 ? styles.topHeaderInside : styles.topHeaderOutside]}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name='chevron-back' size={24} color={theme.colors.title} />
        </Pressable>
        <Text style={styles.title}>Estatísticas</Text>
      </View>

      <View style={[styles.percentCard, percentInside >= 70 ? styles.percentCardInside : styles.percentCardOutside]}>
        <Text style={styles.label}>das refeições dentro da dieta</Text>
        <Text style={styles.percentValue}>{percentInside}%</Text>
        <Text style={styles.subText}>{message}</Text>
      </View>

      <View style={styles.contentCard}>
        <Text style={styles.sectionTitle}>Estatísticas gerais</Text>
        <View style={styles.statRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Melhor sequência</Text>
            <Text style={styles.statValue}>{bestSequence}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Refeições registradas</Text>
            <Text style={styles.statValue}>{total}</Text>
          </View>
        </View>
        <View style={styles.statRow}>
          <View style={[styles.statCard, styles.statCardHighlight]}>
            <Text style={styles.statLabel}>Dentro da dieta</Text>
            <Text style={styles.statValue}>{inside}</Text>
          </View>
          <View style={[styles.statCard, styles.statCardHighlightOutside]}>
            <Text style={styles.statLabel}>Fora da dieta</Text>
            <Text style={styles.statValue}>{outside}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.grayBackground,
  },
  topHeader: {
    height: 190,
    paddingTop: 40,
    paddingHorizontal: 24,
    backgroundColor: theme.colors.primaryLight,
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
  title: {
    color: theme.colors.title,
    fontSize: 24,
    fontWeight: '900',
  },
  percentCard: {
    marginHorizontal: 24,
    marginTop: -28,
    borderRadius: 24,
    padding: 24,
    backgroundColor: theme.colors.surface,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  percentCardInside: {},
  percentCardOutside: {},
  label: {
    color: theme.colors.subtitle,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
  percentValue: {
    color: theme.colors.title,
    fontSize: 42,
    fontWeight: '900',
    marginBottom: 12,
  },
  subText: {
    color: theme.colors.subtitle,
    fontSize: 14,
    fontWeight: '600',
  },
  contentCard: {
    marginTop: 18,
    marginHorizontal: 24,
    marginBottom: 24,
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  sectionTitle: {
    color: theme.colors.subtitle,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 18,
    textAlign: 'center',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statCard: {
    width: '48%',
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  statCardHighlight: {
    backgroundColor: theme.colors.primaryLight,
  },
  statCardHighlightOutside: {
    backgroundColor: theme.colors.dangerLight,
  },
  statLabel: {
    color: theme.colors.subtitle,
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '600',
  },
  statValue: {
    color: theme.colors.title,
    fontSize: 24,
    fontWeight: '900',
  },
});
