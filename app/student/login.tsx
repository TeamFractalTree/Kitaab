import { FIREBASE_AUTH } from "@/FirebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { authStyles as styles } from "../styles/components/auth.styles";
import { AuthUtils } from '../utils/auth';
import { secureStorage } from "../utils/secureStorage";

import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
} from "firebase/auth";
import { COLORS } from "../styles/theme";

const Stack = createNativeStackNavigator();

export default function StudentLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  useEffect(() => {
    const loginStatus = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/student/dashboard");
      }
    });
    return () => loginStatus();
  }, []);

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      const token = await response.user.getIdToken();
      await secureStorage.setItem("userToken", token);

      console.log(response);
      alert("Successful signin");
      router.push("/teacher/dashboard");
    } catch (error: any) {
      console.log(error);
      alert(`Sign in Failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async () => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Immediately create user profile with student role after signup
      await AuthUtils.createUserProfile(response.user.uid, email, 'student');
      
      console.log('Student account created:', response.user.email);
      router.replace('/student/dashboard');

    } catch (error: any) {
      console.error('Sign up failed:', error);
      alert(`Sign up Failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={COLORS.text.primary} />
      </TouchableOpacity>

      <Text style={styles.title}>Student Login</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          // value="email"
          placeholder="Student Email"
          placeholderTextColor={COLORS.text.secondary}
          keyboardType="default"
          autoCapitalize="none"
          onChangeText={(text) => setEmail(text)}
        />

        <TextInput
          style={styles.input}
          // value="password"
          placeholder="Password"
          placeholderTextColor={COLORS.text.secondary}
          secureTextEntry
          onChangeText={(text) => setEmail(text)}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/student/dashboard")}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
