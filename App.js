/**
 * Sample React Native App with Firebase
 * https://github.com/invertase/react-native-firebase
 *
 * @format
 * @flow
 */

import React, { createContext, Component} from 'react';

import {
  Platform,
  AppRegistry,
  SafeAreaView,
  StyleSheet,
  View,
  Button,
  Text,
  TextInput,
  StatusBar,
  Dimensions,
} from 'react-native';
import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {SwitchNavigator} from 'react-navigation';
// import firebase from '@react-native-firebase/app';
import TabNavigator from 'react-native-tab-navigator';
import Icon from 'react-native-vector-icons/FontAwesome';
import {createAppContainer} from 'react-navigation';
// import {createStore} from 'redux';
// import {Provider} from 'react-redux';
import {createStackNavigator, HeaderBackButton} from 'react-navigation-stack';
import 'react-native-gesture-handler';
import SplashScreen from 'react-native-splash-screen';

import NavigationService from './src/Services/NavigationService';
import { fromTop } from 'react-navigation-transitions'

import ReferStartPage from './src/Pages/ReferStartPage';
import NewDoctorPage from './src/Pages/NewDoctorPage';
import ReferPage from './src/Pages/ReferPage';
import DoctorsTableViewPage from './src/Pages/DoctorTableViewPage/DoctorsTableViewPage';

import Loading from './src/Pages/Authentication/Loading';
import SignUp from './src/Pages/Authentication/SignUp';
import Login from './src/Pages/Authentication/Login';
import PhoneAuthScreen from './src/Pages/Authentication/PhoneAuthScreen';
import Onboarding from './src/Pages/Authentication/Onboarding'

import PDFViewPage from './src/Pages/Profile/PDFViewPage'
import ProfilePage from './src/Pages/Profile/ProfilePage';

import Upgrade from './src/Pages/Profile/Upgrade';

import { AuthProvider } from './src/Services/AuthContext';

Icon.loadFont();

const handleLogOut = ({ scenes }) => { // handle custom transition when logging out
  const prevScene = scenes[scenes.length - 2];
  const nextScene = scenes[scenes.length - 1];

  console.log("scenes: " + scenes);
  console.log("next route: " + nextScene.route.routeName);
  // Custom transitions go there
  if (nextScene.route.routeName === 'Loading') {
    return fromTop();
  } else {
    return fromLeft();
  }
}

const MainNavigator = createStackNavigator(
  {
    Loading: {screen: Loading},
    SignUp: {screen: SignUp},
    Login: {screen: Login},
    ReferStartPage: {screen: ReferStartPage},
    NewDoctorPage: {screen: NewDoctorPage, navigationOptions: ({navigation}) => ({
        title: 'Add a Doctor',
        headerLeft: <HeaderBackButton title='Home' backTitleVisible={true} onPress={() => navigation.navigate('ReferStartPage')} />
      })},
    ReferPage: {screen: ReferPage, navigationOptions: ({navigation}) => ({
        title: 'Refer a Patient',
        headerLeft: <HeaderBackButton title='Home' backTitleVisible={true} onPress={() => navigation.navigate('ReferStartPage')} />
      })},
    DoctorsTableViewPage: {screen: DoctorsTableViewPage},
    ProfilePage: {screen: ProfilePage, title: ""},
    PDFViewPage: {screen: PDFViewPage},
    Onboarding: {screen: Onboarding},
    Upgrade: {screen: Upgrade},
  },
  {
    initialRouteName: 'Loading'
  },
  {
    transitionConfig: (nav) => handleLogOut(nav)
  }
);

const AppContainer = createAppContainer(MainNavigator);

export default class App extends React.Component {

  componentDidMount() {
      SplashScreen.hide()

    }

    constructor(props){
      super(props)
      this.state = {
        userDoctor: null,
        updateUserDoctor: this.updateUserDoctor,
      }
      Text.defaultProps = Text.defaultProps || {};

      Text.defaultProps.adjustsFontSizeToFit = true;
      Text.defaultProps.numberOfLines = 1;
      Text.defaultProps.allowFontScaling = false; // Disallow dynamic type on iOS
      TextInput.defaultProps = Text.defaultProps || {}; //Disable dynamic type in IOS
        TextInput.defaultProps.allowFontScaling = false;
    }

  updateUserDoctor = (doctor) => {
    console.log("Update User Doctor: " + doctor.firstName);
    this.setState({userDoctor: doctor})
  }

  render() {
    console.disableYellowBox = true;
    return (
      <AuthProvider value={this.state}>
        <AppContainer ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }} />
      </AuthProvider>
  )}
}
