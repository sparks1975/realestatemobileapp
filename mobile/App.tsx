import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Appearance } from 'react-native';

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

// Custom Dark Theme
const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#007AFF',
    background: '#121212',
    card: '#1E1E1E',
    text: '#FFFFFF',
    border: '#2C2C2C',
  },
};

// Create stack navigators for each tab that needs detail screens
const PropertiesStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#1E1E1E',
      },
      headerTintColor: '#FFFFFF',
    }}
  >
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
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#1E1E1E',
      },
      headerTintColor: '#FFFFFF',
    }}
  >
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
  // Dark mode is forced through app.json configuration
  // No need to set it programmatically which can cause issues
  
  return (
    <SafeAreaProvider>
      <NavigationContainer theme={CustomDarkTheme}>
        <StatusBar style="light" />
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: '#007AFF',
            tabBarInactiveTintColor: '#8E8E93',
            tabBarStyle: {
              backgroundColor: '#1E1E1E',
              borderTopWidth: 1,
              borderTopColor: '#2C2C2C',
              paddingTop: 10,
              height: 60,
            },
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '500',
              marginBottom: 5,
            },
            headerStyle: {
              backgroundColor: '#1E1E1E',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.3,
              shadowRadius: 2,
              elevation: 3,
            },
            headerTitleStyle: {
              fontWeight: '600',
              fontSize: 17,
              color: '#FFFFFF',
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