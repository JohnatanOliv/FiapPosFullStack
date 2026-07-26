import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import { UserProvider } from './src/context/UserContext';
import { colors } from './src/styles/colors';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import StudentDashboardScreen from './src/screens/StudentDashboardScreen';
import TeacherLoginScreen from './src/screens/TeacherLoginScreen';
import TeacherDashboardScreen from './src/screens/TeacherDashboardScreen';

const Stack = createNativeStackNavigator();

function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: colors.bg },
        animationEnabled: true,
        gestureEnabled: true,
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ animationEnabled: false }}
      />
      <Stack.Screen
        name="StudentDashboard"
        component={StudentDashboardScreen}
        options={{ animationTypeForReplace: 'fade' }}
      />
      <Stack.Screen
        name="TeacherLogin"
        component={TeacherLoginScreen}
        options={{ animationTypeForReplace: 'fade' }}
      />
      <Stack.Screen
        name="TeacherDashboard"
        component={TeacherDashboardScreen}
        options={{ animationTypeForReplace: 'fade' }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <AppStack />
        <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      </NavigationContainer>
    </UserProvider>
  );
}
