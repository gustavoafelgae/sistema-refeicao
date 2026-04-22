import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button } from '../components/Button';
import { theme } from '../theme';

type RootStackParamList = {
  Feedback: {
    inDiet: boolean;
    label: string;
  };
  Home: undefined;
};

type FeedbackRouteProp = RouteProp<RootStackParamList, 'Feedback'>;

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Feedback'>;

export function Feedback() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<FeedbackRouteProp>();
  const { inDiet, label } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.feedbackWrapper}>
        <View style={[styles.feedbackCard, inDiet ? styles.feedbackInside : styles.feedbackOutside]}>
          <Text style={styles.message}>{label}</Text>
          <Text style={styles.description}>
            {inDiet
              ? 'Continue assim! Você continua dentro da dieta. Muito bem!'
              : 'Que pena! Você saiu da dieta dessa vez, mas continue se esforçando e não desista!'}
          </Text>
        </View>
        <Button title="Ir para a página inicial" onPress={() => navigation.navigate('Home')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.grayBackground,
  },
  feedbackWrapper: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  feedbackCard: {
    borderRadius: 24,
    padding: 32,
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  feedbackInside: {
    backgroundColor: theme.colors.primaryLight,
  },
  feedbackOutside: {
    backgroundColor: theme.colors.dangerLight,
  },
  message: {
    color: theme.colors.title,
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    color: theme.colors.subtitle,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
  },
});
