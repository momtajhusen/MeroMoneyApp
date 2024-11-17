import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../themes/ThemeContext';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { rw, rh, rf } from '../../themes/responsive'; // Responsive helpers

const TermsAndConditionsScreen = ({ navigation }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.primary }]}>
      {/* Header with Glass Design */}
      <View style={[styles.headerContainer, { backgroundColor: theme.secondary }]}>
        <Text style={styles.headerText}>
          <FontAwesome name="file-text-o" size={24} color="#ffffff" /> Terms & Conditions
        </Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={[styles.scrollContainer, { backgroundColor: theme.primary }]}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Welcome Message */}
        <View style={[styles.card, { backgroundColor: theme.secondary, borderColor: theme.border }]}>
          <Text style={styles.welcomeText}>
            Welcome to MeroMoney! Please read our Terms & Conditions carefully before using our app. By using MeroMoney, you agree to abide by these terms. If you disagree, please discontinue use.
          </Text>
        </View>

        {/* Sections with icons */}
        {[
          {
            title: 'Acceptance of Terms:',
            icon: 'check-circle',
            content: 'By downloading or using MeroMoney, you agree to the terms specified here. MeroMoney provides an educational platform for managing personal finances but does not replace professional financial advice. Use the app at your discretion, understanding that it is meant for learning purposes.',
          },
          {
            title: 'Educational Purpose Disclaimer:',
            icon: 'info-circle',
            content: 'MeroMoney is for personal education and informational use. It is not designed to offer financial services, guarantees, or comprehensive data security. Any financial calculations provided should be double-checked before making financial decisions.',
          },
          {
            title: 'User Responsibilities:',
            icon: 'user',
            content: 'Please manage your account and data responsibly. Since MeroMoney is a learning app, it may not fully protect sensitive data. Avoid storing confidential financial details, and exercise caution to ensure your data remains secure.',
          },
          {
            title: 'Financial Data Policy:',
            icon: 'dollar',
            content: 'MeroMoney is not accountable for any financial losses or errors. The app’s calculations and suggestions are educational only and are not intended to replace professional financial planning or investment advice.',
          },
          {
            title: 'Non-Commercial Use:',
            icon: 'lock',
            content: 'This app is solely for personal, non-commercial use. You agree not to sell, modify, or distribute MeroMoney for commercial purposes without the developer’s permission. Unauthorized distribution is prohibited.',
          },
          {
            title: 'Updates to Terms:',
            icon: 'refresh',
            content: 'We may revise these terms to reflect app improvements or changes. If you continue using the app after an update, you agree to abide by the new terms. You can review the latest version in the “Settings” menu.',
          },
          {
            title: 'Contact & Feedback:',
            icon: 'envelope',
            content: 'We value your input! For any feedback, suggestions, or questions, please reach out to us. Your feedback helps us improve the MeroMoney experience and make it more beneficial for everyone.',
          },
        ].map((section, index) => (
          <Animatable.View
            key={index}
            style={[styles.card, { backgroundColor: theme.secondary, borderColor: theme.border }]}
            animation="fadeInUp"
            duration={500} // Animation duration
            delay={index * 100} // Stagger animation
          >
            <View style={styles.sectionHeader}>
              <FontAwesome name={section.icon} size={rw(5)} color="#bb86fc" style={{ marginRight: rw(2) }} />
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            <Text style={styles.sectionContent}>{section.content}</Text>
          </Animatable.View>
        ))}
      </ScrollView>

      {/* Agree Button with Glass Effect */}
      {/* <TouchableOpacity
        style={styles.agreeButton}
        onPress={() => navigation.navigate('HomeScreen')}
      >
        <Text style={styles.agreeButtonText}>Agree and Continue</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  headerContainer: {
    paddingVertical: rh(3),
    paddingHorizontal: rw(5),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(30, 30, 30, 0.8)', // Dark glass effect for header
    backdropFilter: 'blur(10px)',
    elevation: 10,
  },
  headerText: {
    color: '#ffffff',
    fontSize: rf(2.5),
    fontWeight: 'bold',
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  scrollContainer: {
    paddingHorizontal: rw(4),
    marginTop: rh(1),
  },
  welcomeText: {
    fontSize: rf(1.8),
    color: '#e0e0e0',
    marginBottom: rh(1),
    lineHeight: rh(2.5),
  },
  card: {
    padding: rw(4),
    borderRadius: 10,
    marginBottom: rh(2),
    borderWidth: 1,
    backgroundColor: 'rgba(40, 40, 40, 0.85)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: rh(0.5),
  },
  sectionTitle: {
    fontSize: rf(1.8),
    fontWeight: 'bold',
    color: '#bb86fc', // Vibrant accent color for titles
  },
  sectionContent: {
    fontSize: rf(1.5),
    color: '#b0b0b0',
    lineHeight: rh(2.5),
  },
  agreeButton: {
    position: 'absolute',
    bottom: rh(3),
    left: rw(4),
    right: rw(4),
    paddingVertical: rh(2),
    borderRadius: 30,
    alignItems: 'center',
    backgroundColor: 'rgba(3, 218, 198, 0.7)',
    backdropFilter: 'blur(5px)',
    elevation: 5,
  },
  agreeButtonText: {
    color: '#ffffff',
    fontSize: rf(1.8),
    fontWeight: 'bold',
  },
});

export default TermsAndConditionsScreen;
