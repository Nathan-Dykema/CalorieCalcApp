import { useNavigation } from '@react-navigation/core'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import { auth } from '../firebase'
import { LinearGradient } from "expo-linear-gradient";



const HomeTabScreen = () => {
  const navigation = useNavigation()


  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Login")
      })
      .catch(error => alert(error.message))
  }
  

  return (
    <LinearGradient 
    colors={['white','white','#eafae8', '#e5ffe3', '#7bc276', '#4dc445']} // Gradient 
      style={styles.gradientBackground}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >

    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.emailText}>Signed into: {auth.currentUser?.email}</Text>
        <TouchableOpacity onPress={handleSignOut} style={styles.button}>
          <Text style={styles.buttonText}>Sign out</Text>
        </TouchableOpacity>
      </View>

      <Text></Text>
      
      <Image
        source={require('../assets/nutrinow-logo.png')}
        style={{ width: 200, height: 205 }}
      />


      <Text style={styles.bigText}>Welcome to NutriNow!</Text>
      <Text style={styles.infoText}>
        Make sure to stay up to date with our app as this is where you can find any news or updates we can share with you!
      </Text>
      <Text style={styles.bigText}>News</Text>
      <Text style={styles.infoText}>
        There is no news to share at the moment so go ahead and tap on your Profile to check out your calorie stats or head over to your Food Journal and enter in everything you've eaten and done today!
      </Text>
    </View>
    </LinearGradient>
  );
};





const styles = StyleSheet.create({
  container: {
    
    flex: 1, 
    justifyContent: 'flex-start', 
    alignItems: 'center',
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
  },
  emailText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#4dc445',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
  },
  bigText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 40,
    color: '#4dc445',
  },
  infoText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  gradientBackground: {
    flex: 1,
  },
});

export default HomeTabScreen;