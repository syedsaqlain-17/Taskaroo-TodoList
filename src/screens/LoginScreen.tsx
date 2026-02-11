import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import CustomButton from '../components/CustomButton';
import auth from '@react-native-firebase/auth';

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Taskaroo', 'Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      await auth().signInWithEmailAndPassword(email, password);
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Taskaroo', 'Please fill all fields');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Taskaroo', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await auth().createUserWithEmailAndPassword(email, password);
      Alert.alert('Success', 'Welcome to Taskaroo! Account created.');
    } catch (error: any) {
      Alert.alert('Register Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#F0FDF4" />
      
      <View style={styles.content}>
        {/* LOGO SECTION */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoEmoji}>📝</Text>
          <Text style={styles.title}>Taskaroo</Text>
          <View style={styles.motoBadge}>
            <Text style={styles.subtitle}>“Write it. Tick it. Win it.” ✅</Text>
          </View>
        </View>

        {/* INPUTS SECTION */}
        <View style={styles.formCard}>
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#94A3B8"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#94A3B8"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <View style={styles.buttonGap}>
            <CustomButton
              title={loading ? "Verifying..." : "LOGIN"}
              onPress={handleLogin}
              disabled={loading}
            />
          </View>

          <CustomButton
            title={loading ? "Registering..." : "CREATE ACCOUNT"}
            type="secondary"
            onPress={handleRegister}
            disabled={loading}
          />
        </View>

        <Text style={styles.footer}>Organize with Taskaroo v1.0</Text>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FDF4', // Matches the light green home theme
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 25,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoEmoji: {
    fontSize: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: '#166534', // Forest Green
    textAlign: 'center',
    letterSpacing: 1,
  },
  motoBadge: {
    backgroundColor: '#DCFCE7',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginTop: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#15803D',
    fontWeight: '600',
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 25,
    elevation: 10, // Shadow for Android
    shadowColor: '#166534', // Shadow for iOS
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 15,
    padding: 16,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    color: '#1E293B',
  },
  buttonGap: {
    marginBottom: 12,
    marginTop: 5,
  },
  footer: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 40,
    fontWeight: '500',
  },
});

export default LoginScreen;