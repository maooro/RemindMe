import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Modal, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SwipeItem, SwipeProvider, SwipeButtonsContainer } from 'react-native-swipe-item';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

export default function App() {
  useEffect(() => {
    if (onLoadFlag) { _retrieveData(); onLoadFlagHandler(false); }
  });

  const [date, setDate] = useState('');
  const [address, setAddress] = useState('');
  const [radius, setRadius] = useState('');
  const [body, setBody] = useState('');
  const [placelist, setPlaceList] = useState([]);
  const [newPlaceModalVisible, setNewPlaceModalVisible] = useState(false);
  const [itemInfoModalVisible, setItemInfoModalVisible] = useState(false);
  const [inputDateError, setInputDateError] = useState(false);
  const [inputAddressError, setInputAddressError] = useState(false);
  const [inputRadiusError, setInputRadiusError] = useState(false);
  const [inputBodyError, setInputBodyError] = useState(false);
  const [onLoadFlag, setOnLoadFlag] = useState(true);

  const onLoadFlagHandler = (value) => { setOnLoadFlag(value); }
  const dateChangeHandler = (value) => { setDate(prevDate => value); }
  const addressChangeHandler = (value) => { setAddress(prevAddress => value); }
  const radiusChangeHandler = (value) => { setRadius(prevRadius => value); }
  const bodyChangeHandler = (value) => { setBody(prevBody => value); }
  const dateFocusHandler = () => { setInputDateError(false); }
  const addressFocusHandler = () => { setInputAddressError(false); }
  const radiusFocusHandler = () => { setInputRadiusError(false); }
  const bodyFocusHandler = () => { setInputBodyError(false); }
  const clearPlacelist = () => { setPlaceList([]); }
  const showNewPlace = () => { newPlaceVisibleHandler(true); }
  const hideNewPlace = () => { newPlaceVisibleHandler(false); }
  const showInfo = () => { itemInfoVisibleHandler(true); }
  const hideInfo = () => { itemInfoVisibleHandler(false); }
  const itemInfoVisibleHandler = (value) => { setItemInfoModalVisible(value); }
  const inputDateErrorHandler = (value) => { setInputDateError(value); }
  const inputAddressErrorHandler = (value) => { setInputAddressError(value); }
  const inputRadiusErrorHandler = (value) => { setInputRadiusError(value); }
  const inputBodyErrorHandler = (value) => { setInputBodyError(value); }
  const placelistChangeHandler = (value) => {
    setPlaceList(prevPlaceList => [...prevPlaceList,
    { id: value.id, date: value.date, address: value.address, radius: value.radius, body: value.body }]);
  }
  const newPlaceVisibleHandler = (value) => {
    setNewPlaceModalVisible(value);
    setDate('');
    setAddress('');
    setRadius('');
    setBody('');
  }
  const _storeData = async (object) => {
    console.log(object);
    var objId = "alert" + object.id;
    try {
      await AsyncStorage.setItem(objId, JSON.stringify(object));
      console.log("new entry saved with id " + objId);
      _retrieveData();
    } catch (error) {
      // Error saving data
    }
  }
  const _retrieveData = async () => {
    console.log("downloading data..");
    clearPlacelist();
    try {
      const keys = await AsyncStorage.getAllKeys();
      keys.forEach(key => {
        if (key.search("alert") != -1) {
          AsyncStorage.getItem(key).then((alert) => {
            if (checkJSON(alert)) {
              placelistChangeHandler(JSON.parse(alert));
            }
          })
        }
      });
    } catch (error) {
      // Error loading data
    }
  }
  const _removeItem = async (id) => {
    try {
      await AsyncStorage.removeItem("alert" + id);
      console.log("removed id " + id);
      _retrieveData();
    } catch (error) {
    }
  }
  const checkJSON = (value) => {
    try {
      JSON.parse(value);
      return true;
    } catch (error) {
      return false;
    }
  }
  const validateDate = () => {
    let dateString = date;
    let dateformat = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
    // Match the date format through regular expression      
    if (dateString.match(dateformat)) {
      let operator = dateString.split('/');
      // Extract the string into month, date and year      
      let datepart = [];
      if (operator.length > 1) {
        datepart = dateString.split('/');
      }
      let day = parseInt(datepart[0]);
      let month = parseInt(datepart[1]);
      let year = parseInt(datepart[2]);
      // Create list of days of a month      
      let ListofDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      if (month == 1 || month > 2) {
        if (day > ListofDays[month - 1]) {
          ///This check is for Confirming that the date is not out of its range      
          return false;
        }
      } else if (month == 2) {
        let leapYear = false;
        if ((!(year % 4) && year % 100) || !(year % 400)) {
          leapYear = true;
        }
        if ((leapYear == false) && (day >= 29)) {
          return false;
        } else
          if ((leapYear == true) && (day > 29)) {
            console.log('Invalid date format!');
            return false;
          }
      }
    } else {
      console.log("Invalid date format!");
      return false;
    }
    return true;
  }
  const newAlertSubmitHandler = () => {
    let go = true;
    if (!validateDate()) { inputDateErrorHandler(true); go = false; }
    if (address.trim().length == 0) { inputAddressErrorHandler(true); go = false; }
    if (radius.trim().length == 0) { inputRadiusErrorHandler(true); go = false; }
    if (body.trim().length == 0) { inputBodyErrorHandler(true); go = false; }

    if (go) {
      let rand = Math.random().toString();
      _storeData({ date: date.trim(), address: address.trim(), radius: radius.trim(), body: body.trim(), id: rand })
      hideNewPlace();
    }
  }

  const monthsMap = new Map();
  monthsMap.set("01", "Jan");
  monthsMap.set("02", "Feb");
  monthsMap.set("03", "Mar");
  monthsMap.set("04", "Apr");
  monthsMap.set("05", "May");
  monthsMap.set("06", "Jun");
  monthsMap.set("07", "Jul");
  monthsMap.set("08", "Aug");
  monthsMap.set("09", "Sep");
  monthsMap.set("10", "Oct");
  monthsMap.set("11", "Nov");
  monthsMap.set("12", "Dec");

  const list = placelist.map(item => {
    return <SwipeItem key={item.id}
      rightButtons={
        <SwipeButtonsContainer style={{ alignSelf: 'center', aspectRatio: 1, flexDirection: 'column', padding: 10 }}>
          <View style={styles.deleteIcon}>
            <Ionicons onPress={() => _removeItem(item.id)} name="trash" size="30px" color="white" style={styles.deleteIcon}></Ionicons>
          </View>
        </SwipeButtonsContainer >
      }>
      <View style={[styles.item, styles.shadow]}>
        <View style={styles.itemDate}>
          <Text style={styles.itemMonth}>{monthsMap.get(item.date.substring(3, 5))}</Text>
          <Text style={styles.itemDay}>{item.date.substring(0, 2)}</Text>
          <Text style={styles.itemYear}>{item.date.substring(6, 11)}</Text>
        </View>
        <View style={styles.itemAddress}>
          <Text style={{ fontSize: 11, textTransform: 'uppercase', fontWeight: "bold", margin: 5 }} /*onPress={showInfo}*/>{item.address}</Text>
          <Text style={{ margin: 5, fontSize: 12 }}>{item.body}</Text>
        </View>
        <Modal
          animationType='slide'
          transparent={true}
          visible={itemInfoModalVisible}>
          <View style={[styles.itemInfo, styles.shadow]}>
            <View style={[styles.itemInfoBody]}>
              <ScrollView>
                <Text style={{ margin: 5 }}>{item.body}</Text>
              </ScrollView>
            </View>
            <View style={[styles.itemInfoFooter, styles.shadow]}>
              <View>
                <Ionicons style={styles.itemInfoQuit} name="close-outline" onPress={hideInfo}></Ionicons>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SwipeItem>
  });

  return (
    <View style={styles.container}>
      <View style={[styles.mapContainer, styles.shadow]}>
        {/*<MapView style={styles.map} />*/}
      </View>
      <View style={[styles.addIconContainer]}>
        <Ionicons onPress={showNewPlace} name="add-circle" size="65px" color="white" style={[styles.addIcon]}></Ionicons>
      </View>

      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        <SwipeProvider>
          {list}
        </SwipeProvider>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={newPlaceModalVisible}
        onRequestClose={hideNewPlace}
        style={{}}>
        <View style={[styles.newAlertContainer, styles.shadow]}>
          <View style={[styles.newAlertBody]}>

            {/*DATE*/}
            <View style={[styles.shadow, styles.inputField, inputDateError ? styles.inputError : styles.inputDate]}>
              {/*<Text style={{ marginVertical: 5, marginHorizontal: 10, fontSize: 12, color: 'grey' }}>Date</Text>*/}
              <Ionicons style={{ fontSize: 22, color: 'tomato', marginHorizontal: 10 }} name='calendar-outline'></Ionicons>
              <TextInput style={{ flex: 1, fontSize: 14, marginRight: 10, outlineStyle: 'none' }} onChangeText={dateChangeHandler} onFocus={dateFocusHandler} value={date} placeholder="gg/mm/aaaa"></TextInput>
            </View>

            {/*ADDRESS*/}
            <View style={[styles.inputField, styles.shadow, inputAddressError ? styles.inputError : styles.inputField]}>
              {/*<Text style={{ marginVertical: 5, marginHorizontal: 10, fontSize: 12, color: 'grey' }}>Address</Text>*/}
              <Ionicons style={{ fontSize: 22, color: 'tomato', marginHorizontal: 10 }} name='map-outline'></Ionicons>
              {/*<TextInput style={{ flex: 1, fontSize: 14, marginRight: 10, outlineStyle: 'none' }} autocorrect={false} onChangeText={addressChangeHandler} onFocus={addressFocusHandler} value={address} placeholder="Address.." />*/}

              <GooglePlacesAutocomplete
                placeholder='Address..'
                styles={{
                  textInputContainer: { height: '100%' },
                  textInput: {  paddingLeft: 0, fontSize: 14, marginRight: 10, outlineStyle: 'none' }
                }}
                onPress={(data) => {console.log(data); addressChangeHandler(data.description)}}
                query={{ key: 'AIzaSyDSBuX4e0o6-0wFa8xsXZYrYRBEd3atRtQ', language: 'it' }}
                requestUrl={{
                  url: "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api",
                  useOnPlatform: "web"
                }}
                renderRow={(rowData) => {
                  const title = rowData.structured_formatting.main_text;
                  const address = rowData.structured_formatting.secondary_text;
                  return (
                    <View>
                      <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{title}</Text>
                      <Text style={{ fontSize: 14 }}>{address}</Text>
                    </View>
                  );
                }}
              />

            </View>

            {/*RADIUS*/}
            <View style={[styles.inputField, styles.shadow, inputRadiusError ? styles.inputError : styles.inputField]}>
              {/*<Text style={{ marginVertical: 5, marginHorizontal: 10, fontSize: 12, color: 'grey' }}>Radius</Text>*/}
              <Ionicons style={{ fontSize: 22, color: 'tomato', marginHorizontal: 10 }} name='locate-outline'></Ionicons>
              <TextInput style={{ flex: 1, fontSize: 14, marginRight: 10, outlineStyle: 'none' }} autocorrect={false} onChangeText={radiusChangeHandler} onFocus={radiusFocusHandler} value={radius} placeholder="Distance from position.." />
              <Text style={{ fontSize: 14, marginRight: 10 }}>Meters</Text>
            </View>

            {/*REMINDER*/}
            <Text style={{ marginVertical: 5, marginHorizontal: 15, fontSize: 14, color: 'grey' }}>Remind me to..</Text>
            <View style={[styles.inputBody, styles.shadow, inputBodyError ? styles.inputError : styles.inputBody]}>
              <TextInput style={{ flex: 1, padding: 10, outlineStyle: 'none' }} maxLength={150} multiline={true} numberOfLines={5} onChangeText={bodyChangeHandler} onFocus={bodyFocusHandler} value={body}></TextInput>
            </View>

          </View>
          <View style={[styles.newAlertFooter]}>
            <Text style={[styles.newAlertFooterbutton, styles.newAlertBackBtn, styles.shadow]} onPress={hideNewPlace}>BACK</Text>
            <Text style={[styles.newAlertFooterbutton, styles.newAlertSaveBtn, styles.shadow]} onPress={newAlertSubmitHandler}>SAVE</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  borderShow: {
    borderWidth: 0.5
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7
  },
  inputError: {
    borderWidth: 1,
    borderColor: 'red'
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    backgroundColor: 'tomato'
  },
  mapContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderBottomRightRadius: '35%',
    borderBottomLeftRadius: '35%'
  },
  map: {
  },
  listContainer: {
    flex: 1,
    width: '100%',
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25
  },
  item: {
    flexDirection: 'row',
    marginTop: 5,
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: 'white'
  },
  itemDate: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
    borderRightWidth: 1,
    borderRightColor: 'tomato'
  },
  itemMonth: {
    alignSelf: 'center',
    fontWeight: 'bold'
  },
  itemDay: {
    fontSize: 25,
    alignSelf: 'center',
    color: 'tomato',
    fontWeight: 'bold'
  },
  itemYear: {
    alignSelf: 'center',
    fontWeight: 'bold'
  },
  itemAddress: {
    marginVertical: 5,
    flex: 4,
    justifyContent: 'center'
  },
  addIconContainer: {
    marginTop: -45
  },
  addIcon: {
    flex: 1,
    alignSelf: 'flex-end',
    marginVertical: 10
  },
  deleteIcon: {
    flex: 1,
    alignItems: 'center',
    margin: 'auto'
  },
  newAlertContainer: {
    display: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    margin: 'auto',
    width: '90%',
    height: '50%',
    borderRadius: 20,
    backgroundColor: 'white',
    paddingVertical: 10
  },
  newAlertBody: {
    marginBottom: 10,
    flex: 6,
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  newAlertFooter: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20
  },
  inputField: {
    height: 55,
    flexDirection: 'row',
    marginHorizontal: 15,
    alignItems: 'center'
  },
  inputBody: {
    flexDirection: 'row',
    marginHorizontal: 15,
    alignItems: 'center'
  },
  newAlertFooterbutton: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
    fontSize: 15,
    marginVertical: 20
  },
  newAlertSaveBtn: {
    backgroundColor: 'tomato',
    color: 'white'
  },
  newAlertBackBtn: {
    backgroundColor: 'white',
    color: 'potato'
  },
  itemInfo: {
    display: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    margin: 'auto',
    width: '90%',
    height: '40%',
    borderRadius: 20,
    backgroundColor: 'white'
  },
  itemInfoFooter: {
    flex: 0.5,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 5
  },
  itemInfoBody: {
    flex: 3,
    padding: 20
  },
  itemInfoQuit: {
    fontSize: 30,
    color: 'tomato',
    margin: 'auto'
  }
})
