import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, SafeAreaView, Linking, Platform } from 'react-native';

const ProfileScreen = () => {
  // Mock user data
  const user = {
    id: 1,
    name: 'Alex Morgan',
    email: 'alex@example.com',
    phone: '555-987-6543',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc494a43e?auto=format&fit=crop&w=500&h=500',
    role: 'Real Estate Agent',
    company: 'Luxury Real Estate Group',
    bio: 'Dedicated real estate professional with over 10 years of experience in luxury properties and high-end real estate market.',
    stats: {
      propertiesSold: 142,
      totalValue: '$86M',
      clients: 64,
    },
    website: 'www.alexmorgan-realestate.com',
  };
  
  const menuItems = [
    { icon: '🏠', title: 'My Listings', count: 24 },
    { icon: '📝', title: 'Contracts', count: 8 },
    { icon: '💰', title: 'Sales Activity', count: null },
    { icon: '📊', title: 'Analytics', count: null },
    { icon: '⚙️', title: 'Settings', count: null },
    { icon: '❓', title: 'Help & Support', count: null },
  ];

  const openAdminPanel = async () => {
    const adminUrl = Platform.OS === 'web' 
      ? '/admin'
      : 'https://realtor-dashboard-with-mobile-app.replit.app/admin';
    
    const canOpen = await Linking.canOpenURL(adminUrl);
    if (canOpen) {
      await Linking.openURL(adminUrl);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.adminButton} onPress={openAdminPanel}>
          <Text style={styles.adminButtonText}>🎛️ Open Admin Panel</Text>
        </TouchableOpacity>
        
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: user.profileImage }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.role}>{user.role}</Text>
            <Text style={styles.company}>{user.company}</Text>
          </View>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.stats.propertiesSold}</Text>
            <Text style={styles.statLabel}>Properties Sold</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.stats.totalValue}</Text>
            <Text style={styles.statLabel}>Total Value</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.stats.clients}</Text>
            <Text style={styles.statLabel}>Clients</Text>
          </View>
        </View>
        
        <View style={styles.bioSection}>
          <Text style={styles.bioHeading}>About Me</Text>
          <Text style={styles.bioText}>{user.bio}</Text>
        </View>
        
        <View style={styles.contactSection}>
          <Text style={styles.contactHeading}>Contact Information</Text>
          <View style={styles.contactItem}>
            <Text style={styles.contactLabel}>Email</Text>
            <Text style={styles.contactValue}>{user.email}</Text>
          </View>
          <View style={styles.contactItem}>
            <Text style={styles.contactLabel}>Phone</Text>
            <Text style={styles.contactValue}>{user.phone}</Text>
          </View>
          <View style={styles.contactItem}>
            <Text style={styles.contactLabel}>Website</Text>
            <Text style={styles.contactValue}>{user.website}</Text>
          </View>
        </View>
        
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Text style={styles.menuItemIcon}>{item.icon}</Text>
                <Text style={styles.menuItemTitle}>{item.title}</Text>
              </View>
              {item.count !== null && (
                <View style={styles.menuItemBadge}>
                  <Text style={styles.menuItemBadgeText}>{item.count}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
        
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
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
  adminButton: {
    backgroundColor: '#3B5674',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  adminButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileInfo: {
    marginLeft: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
  },
  role: {
    fontSize: 16,
    color: '#6B6B6B',
    marginTop: 2,
  },
  company: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B6B6B',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E5EA',
    marginHorizontal: 8,
  },
  bioSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  bioHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  bioText: {
    fontSize: 14,
    color: '#6B6B6B',
    lineHeight: 20,
  },
  contactSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  contactHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 12,
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  contactLabel: {
    fontSize: 14,
    color: '#6B6B6B',
  },
  contactValue: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  menuSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 8,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  menuItemTitle: {
    fontSize: 16,
    color: '#000',
  },
  menuItemBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  menuItemBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  logoutButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;