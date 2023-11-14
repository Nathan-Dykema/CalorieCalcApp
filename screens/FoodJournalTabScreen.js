import React from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';






const MultiSectionPage = () => {




  const foods = [
    { id: 'today', title: 'Today', data: [] }, // TodaySection added here
    { id: '0', title: 'Snacks', data: ['Item 1', 'Item 2', 'Item 3'], onPress: () => handleAddFood('Snacks') },
    { id: '1', title: 'Breakfast', data: ['Item 1', 'Item 2', 'Item 3'], onPress: () => handleAddFood('Breakfast') },
    { id: '2', title: 'Lunch', data: ['Item 1', 'Item 2', 'Item 3'], onPress: () => handleAddFood('Lunch') },
    { id: '3', title: 'Dinner', data: ['Item 1', 'Item 2', 'Item 3'], onPress: () => handleAddFood('Dinner') },
    { id: '4', title: 'Exercise', data: ['Item 1', 'Item 2', 'Item 3'], onPress: () => handleAddExercise('Exercise') },
  ];

  const handleAddExercise = (sectionTitle) => {
    console.log(`Adding to ${sectionTitle}`);
  };

  const handleAddFood = (sectionTitle) => {
    console.log(`Adding Food to ${sectionTitle}`);
  };



  const TodaySection = () => {
    return (
      <View style={styles.todayContainer}>
        <Text style={styles.todayText}>Today</Text>
      </View>
    );
  };

  const renderFoods = ({ item }) => (
    <View style={styles.sectionContainer}>
      {item.id === 'today' ? (
        <TodaySection />
      ) : (
        <>
          <Text style={styles.sectionTitle}>{item.title}</Text>
          <FlatList
            data={item.data}
            horizontal
            renderItem={({ item: subItem }) => (
              <View style={styles.itemContainer}>
                <Text style={styles.itemText}>{subItem}</Text>
              </View>
            )}
            keyExtractor={(subItem) => subItem}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={item.onPress}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );

  

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>

      <ScrollView>
        <FlatList
          data={foods}
          renderItem={renderFoods}
          keyExtractor={(item) => item.id}
        />
      </ScrollView>
      <Text>  </Text>
      <Text>  </Text>
      <Text>  </Text>
      <Text>  </Text>
      
    </SafeAreaView>

    
  );
};
 

const styles = StyleSheet.create({
    todayContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 8,
      position: 'sticky',
      top: 0,
      zIndex: 1,
    },
    todayText: {
      fontSize: 25,
      fontWeight: 'bold',
    },
    sectionContainer: {
      height: 155,
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
      position: 'relative',
      flexDirection: 'column', // Vertical flex direction
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    itemContainer: {
      height: 60,
      justifyContent: 'center',
      marginRight: 30,
      backgroundColor: '#f0f0f0',
      padding: 10,
      borderRadius: 8,
    },
    itemText: {
        
      fontSize: 16,
    },
    buttonContainer: {
      alignSelf: 'center', 
      marginTop: 'auto', // Push the button to the bottom of the container
      backgroundColor: 'black',
      padding: 10,
      borderRadius: 8,
      bottom: 0,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
    },
  });
  
  export default MultiSectionPage;
  
