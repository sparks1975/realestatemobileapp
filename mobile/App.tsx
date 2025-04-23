import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import main tab screens
import DashboardScreen from './src/screens/DashboardScreen';
import PropertiesScreen from './src/screens/PropertiesScreen';
import MessagesScreen from './src/screens/MessagesScreen';
import ScheduleScreen from './src/screens/ScheduleScreen';
import ProfileScreen from './src/screens/ProfileScreen';

// Import detail screens
import PropertyDetailsScreen from './src/screens/PropertyDetailsScreen';
import PropertyEditScreen from './src/screens/PropertyEditScreen';
import ChatScreen from './src/screens/ChatScreen';

// Import icons
import { Feather } from '@expo/vector-icons';

// Create the navigators
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Create stack navigators for each tab that needs detail screens
const PropertiesStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="PropertiesList" 
      component={PropertiesScreen} 
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="PropertyDetails" 
      component={PropertyDetailsScreen}
      options={{ title: 'Property Details' }}
    />
    <Stack.Screen 
      name="PropertyEdit" 
      component={PropertyEditScreen}
      options={{ title: 'Edit Property' }}
    />
  </Stack.Navigator>
);

const MessagesStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="MessagesList" 
      component={MessagesScreen} 
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="ChatScreen" 
      component={ChatScreen}
      options={({ route }) => ({ 
        title: route.params?.userName || 'Chat',
      })}
    />
  </Stack.Navigator>
);

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: '#007AFF',
            tabBarInactiveTintColor: '#8E8E93',
            tabBarStyle: {
              backgroundColor: '#FFFFFF',
              borderTopWidth: 1,
              borderTopColor: '#E5E5EA',
              paddingTop: 10,
              height: 60,
            },
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '500',
              marginBottom: 5,
            },
            headerStyle: {
              backgroundColor: '#FFFFFF',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 3,
            },
            headerTitleStyle: {
              fontWeight: '600',
              fontSize: 17,
            },
          }}
        >
          <Tab.Screen 
            name="Dashboard" 
            component={DashboardScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Feather name="home" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen 
            name="Properties" 
            component={PropertiesStack}
            options={{
              headerShown: false,
              tabBarIcon: ({ color, size }) => (
                <Feather name="grid" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen 
            name="Messages" 
            component={MessagesStack}
            options={{
              headerShown: false,
              tabBarIcon: ({ color, size }) => (
                <Feather name="message-circle" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen 
            name="Schedule" 
            component={ScheduleScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Feather name="calendar" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen 
            name="Profile" 
            component={ProfileScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Feather name="user" size={size} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}