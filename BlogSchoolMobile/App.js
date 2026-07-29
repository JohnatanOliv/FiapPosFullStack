import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import { UserProvider } from './src/context/UserContext';
import { colors } from './src/styles/colors';

import HomeScreen from './src/screens/HomeScreen';
import StudentDashboardScreen from './src/screens/StudentDashboardRealScreen';
import StudentLoginScreen from './src/screens/StudentLoginScreen';
import TeacherLoginScreen from './src/screens/TeacherLoginScreen';
import TeacherRegisterScreen from './src/screens/TeacherRegisterScreen';
import TeacherDashboardScreen from './src/screens/TeacherDashboardRealScreen';
import PostDetailsScreen from './src/screens/PostDetailsScreen';
import ManageUsersScreen from './src/screens/ManageUsersScreen';

const Stack = createNativeStackNavigator();

function AppStack() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="StudentLogin" component={StudentLoginScreen} />
      <Stack.Screen name="StudentDashboard" component={StudentDashboardScreen} />
      <Stack.Screen name="TeacherLogin" component={TeacherLoginScreen} />
      <Stack.Screen name="TeacherRegister" component={TeacherRegisterScreen} />
      <Stack.Screen name="TeacherDashboard" component={TeacherDashboardScreen} />
      <Stack.Screen name="PostDetails" component={PostDetailsScreen} />
      <Stack.Screen name="ManageUsers" component={ManageUsersScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <AppStack />
        <StatusBar style="light" backgroundColor={colors.bg} />
      </NavigationContainer>
    </UserProvider>
  );
}