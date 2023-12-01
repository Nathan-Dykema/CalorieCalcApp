import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity, StyleSheet, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from "expo-linear-gradient";

import firestore from "@react-native-firebase/firestore"





const FoodJournalTabScreen = () => {

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [selectedButton, setSelectedButton] = useState(null);


  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    // Update the current date when the component mounts
    updateCurrentDate();

    
    const intervalId = setInterval(updateCurrentDate, 1000 * 60); 
    // Updates every minute

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const updateCurrentDate = () => {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = now.toLocaleDateString('en-US', options);
    setCurrentDate(formattedDate);
  };


  const openModal = (buttonId) => {
    setSelectedButton(buttonId);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedButton(null);
  };


  const [foods, setFoods] = useState([
    { id: 'today', title: 'Today', data: [] }, // TodaySection 
    { buttonId: '0', title: 'Snacks', data: [] },
    { buttonId: '1', title: 'Breakfast', data: [] },
    { buttonId: '2', title: 'Lunch', data: [] },
    { buttonId: '3', title: 'Dinner', data: [] },
    { buttonId: '4', title: 'Exercise', data: [] },
  ]);

 
  const TodaySection = () => {
    return (
      <View style={styles.todayContainer}>
        <Text style={styles.todayText}>Today</Text>
        <Text style={styles.todayText}></Text>
        <Text style={styles.todayText}>{currentDate}</Text>
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
              <Text style={styles.itemText}>{subItem.nameText}</Text>
              <Text style={styles.itemText}>{subItem.calorieAmount}</Text>
              <Text style={styles.itemText}>{subItem.quantity}</Text>
            </View>
          )}
          keyExtractor={(subItem, index) => `${subItem.nameText}_${index}`}
        />

        <View style={styles.container}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.undoAddbutton} onPress={() => handleUndo(item.buttonId)}>
              <Text style={styles.buttonText}>Undo</Text>
            </TouchableOpacity>
            
          

            <TouchableOpacity style={styles.undoAddbutton} onPress={() => openModal(item.buttonId)}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>

      </>
    )}
  </View>
);

  
const handleUndo = (buttonId) => {
  // Find the index of the array with the given buttonId
  const index = foods.findIndex((food) => food.buttonId === buttonId);
  // Make sure the index is valid
  if (index !== -1) {
    const newArray = [...foods];
    const targetSubArray = newArray[index];
    // Make sure the sub-array is not empty before removing the last element
    if (targetSubArray && targetSubArray.data.length > 0) {
      targetSubArray.data.pop();
      setFoods(newArray);
      console.log('Updated Foods Array:', newArray);
    }
  }
};


  const AddForm = () => {
    const [nameText, setNameText] = useState('');
    const [calorieAmount, setCalorieAmount] = useState('');
    const [quantity, setQuantity] = useState('');
  
    const clearForm = () => {
      setNameText('');
      setCalorieAmount('');
      setQuantity('');
    };
  
    return (
    
      <ScrollView contentContainerStyle={styles.container}>
        <Text>  </Text>
        <Text>  </Text>
        <Text>  </Text>
        <Text>  </Text>
        <Text>  </Text>
        <Text>  </Text>
        <Text>  </Text>

        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.description}>Item Name</Text>
          <TextInput
            style={styles.textBox}
            placeholder="                          Name                          "
            value={nameText}
            onChangeText={(text) => setNameText(text)}
          />
          <Text style={styles.description}>Calorie Amount</Text>
          <TextInput
            style={styles.textBox}
            placeholder="                        Calories                        "
            value={calorieAmount}
            onChangeText={(text) => setCalorieAmount(text)}
          />
          <Text style={styles.description}>Quantity / Serving Size</Text>
          <TextInput
            style={styles.textBox}
            placeholder="                        Quantity                        "
            value={quantity}
            onChangeText={(text) => setQuantity(text)}
          />
        </View>
  
        {selectedButton && (
        <View style={styles.container}>
          <View style={styles.formButton}>
            <TouchableOpacity onPress={closeModal} style={styles.button}>
              <Text style={styles.buttonText}> Back </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                console.log(`${selectedButton} submit button pressed!`);

                if (nameText.trim() !== '') {
                  setFoods((prevFoods) => {
                    const updatedFoods = prevFoods.map((section) =>
                      section.buttonId === selectedButton
                        ? {
                            ...section,
                            data: [
                              ...section.data,
                              {
                                nameText,
                                calorieAmount,
                                quantity,
                              },
                            ],
                          }
                        : section
                    );

                    console.log('Current State:', updatedFoods);
                    clearForm();
                    closeModal();
                    return updatedFoods;
                  });
                }
              }}
              style={styles.button}
            >
                  {selectedButton === '0' && (
                    
                    <Text style={styles.buttonText}>Add Snack</Text>
                    
                  )}
                  {selectedButton === '1' && (
                    
                    <Text style={styles.buttonText}>Add Breakfast</Text>
                    
                  )}
                  {selectedButton === '2' && (
                    
                    <Text style={styles.buttonText}>Add Lunch</Text>
                    
                  )}
                  {selectedButton === '3' && (
                    
                    <Text style={styles.buttonText}>Add Dinner</Text>
                    
                  )}
                  {selectedButton === '4' && (
                    
                    <Text style={styles.buttonText}>Add Exercise</Text>
                    
                  )}

            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
    
  );
};
  

  return ( // displays all sections

  <LinearGradient 
    colors={['white','white', 'white', 'white','#e5ffe3', '#4dc445']} // Gradient 
      style={styles.gradientBackground}
     
    >

    <SafeAreaView style={{ flex: 1,  }}> 


        <FlatList
          data={foods}
          renderItem={renderFoods}
          keyExtractor={(item) => `${item.buttonId}_${item.title}`}
        />
    
      <Text>  </Text>
      <Text>  </Text>
      <Text>  </Text>
      <Text>  </Text>





      {selectedButton && ( // For the form title pop up for the add button
      <Modal isVisible={isModalVisible} onBackdropPress={closeModal}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              {selectedButton === '0' && (
                <View>
                  <Text>Add a Snack!</Text>
                </View>
              )}
              {selectedButton === '1' && (
                <View>
                  <Text>Add some Breakfast!</Text>
                </View>
              )}
              {selectedButton === '2' && (
                <View>
                  <Text>Add some Lunch!</Text>
                </View>
              )}
              {selectedButton === '3' && (
                <View>
                  <Text>Add some Dinner!</Text>
                </View>
              )}
              {selectedButton === '4' && (
                <View>
                  <Text>Add some Exercise!</Text>
                </View>
              )}
              <AddForm/>
      
      
             </View>
      </Modal>
)}

    </SafeAreaView>

    </LinearGradient>
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
      height: 180,
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
      position: 'relative',
      flexDirection: 'column', 
      
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    itemContainer: {
      height:75,
      width: 100,
      justifyContent: 'center',
      marginRight: 30,
      backgroundColor: '#d2ffcf',
      padding: 10,
      borderRadius: 8,
    },
    itemText: {
        
      fontSize: 16,
    },
    buttonContainer: {
      height:45,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignSelf: 'center', 
      marginTop: 'auto', 
      padding: 10,
      borderRadius: 8,
      bottom: 0,
      
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      textAlign: 'center',
      paddingVertical: 4,
    },
    undoAddbutton: {
      marginHorizontal: 8, 
      width: '30%',
      height: '125%',
      borderRadius: 8, 
      backgroundColor: '#4dc445',
      
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
      justifyContent: 'flex-end', 
    },
    description: {
      fontSize: 18,
      marginBottom: 8,
    },
    textBox: {
      height: 40,
      borderColor: '#4dc445',
      borderWidth: 1,
      marginBottom: 24,
      paddingLeft: 8,
      paddingRight: 8,
      width: '100%', 
    },
    formButton: {
      flexDirection: 'row',
      justifyContent: 'space-around', 
      width: '85%',
    },
    button: {
      flex: 1, 
      backgroundColor: '#4dc445', 
      marginHorizontal: 8, 
      padding: 14, 
      borderRadius: 8, 
    },
    gradientBackground: {
      flex: 1,
    },
    
  });
  
  export default FoodJournalTabScreen;
  
