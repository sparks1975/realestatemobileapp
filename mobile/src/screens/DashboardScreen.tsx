import React from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const DashboardScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>April 23, 2025</Text>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Portfolio Value</Text>
          <Text style={styles.portfolioValue}>$8.2M</Text>
          <Text style={styles.portfolioChange}>+2.4%</Text>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>24</Text>
            <Text style={styles.statLabel}>Active Listings</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statLabel}>Pending Sales</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Closed Sales</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>New Leads</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Text>📝</Text>
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>New listing added</Text>
              <Text style={styles.activityDescription}>5 Bed Villa on 789 Sunset Dr</Text>
              <Text style={styles.activityTime}>2 hours ago</Text>
            </View>
          </View>
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Text>💬</Text>
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>New message from David Miller</Text>
              <Text style={styles.activityDescription}>Hey, are we still meeting today at 3pm?</Text>
              <Text style={styles.activityTime}>4 hours ago</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Appointments</Text>
          <View style={styles.appointmentCard}>
            <Text style={styles.appointmentTime}>10:00 AM</Text>
            <View style={styles.appointmentContent}>
              <Text style={styles.appointmentTitle}>Property Viewing</Text>
              <Text style={styles.appointmentLocation}>123 Luxury Ave, Beverly Hills</Text>
              <Text style={styles.appointmentClient}>with Sarah Johnson</Text>
            </View>
          </View>
          <View style={styles.appointmentCard}>
            <Text style={styles.appointmentTime}>3:00 PM</Text>
            <View style={styles.appointmentContent}>
              <Text style={styles.appointmentTitle}>Client Meeting</Text>
              <Text style={styles.appointmentLocation}>Coffee Shop, 456 Main St</Text>
              <Text style={styles.appointmentClient}>with David Miller</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B6B6B',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation:
    3,
  },
  cardTitle: {
    fontSize: 14,
    color: '#6B6B6B',
    marginBottom: 8,
  },
  portfolioValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000',
  },
  portfolioChange: {
    fontSize: 16,
    fontWeight: '500',
    color: '#34C759',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },
  statLabel: {
    fontSize: 14,
    color: '#6B6B6B',
    marginTop: 4,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 12,
  },
  activityItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  activityDescription: {
    fontSize: 14,
    color: '#6B6B6B',
    marginTop: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },
  appointmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  appointmentTime: {
    width: 80,
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  appointmentContent: {
    flex: 1,
  },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  appointmentLocation: {
    fontSize: 14,
    color: '#6B6B6B',
    marginTop: 2,
  },
  appointmentClient: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
});

export default DashboardScreen;