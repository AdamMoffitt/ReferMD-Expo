// Loading.js
import React, { Component } from 'react'
import { View, Text, ActivityIndicator, StyleSheet, AppRegistry } from 'react-native'
import firebase from '@react-native-firebase/app';
import {getDoctorThenUpdate, updateTokens} from '../../Services/ItemService';
import {COLORS} from '../../Resources/constants';
import { AuthContext } from '../../Services/AuthContext.js';
import { AsyncStorage } from 'react-native';

export default class Loading extends React.Component {

  static contextType = AuthContext;

  static navigationOptions = {
       headerShown: false,
  }

  constructor(){
      super();
      this.state = {firstLaunch: null};
  }

  componentDidMount() {
    AsyncStorage.getItem("alreadyLaunched").then(value => {
      if(value == null){
           AsyncStorage.setItem('alreadyLaunched', "true"); // No need to wait for `setItem` to finish, although you might want to handle errors
           this.setState({firstLaunch: true});
           this.props.navigation.replace('Onboarding');
      }
      else{
           this.setState({firstLaunch: false});
           console.log("checkFirebaseLogin")
           this.checkFirebaseLogin();
      }
    }) // Add some error handling, also you can simply do this.setState({firstLaunch: value == null})
  }

  checkFirebaseLogin = () => {
    console.log("check firebase auth");
    firebase.auth().onAuthStateChanged(async user => {
      console.log("!!!!!!!!!!!!!!!!!USER!!!!!!!!!!!!!!!!!!!!");
      console.log(user);
      if (user == null || user === undefined) {
        console.log("user is null");
        this.props.navigation.replace('SignUp');
        return;
      } else {
          await getDoctorThenUpdate(user.uid, async (doctor) => {
              console.log("CALLBACK", doctor);
              updateTokens(doctor);
              if (typeof this.context.updateUserDoctor === 'function') {
                  this.context.updateUserDoctor(doctor);
              }
              console.log("context 3 ",this.context);
              this.props.navigation.replace(doctor ? 'ReferStartPage' : 'SignUp', {user: doctor})
          }).catch(err => console.log("error: ", error))
      }})
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Loading</Text>
        <ActivityIndicator size="large" />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.mainColor,
  }
})

AppRegistry.registerComponent('Loading', () => Loading);
