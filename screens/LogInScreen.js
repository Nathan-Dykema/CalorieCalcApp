//import { useNavigation } from '@react-navigation/core'
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { auth, db} from '../firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, collection, setDoc } from "firebase/firestore";

import { LinearGradient } from "expo-linear-gradient";


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
      const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredentials.user;
      console.log('Registered with:', user.email);
  
      // Create a collection named "users" and a document for the new user
      const usersCollection = collection(getFirestore(), "users");
      const userDocRef = doc(usersCollection, user.uid);
  
      // Set user properties (you can add more fields as needed)
      await setDoc(userDocRef, {
        email: user.email,
       
      });
  ///////////////////////////////////////////////////////////////////////////////////
      // Create a separate collection named "snacks" for the user with a random ID
      const snacksCollection = collection(userDocRef, "snacks");
      const snackDocRef = doc(snacksCollection);
  
      // Set fields for the "snacks" collection
      await setDoc(snackDocRef, {
        name: "",
        calories: 0,
        quantity: 0,
        
      });

    /////////////////////////////////////////////////////////////////////////////////
    // Create a separate collection named "snacks" for the user with a random ID
    const breakfastCollection = collection(userDocRef, "breakfast");
    const breakfastDocRef = doc(breakfastCollection);

    // Set fields for the "snacks" collection
    await setDoc(breakfastDocRef, {
      name: "",
      calories: 0,
      quantity: 0,
      
    });
    /////////////////////////////////////////////////////////////////////////////////
    // Create a separate collection named "snacks" for the user with a random ID
    const lunchCollection = collection(userDocRef, "lunch");
    const lunchDocRef = doc(lunchCollection);

    // Set fields for the "snacks" collection
    await setDoc(lunchDocRef, {
      name: "",
      calories: 0,
      quantity: 0,
      
    });
    /////////////////////////////////////////////////////////////////////////////////
    // Create a separate collection named "snacks" for the user with a random ID
    const dinnerCollection = collection(userDocRef, "dinner");
    const dinnerDocRef = doc(dinnerCollection);

    // Set fields for the "snacks" collection
    await setDoc(dinnerDocRef, {
      name: "",
      calories: 0,
      quantity: 0,
      
    });
    /////////////////////////////////////////////////////////////////////////////////
    // Create a separate collection named "snacks" for the user with a random ID
    const desertCollection = collection(userDocRef, "desert");
    const desertDocRef = doc(desertCollection);

    // Set fields for the "snacks" collection
    await setDoc(desertDocRef, {
      name: "",
      calories: 0,
      quantity: 0,
      
    });
    /////////////////////////////////////////////////////////////////////////////////
    // Create a separate collection named "snacks" for the user with a random ID
    const exerciseCollection = collection(userDocRef, "exercise");
    const exerciseDocRef = doc(exerciseCollection);

    // Set fields for the "snacks" collection
    await setDoc(exerciseDocRef, {
      name: "",
      calories: 0,
      
    });

    /////////////////////////////////////////////////////////////////////////////////
  
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