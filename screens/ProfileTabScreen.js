import React, { useEffect } from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from "expo-linear-gradient";


import { firebase } from "@firebase/app";
import "@firebase/firestore";



const ProfileTabScreen = () => {

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      
    </SafeAreaView>
  );
};
 

const styles = StyleSheet.create({
    Container: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 8,
      position: 'sticky',
      top: 0,
      zIndex: 1,
    },
    
  });
  
  export default ProfileTabScreen;
  
