import React, {Component} from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from "expo-linear-gradient";

import firebase from '@react-native-firebase/app';
import '@react-native-firebase/firestore';












class ProfileTabScreen extends Component{

  state = {
    user : {
      name: " "
    }
  }


  constructor(props){
    super(props)
    this.getUser();
    this.subscriber = firebase().collection("users").doc('3UzhRenTnYfNfosTmt6NzFVDQt83').onSnapshot(doc => {
        this.setState({
          user: {
            name: doc.data().name
          }
        })
    })
    
  }

  getUser = async () => {
    const userDocument = await firestore().collection("users").doc('3UzhRenTnYfNfosTmt6NzFVDQt83').get()
    console.log(userDocument)
  }

















render(){


    return (


      <SafeAreaView style={styles.Container}>
  
  
        <Text style={styles.Container}>Name: {this.state.user.name} </Text>
        
      </SafeAreaView>
    );

  
  
  }
}

const styles = StyleSheet.create({
    Container: {
      flex: 1,
      backgroundColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 8,
    },
    
  });
  
  export default ProfileTabScreen;
  
