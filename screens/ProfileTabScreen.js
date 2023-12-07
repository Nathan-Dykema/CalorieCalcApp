import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { auth, db } from '../firebase';
import {
  onSnapshot,
  collection,query,where,getFirestore,doc,setDoc,addDoc,deleteDoc,getDocs,orderBy,limit,
} from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import PieChart from 'react-native-pie-chart'



const ProfileTabScreen = () => {

  const [totalCaloriesToday, setTotalCaloriesToday] = useState(0);

  const [percentageSnacks, setPercentageSnacks] = useState(0);
  const [percentageBreakfast, setPercentageBreakfast] = useState(0);
  const [percentageLunch, setPercentageLunch] = useState(0);
  const [percentageDinner, setPercentageDinner] = useState(0);
  const [percentageDesert, setPercentageDesert] = useState(0);

  useEffect(() => {
    fetchCalories(); 
  }, []); 
 
 

  const fetchCalories = async () => {
    try {
      const userDocRef = doc(collection(db, 'users'), auth.currentUser.uid);
      const snacksSnapshot = await getDocs(collection(userDocRef, 'snacks'));
      const breakfastSnapshot = await getDocs(collection(userDocRef, 'breakfast'));
      const lunchSnapshot = await getDocs(collection(userDocRef, 'lunch'));
      const dinnerSnapshot = await getDocs(collection(userDocRef, 'dinner'));
      const desertSnapshot = await getDocs(collection(userDocRef, 'desert'));
  
      let totalCaloriesSnacks = 0;
      let totalCaloriesBreakfast = 0;
      let totalCaloriesLunch = 0;
      let totalCaloriesDinner = 0;
      let totalCaloriesDesert = 0;
      let totalCaloriesToday = 0;
  
      snacksSnapshot.forEach((doc) => {
        let calories = doc.data().calories || 0;
        let quantity = doc.data().quantity || 0;
        totalCaloriesSnacks += calories * quantity;
      });
  
      breakfastSnapshot.forEach((doc) => {
        let calories = doc.data().calories || 0;
        let quantity = doc.data().quantity || 0;
        totalCaloriesBreakfast += calories * quantity;
      });
  
      lunchSnapshot.forEach((doc) => {
        let calories = doc.data().calories || 0;
        let quantity = doc.data().quantity || 0;
        totalCaloriesLunch += calories * quantity;
      });
  
      dinnerSnapshot.forEach((doc) => {
        let calories = doc.data().calories || 0;
        let quantity = doc.data().quantity || 0;
        totalCaloriesDinner += calories * quantity;
      });
  
      desertSnapshot.forEach((doc) => {
        let calories = doc.data().calories || 0;
        let quantity = doc.data().quantity || 0;
        totalCaloriesDesert += calories * quantity;
      });
  
    totalCaloriesToday =
        totalCaloriesSnacks +
        totalCaloriesBreakfast +
        totalCaloriesLunch +
        totalCaloriesDinner +
        totalCaloriesDesert;
  
        setTotalCaloriesToday(totalCaloriesToday);
        console.log('Total Calories Today: ', totalCaloriesToday);

        if (totalCaloriesToday > 0) {
    // Calculate the percentage for each category
    const percentageSnacks = (totalCaloriesSnacks / totalCaloriesToday) * 100;
    const percentageBreakfast = (totalCaloriesBreakfast / totalCaloriesToday) * 100;
    const percentageLunch = (totalCaloriesLunch / totalCaloriesToday) * 100;
    const percentageDinner = (totalCaloriesDinner / totalCaloriesToday) * 100;
    const percentageDesert = (totalCaloriesDesert / totalCaloriesToday) * 100;

    // Update state
    setPercentageSnacks(percentageSnacks);
    setPercentageBreakfast(percentageBreakfast);
    setPercentageLunch(percentageLunch);
    setPercentageDinner(percentageDinner);
    setPercentageDesert(percentageDesert);      
    
    console.log('Percentage Snacks: ', percentageSnacks);
    console.log('Percentage Breakfast: ', percentageBreakfast);
    console.log('Percentage Lunch: ', percentageLunch);
    console.log('Percentage Dinner: ', percentageDinner);
    console.log('Percentage Desert: ', percentageDesert);

    } else {
      // Handle the case where totalCaloriesToday is zero (or less)
      console.log('Total calories today is zero or less.');
      setPercentageSnacks(0);
      setPercentageBreakfast(0);
      setPercentageLunch(0);
      setPercentageDinner(0);
      setPercentageDesert(0);
    }

    } 
    catch (error) {
      console.error('Error fetching calories:', error.message);
    }
  };
  


  useFocusEffect(() => {
    fetchCalories(); // Fetch calories when the screen is focused
  });

  useEffect(() => {
    const fetchData = async () => {
      await fetchCalories();
    };

    fetchData();
  }, []); 



  const pieData = [
    {
      key: 1,
      value: percentageSnacks > 0 ? percentageSnacks : 0.001,
      svg: { fill: 'darkorange' },
      arc: { outerRadius: '130%', padAngle: 0.02 },
    },
    {
      key: 2,
      value: percentageBreakfast > 0 ? percentageBreakfast : 0.001,
      svg: { fill: 'darkgreen' },
      arc: { outerRadius: '130%', padAngle: 0.02 },
    },
    {
      key: 3,
      value: percentageLunch > 0 ? percentageLunch : 0.001,
      svg: { fill: 'darkblue' },
      arc: { outerRadius: '130%', padAngle: 0.02 },
    },
    {
      key: 4,
      value: percentageDinner > 0 ? percentageDinner : 0.001,
      svg: { fill: 'darkred' },
      arc: { outerRadius: '130%', padAngle: 0.02 },
    },
    {
      key: 5,
      value: percentageDesert > 0 ? percentageDesert : 0.001,
      svg: { fill: 'purple' },
      arc: { outerRadius: '130%', padAngle: 0.02 },
    },
  ];
  
  const sliceColor = pieData.map((data) => data.svg.fill);
  const series = pieData.map(data => data.value);

  return (

    <LinearGradient 
    colors={[ 'white','white','#e5ffe3','#e5ffe3','#e5ffe3', '#4dc445']} // Gradient 
    style={styles.gradientBackground}
    >

    
    <View style={styles.container}>


      
      <View style={styles.topHalf}>
        
        <View style={styles.leftHalf}>
          
        {totalCaloriesToday > 0 ? (
          <PieChart
            widthAndHeight={130}
            series={series}
            sliceColor={sliceColor}
            coverRadius={0.45}
            coverFill={'#FFF'}
          />
        ) : (
          <Text>No data available yet</Text>
        )}

        
          <View style={styles.legend}>
            <Text style={[styles.legendText, { color: 'darkorange' }]}>- Snacks - {percentageSnacks.toFixed(2)}%</Text>
            <Text style={[styles.legendText, { color: 'darkgreen' }]}>- Breakfast - {percentageBreakfast.toFixed(2)}%</Text>
            <Text style={[styles.legendText, { color: 'darkblue' }]}>- Lunch - {percentageLunch.toFixed(2)}%</Text>
            <Text style={[styles.legendText, { color: 'darkred' }]}>- Dinner - {percentageDinner.toFixed(2)}%</Text>
            <Text style={[styles.legendText, { color: 'purple' }]}>- Dessert - {percentageDesert.toFixed(2)}%</Text>
          </View>
        </View>

        
        <View style={styles.verticalLine}></View>

        
        <View style={styles.rightHalf}>
          
          <View style={styles.topRightHalf}>
            <Text style={styles.topRightText}>Total Calories Today</Text>
            <Text style={styles.totalCalories}>{totalCaloriesToday}</Text>
          </View>

          
          <View style={styles.horizontalLine}></View>

          
          <View style={styles.topRightHalf}>
            <Text style={styles.topRightText}>Total Steps Today</Text>
            <Text style={styles.totalCalories}>---</Text>
          </View>
        </View>
      </View>

      
      <View style={styles.horizontalLine}></View>

      
      <View style={styles.bottomHalf}>


      <Text>
        Caloric needs vary from person to person based on factors such as age, gender, weight, height, activity level, and overall health. The total number of calories a person requires is influenced by their Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE).
      </Text>
      <Text></Text>
      <Text style={styles.listTitle}>Calculate your Basal Metabolic Rate (BMR):</Text>
      <View style={styles.listItemContainer}>
        <Text style={styles.listItemBullet}>{'\u2022'}</Text>
        <Text style={styles.listItemText}>
          For men: BMR = 88.362 + (13.397 × weight in kg) + (4.799 × height in cm) - (5.677 × age in years)
        </Text>
      </View>
      <View style={styles.listItemContainer}>
        <Text style={styles.listItemBullet}>{'\u2022'}</Text>
        <Text style={styles.listItemText}>
          For women: BMR = 447.593 + (9.247 × weight in kg) + (3.098 × height in cm) - (4.330 × age in years)
        </Text>
      </View>
      <Text></Text>
      <Text style={styles.listTitle}>Determine your Total Daily Energy Expenditure (TDEE):</Text>
      <View style={styles.listItemContainer}>
        <Text style={styles.listItemBullet}>{'\u2022'}</Text>
        <Text style={styles.listItemText}>
          Sedentary (little or no exercise): BMR × 1.2 
        </Text>
      </View>
      <View style={styles.listItemContainer}>
        <Text style={styles.listItemBullet}>{'\u2022'}</Text>
        <Text style={styles.listItemText}>
          Lightly active (light exercise/sports 1-3 days/week): BMR × 1.375
        </Text>
      </View>
      <View style={styles.listItemContainer}>
        <Text style={styles.listItemBullet}>{'\u2022'}</Text>
        <Text style={styles.listItemText}>
           Moderately active (moderate exercise/sports 3-5 days/week): BMR × 1.55
        </Text>
      </View>
      <View style={styles.listItemContainer}>
        <Text style={styles.listItemBullet}>{'\u2022'}</Text>
        <Text style={styles.listItemText}>
          Very active (hard exercise/sports 6-7 days a week): BMR × 1.725
        </Text>
      </View>
      <View style={styles.listItemContainer}>
        <Text style={styles.listItemBullet}>{'\u2022'}</Text>
        <Text style={styles.listItemText}>
          Extra active (very hard exercise/sports & physical job or 2x training): BMR × 1.9
        </Text>
      </View>
        


      </View>



    </View>

    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topHalf: {
    flex: 1,
    flexDirection: 'row',
  },
  leftHalf: {
    flex: 1,
    justifyContent: 'flex-start', 
    alignItems: 'center',
    padding: 4,
  },
  legend: {
    marginTop: 5, 
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  legendText: {
    fontSize: 12, 
    marginVertical: 2, 
  },
  verticalLine: {
    width: 1,
    height: '100%',
    backgroundColor: 'black',
  },
  rightHalf: {
    flex: 1,
    flexDirection: 'column', 
  },
  topRightHalf: {
    flex: 1,
    justifyContent: 'flex-end', 
    alignItems: 'center',
  },
  topRightText: {
    flex: 1,
  },
  horizontalLine: {
    width: '100%', 
    height: 1,
    backgroundColor: 'black',
  },
  bottomHalf: {
    flex: 2,
    padding: 10, 
    alignItems: 'flex-start',
  },
  totalCaloriesText: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 4, 
  },
  totalCalories: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 42, 
  },
  pieChartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center', 
    justifyContent: 'center',
  },
  listItemContainer: {
    flexDirection: 'row', 
    marginLeft: 20, 
    alignItems: 'flex-start', 
  },
  listItemBullet: {
    marginRight: 5, 
  },
  listItemText: {
    flex: 1, 
  },
  gradientBackground: {
    flex: 1,
  },
});

export default ProfileTabScreen;