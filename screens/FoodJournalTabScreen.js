import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity, StyleSheet, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from "expo-linear-gradient";
import { auth, db } from '../firebase'
import { onSnapshot, collection, query, where, getFirestore, doc, setDoc, addDoc, deleteDoc, getDocs, orderBy, limit} from 'firebase/firestore';



const FoodJournalTabScreen = () => {

 
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      return;
    }

    const userId = user.uid;

    const subscribeToCollection = (collectionName, setData) => {
      const collectionRef = collection(db, 'users', userId, collectionName);

      return onSnapshot(collectionRef, (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => doc.data());
        setData(data);
      });
    };

    const unsubscribeFunctions = [
      subscribeToCollection('snacks', (data) => updateData('Snacks', data)),
      subscribeToCollection('breakfast', (data) => updateData('Breakfast', data)),
      subscribeToCollection('lunch', (data) => updateData('Lunch', data)),
      subscribeToCollection('dinner', (data) => updateData('Dinner', data)),
      subscribeToCollection('desert', (data) => updateData('Desert', data)),
      subscribeToCollection('exercise', (data) => updateData('Exercise', data)),
    ];

    return () => {
      unsubscribeFunctions.forEach((unsubscribe) => unsubscribe());
    };
  }, []); // Empty dependency array to run the effect only once on mount

  const updateData = (title, data) => {
    // Filter out items with empty names and zero calories 
    const filteredData = data.filter(item => item.name !== "" || item.calories !== 0);

    setFoods(prevFoods =>
      prevFoods.map(item => (item.title === title ? { ...item, data: filteredData } : item))
    );
  };





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
    { buttonId: 'today', title: 'Today', data: [] }, // TodaySection 
    { buttonId: '0', title: 'Snacks', data: [] },
    { buttonId: '1', title: 'Breakfast', data: [] },
    { buttonId: '2', title: 'Lunch', data: [] },
    { buttonId: '3', title: 'Dinner', data: [] },
    { buttonId: '4', title: 'Desert', data: [] },
    { buttonId: '5', title: 'Exercise', data: [] },
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
    
    {item.buttonId === 'today' ? (
      <TodaySection />
    ) : (
      <>
        <Text style={styles.sectionTitle}>{item.title}</Text>
        <FlatList
          data={item.data}
          horizontal
          renderItem={({ item: subItem }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.itemText}>{subItem.name}</Text>
              <Text style={styles.itemText}>{subItem.calories}</Text>
              <Text style={styles.itemText}>{subItem.quantity}</Text>
            </View>
          )}
          keyExtractor={(subItem, index) => `${subItem.name}_${index}`}
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

  
const handleUndo = async (buttonId) => {
  const user = auth.currentUser;
  const userId = user.uid;

  try {
    // Find the index of the array with the given buttonId
    const index = foods.findIndex((food) => food.buttonId === buttonId);

    // Make sure the index is valid
    if (index !== -1) {
      const newArray = [...foods];
      const targetSubArray = newArray[index];

      // Make sure the sub-array is not empty before removing the last element
      if (targetSubArray && targetSubArray.data.length > 0) {
        // Pop the last entry from the array
        const poppedEntry = targetSubArray.data.pop();

        // Assuming the name is available in the popped entry
        const foodName = poppedEntry.name;

        // Check if the foodName is available
        if (foodName) {
          // Rest of the code for Firestore deletion
          const db = getFirestore();
          const userDocRef = doc(db, 'users', userId);
          let collectionName = '';

          switch (buttonId) {
            case '0':
              collectionName = 'snacks';
              break;
            case '1':
              collectionName = 'breakfast';
              break;
            case '2':
              collectionName = 'lunch';
              break;
            case '3':
              collectionName = 'dinner';
              break;
            case '4':
              collectionName = 'desert';
              break;
            case '5':
              collectionName = 'exercise';
              break;
            default:
              break;
          }

          if (collectionName !== '') {
            const foodsCollection = collection(userDocRef, collectionName);

            // Query the Firestore collection to find the document with the specified name
            const querySnapshot = await getDocs(
              query(foodsCollection, where('name', '==', foodName))
            );

            // Check if any documents match the query
            if (!querySnapshot.empty) {
              // Delete the document
              const docToDelete = querySnapshot.docs[0];
              await deleteDoc(docToDelete.ref);

              console.log('Document deleted successfully', docToDelete.id);
            } else {
              console.warn('Document not found for deletion:', foodName);
            }
          }
        } else {
          console.warn('Food Name not available. Skipped deletion.');
        }

        // Update the state to reflect the removal
        setFoods((prevFoods) => [
          ...prevFoods.slice(0, index),
          {
            ...targetSubArray,
            data: [...targetSubArray.data],
          },
          ...prevFoods.slice(index + 1),
        ]);

        console.log('Updated Foods Array:', newArray);
      }
    }
  } catch (error) {
    console.error('Error deleting document: ', error);
  }
};




const AddForm = () => {
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [quantity, setQuantity] = useState('');

  const clearForm = () => {
    setName('');
    setCalories('');
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
            value={name}
            onChangeText={(text) => setName(text)}
          />
          <Text style={styles.description}>Calorie Amount</Text>
          <TextInput
            style={styles.textBox}
            placeholder="                        Calories                        "
            value={calories}
            onChangeText={(text) => setCalories(text)}
          />
          {selectedButton !== '5' && (
        <>
          <Text style={styles.description}>Quantity / Serving Size</Text>
          <TextInput
            style={styles.textBox}
            placeholder="                        Quantity                        "
            value={quantity}
            onChangeText={(text) => setQuantity(text)}
          />
        </>
      )}

    </View>


      {selectedButton && (
        <View style={styles.container}>
          <View style={styles.formButton}>
            <TouchableOpacity onPress={closeModal} style={styles.button}>
              <Text style={styles.buttonText}> Back </Text>
            </TouchableOpacity>

            <TouchableOpacity
            onPress={async () => {
              console.log(`${selectedButton} submit button pressed!`);

              const user = auth.currentUser;
              if (!user) {
                return;
              }

          const userId = user.uid;

          if (name.trim() !== '' && calories.trim() !== '') {
            try {
              // Assuming you have a reference to the Firestore database
              const db = getFirestore();

              // Get the user's document reference
              const userDocRef = doc(db, 'users', userId);

              // Determine the collection based on the selected button
              let collectionName = '';
              switch (selectedButton) {
                case '0':
                  collectionName = 'snacks';
                  break;
                case '1':
                  collectionName = 'breakfast';
                  break;
                case '2':
                  collectionName = 'lunch';
                  break;
                case '3':
                  collectionName = 'dinner';
                  break;
                case '4':
                  collectionName = 'desert';
                  break;
                case '5':
                  collectionName = 'exercise';
                  break;
                default:
                  break;
              }

              if (collectionName !== '') {
                // Get the collection reference for the selected button
                const foodsCollection = collection(userDocRef, collectionName);

                // Add a document with the entered data
                const newFoodDocRef = await addDoc(foodsCollection, {
                  name,
                  calories,
                  quantity,
                });

                console.log(`Document written with ID: ${newFoodDocRef.id}`);

                // Update the state to reflect the addition
                setFoods((prevFoods) => {
                  const sectionIndex = prevFoods.findIndex(
                    (section) => section.buttonId === selectedButton
                  );
                
                  if (sectionIndex !== -1) {
                    // Extract existing data names using Set
                    const existingDataNames = new Set(
                      prevFoods[sectionIndex].data.map((item) => item.name.toLowerCase())
                    );
                
                    // Check if the new entry's name already exists in the current data
                    if (!existingDataNames.has(name.toLowerCase())) {
                      const updatedSection = {
                        ...prevFoods[sectionIndex],
                        data: [
                          ...prevFoods[sectionIndex].data,
                          {
                            id: newFoodDocRef.id,
                            name,
                            calories,
                            quantity,
                          },
                        ],
                      };
                
                      
                      const updatedFoods = [...prevFoods];
                      updatedFoods[sectionIndex] = updatedSection;
                
                      console.log('Previous State:', prevFoods);
                      console.log('Updated Section:', updatedSection);
                      console.log('Updated State:', updatedFoods);
                
                      clearForm();
                      closeModal();
                
                      return updatedFoods;
                    }
                  }
                
                  return prevFoods;
                });
              }
            } catch (error) {
              console.error('Error adding document: ', error);
            }
            
          }
        }}
      style={styles.button}
       >
          {selectedButton === '0' && <Text style={styles.buttonText}>Add Snack</Text>}
          {selectedButton === '1' && <Text style={styles.buttonText}>Add Breakfast</Text>}
          {selectedButton === '2' && <Text style={styles.buttonText}>Add Lunch</Text>}
          {selectedButton === '3' && <Text style={styles.buttonText}>Add Dinner</Text>}
          {selectedButton === '4' && <Text style={styles.buttonText}>Add Desert</Text>}
          {selectedButton === '5' && <Text style={styles.buttonText}>Add Exercise</Text>}
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
                  <Text>Add some Desert!</Text>
                </View>
              )}
              {selectedButton === '5' && (
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
  