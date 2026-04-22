import React from 'react';
import { Pressable, StyleSheet, Text, View, type PressableProps } from 'react-native';
import { Meal } from '../types';
import { theme } from '../theme';

type Props = Omit<PressableProps, 'style'> & {
  meal: Meal;
};

export function MealCard({ meal, ...rest }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      {...rest}
    >
      <View style={styles.leftColumn}>
        <View style={styles.timePill}>
          <Text style={styles.timeText}>{meal.time}</Text>
        </View>
        <Text style={styles.name}>{meal.name}</Text>
      </View>
      <View style={[styles.dot, meal.inDiet ? styles.dotInside : styles.dotOutside]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: theme.colors.card,
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  pressed: {
    opacity: 0.95,
  },
  leftColumn: {
    flex: 1,
    marginRight: 12,
  },
  timePill: {
    backgroundColor: theme.colors.background,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  timeText: {
    color: theme.colors.subtitle,
    fontSize: 12,
    fontWeight: '700',
  },
  name: {
    color: theme.colors.title,
    fontSize: 16,
    fontWeight: '700',
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  dotInside: {
    backgroundColor: theme.colors.success,
  },
  dotOutside: {
    backgroundColor: theme.colors.danger,
  },
});
