import React from 'react';
import { AppRegistry, StyleSheet, Text, View, Alert, Image } from 'react-native';
import { Icon} from 'react-native-elements'
import AppIntroSlider from 'react-native-app-intro-slider';
import {COLORS} from '../../Resources/constants';
import NavigationService from '../../Services/NavigationService.js';

const styles = StyleSheet.create({
  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, .2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 350,
    resizeMode: 'contain'
  },
  text: {
    fontSize: 24,
    marginBottom: 100
  },
  title: {
    marginTop: 100,
    fontSize: 36
  },
});

const slides = [
  {
    key: '1',
    title: 'Welcome to ReferMD!',
    titleStyle: styles.title,
    text: 'ReferMD is built to facilitate referrals between primary care physicians, specialty doctors, and patients.',
    textStyle: styles.text,
    image: require('../../Resources/doctorIcons/doctor.png'),
    backgroundColor: COLORS.secondaryColor,
    imageStyle: styles.image,
  },
  {
    key: '2',
    title: 'Referring',
    titleStyle: styles.title,
    text: "ReferMD makes referring patients to doctors easy. Simply choose a specialty, select the doctor you wish to refer to, enter the Patient's Info, and Refer!",
    textStyle: styles.text,
    image: require('../../Resources/doctorIcons/pointingDoctor.png'),
    backgroundColor: COLORS.mainColor,
    imageStyle: styles.image,
  },
  {
    key: '3',
    title: 'Upgrade',
    titleStyle: styles.title,
    text: "To customize your profile, publicize more information, and increase referrals to you, you may upgrade your Doctor profile at any time.",
    textStyle: styles.text,
    image: require('../../Resources/doctorIcons/xrayDoctor.png'),
    backgroundColor: COLORS.tertiaryColor,
    imageStyle: styles.image
},
];

export default class Onboarding extends React.Component {

  static navigationOptions = {
       header: null,
  }

  _renderNextButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon
          style={{ backgroundColor: 'transparent' }}
          size={24}
          raised
          reverse
          name='keyboard-arrow-right'
          color='#aaaaaa'/>
      </View>
    );
  };
  _renderDoneButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon
          style={{ backgroundColor: 'transparent' }}
          size={24}
          raised
          reverse
          name='check-circle'
          type='font-awesome'
          color='#aaaaaa'/>
      </View>
    );
  };
  render() {
    return (
      <AppIntroSlider
        slides={slides}
        renderDoneButton={this._renderDoneButton}
        renderNextButton={this._renderNextButton}
        onDone={ () => NavigationService.replace('SignUp')}
      />
    );
  }
}




AppRegistry.registerComponent('Onboarding', () => Onboarding);
