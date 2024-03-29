//import { useNavigation } from '@react-navigation/core'
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import { auth } from '../firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { LinearGradient } from "expo-linear-gradient";
import { getFirestore, collection, addDoc } from 'firebase/firestore';



const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigation = useNavigation()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        navigation.replace("Home")
      }
    })

    return unsubscribe
  }, [])

  const handleSignUp = async () => {
    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Registered with:', user.email);
  
      // Create user document in Firestore
      const db = getFirestore();
      const usersCollection = collection(db, 'users');
  
      // Customize the fields you want to add to the user document
      const userFields = {
        email: user.email,
        // Add more fields as needed
      };
  
      const newUserDocRef = await addDoc(usersCollection, userFields);
  
      console.log('User created with ID:', newUserDocRef.id);
  
      // Create 'snacks' collection for the user
      const snacksCollectionRef = collection(db, 'users', newUserDocRef.id, 'snacks');
      const breakfastCollectionRef = collection(db, 'users', newUserDocRef.id, 'breakfast');
      const lunchCollectionRef = collection(db, 'users', newUserDocRef.id, 'lunch');
      const dinnerCollectionRef = collection(db, 'users', newUserDocRef.id, 'dinner');
      const desertCollectionRef = collection(db, 'users', newUserDocRef.id, 'desert');
      const exerciseCollectionRef = collection(db, 'users', newUserDocRef.id, 'exercise');
  
     
      const values = {
        name: '',
        calories: 0,
        quantity: null,
      };
  
      
      await addDoc(snacksCollectionRef, values);
      await addDoc(breakfastCollectionRef, values);
      await addDoc(lunchCollectionRef, values);
      await addDoc(dinnerCollectionRef, values);
      await addDoc(desertCollectionRef, values);
      await addDoc(exerciseCollectionRef, values);
  
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogin = () => { 

    signInWithEmailAndPassword(auth, email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log('Logged in with:', user.email);
      })
      .catch(error => alert(error.message))
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
    >


      <Image
        source={require('../assets/nutrinow-logo.png')}
        style={{ width: 200, height: 205 }}
      />
      <Text></Text>

      <View style={styles.inputContainer}>
      <Text style={{ fontStyle: 'italic' }}>Please Sign in or register</Text>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          style={styles.input}
          secureTextEntry
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleLogin}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Login</Text>
        </TouchableOpacity>
        <Text> </Text>
        <Text>OR</Text>
        <Text> </Text>
        <TouchableOpacity
          onPress={handleSignUp}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Register</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  inputContainer: {
    width: '80%'
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  button: {
    backgroundColor: 'black',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    
  },
  buttonOutline: {
    backgroundColor: '#d2ffcf',
    marginTop: 5,
    borderColor: '#4dc445',
    borderWidth: 2,
  },
 
  buttonOutlineText: {
    color: '#4dc445',
    fontWeight: '700',
    fontSize: 16,
  },
})