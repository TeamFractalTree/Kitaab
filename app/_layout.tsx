import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { COLORS } from "./styles/theme";
import {
  createStaticNavigation,
  NavigationContainer,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TeacherDashboard from "./teacher/dashboard";
import TeacherLogin from "./teacher/login";
import StudentLogin from "./student/login";
import Home from "./index";
import StudentDashboard from "./student/dashboard";
import Forum from "./teacher/forum";
import { FIREBASE_AUTH } from "@/FirebaseConfig";
import { Stack, useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { ActivityIndicator, LogBox } from "react-native";


import { secureStorage } from "./utils/secureStorage";
import ClassDetail from "./teacher/class/[id]";

LogBox.ignoreLogs([
  "Warning: ...", // Add specific warning messages here
  "Deprecated: ...",
]);

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await secureStorage.getItem('userToken');
      if (!token) {
        router.replace('/');
        return;
      }
      // Verify token with Firebase
      return onAuthStateChanged(FIREBASE_AUTH, (user) => {
        setUser(user);
        setLoading(false);
        if (!user) {
          secureStorage.removeItem('userToken');
          router.replace('/');
        }
      });
    };

    checkAuth();
  }, []);

  if (loading) return <ActivityIndicator />;
  return user ? children : null;
}

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="student/login" options={{ headerShown: false }} />
      <Stack.Screen name="teacher/login" options={{ headerShown: false }} />
      <Stack.Screen 
        name="teacher/dashboard" 
        options={{ 
          headerShown: false,
          gestureEnabled: false,
        }} 
      />
      <Stack.Screen 
        name="teacher/profile" 
        options={{ 
          headerShown: false,
          gestureEnabled: false,
        }} 
      />
      <Stack.Screen 
        name="student/dashboard" 
        options={{ 
          headerShown: false,
          gestureEnabled: false,
        }} 
      />

      <Stack.Screen
        name="teacher/forum"
        options={{ title: "Teacher Forum" }}
      />
      <Stack.Screen
        name="student/dashboard"
        options={{ title: "Student Dashboard" }}
      />
      <Stack.Screen
        name="teacher/class/[id]"
        options={{ title: "Class Details" }}
      />
      <Stack.Screen 
        name="student/profile" 
        options={{ 
          headerShown: false,
          gestureEnabled: false,
        }} 
      />
      <Stack.Screen 
        name="student/classes" 
        options={{ 
          headerShown: false,
          gestureEnabled: false,
        }} 
      />
      <Stack.Screen 
        name="student/resources" 
        options={{ 
          headerShown: false,
          gestureEnabled: false,
        }} 
      />
    </Stack>

  

  );
}
