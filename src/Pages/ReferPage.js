/**
 * This component is the main component where a
 * doctor can refer a patient to a primary care physician.
 *
 */

'use strict';

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  Image,
  AppRegistry,
  Dimensions,
  KeyboardAvoidingView
} from 'react-native';
import {  Overlay, Button, CheckBox } from 'react-native-elements'
import {thisExpression} from '@babel/types';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/functions';
import '@react-native-firebase/auth';
import {Formik, Form, useField} from 'formik';
import * as Yup from 'yup';
import styled from '@emotion/styled';
// import Picker from 'react-native-picker';
import ReferForm from './ReferForm';
import PropTypes from 'prop-types'
import DoctorTableViewCell from './DoctorTableViewPage/DoctorTableViewCell';
import {COLORS} from '../Resources/constants.js';
import {sendReferral, storeReferralData} from '../Services/ItemService';
import { AuthContext } from '../Services/AuthContext.js';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


// firebase.functions().useFunctionsEmulator('http://localhost:5000');

// async function sendReferralEmails(doctorParms, patientParms) {
//   console.log('send doctor email');
//   console.log(doctorParms);
//   console.log('send patient email');
//   console.log(patientParms);
//   try {
//     // Create or sign the user into a anonymous account
//     await firebase.auth().signInAnonymously();
//     console.log('signed in');
//     /**************** SEND PATIENT EMAIL *******************/
//     var sendPatient = firebase
//       .functions()
//       .httpsCallable('sendReferralEmailToPatient');
//     sendPatient({patientParms})
//       .then(function(result) {
//         console.log('Send Patient Cloud Function called successfully.', result);
//       })
//       .catch(function(error) {
//         // Getting the Error details.
//         var code = error.code;
//         var message = error.message;
//         var details = error.details;
//         // [START_EXCLUDE]
//         console.log(
//           'There was an error when calling the Send Patient Cloud Function',
//           error,
//         );
//         window.alert(
//           'There was an error when calling the Send Patient Cloud Function:\n\nError Code: ' +
//             code +
//             '\nError Message:' +
//             message +
//             '\nError Details:' +
//             details,
//         );
//       });
//     /**************************************************/
//
//     /******************** SEND DOCTOR EMAIL******************************/
//     var sendDoctor = firebase
//       .functions()
//       .httpsCallable('sendReferralEmailToDoctor');
//     sendDoctor({doctorParms})
//       .then(function(result) {
//         console.log('Send Doctor Cloud Function called successfully.', result);
//       })
//       .catch(function(error) {
//         // Getting the Error details.
//         var code = error.code;
//         var message = error.message;
//         var details = error.details;
//         // [START_EXCLUDE]
//         console.log(
//           'There was an error when calling the Send Doctor Cloud Function',
//           error,
//         );
//         window.alert(
//           'There was an error when calling the Send Doctor Cloud Function:\n\nError Code: ' +
//             code +
//             '\nError Message:' +
//             message +
//             '\nError Details:' +
//             details,
//         );
//       });
//     /**************************************************/
//   } catch (e) {
//     console.log(e);
//   }
// }



export default class ReferPage extends Component {

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      message: '',
      isOverlayVisible: false,
      overlayTitle: "Sending Referral..."
    };
  }

  static navigationOptions = {
    title: 'Refer',
  };

  /*********************************************************************************/
  /***************************** ON REFER PRESSED **********************************/
  /*********************************************************************************/
   onReferPressed = (doctor, patientValues, notes) => {
    console.log('refer pressed');
    this.setState({isOverlayVisible: true});
    console.log("patient Values: ", patientValues);
    console.log('doctor Values ', doctor);
    const userDoctor = this.context.userDoctor;
    console.log("userDoctor Values", userDoctor);

    // Format phone numbers to E164 for Twilio
    let patientPhoneNumber = patientValues.phoneNumber.startsWith('+1') ? patientValues.phoneNumber
                                                                        : patientValues.phoneNumber.startsWith('1')
                                                                        ? "+".concat(patientValues.phoneNumber)
                                                                        : "+1".concat(patientValues.phoneNumber);
    let patientPhoneNumberE164 = patientPhoneNumber.replace('(','').replace(')','').replace(' - ','').replace(/\s+/g, '');
    console.log(patientPhoneNumber, " -> ", patientPhoneNumberE164);

    let doctorPhoneNumber = doctor.doctorPhoneNumber.startsWith('+1') ? doctor.doctorPhoneNumber
                                                                      : doctor.doctorPhoneNumber.startsWith('1')
                                                                      ? "+".concat(doctor.doctorPhoneNumber)
                                                                      : "+1".concat(doctor.doctorPhoneNumber);
    let doctorPhoneNumberE164 = doctorPhoneNumber.replace('(','').replace(')','').replace(' - ','').replace(/\s+/g, '');
    console.log(doctorPhoneNumber, " -> ", doctorPhoneNumberE164);

    const referralParms = {
      patientFirstName: patientValues.firstName,
      patientLastName: patientValues.lastName,
      patientEmail: patientValues.email,
      patientPhoneNumber: patientValues.phoneNumber,
      patientPhoneNumberE164: patientPhoneNumberE164,
      patientNotes: notes,
      referringDoctorName: userDoctor.name,
      referringDoctorEmail: userDoctor.email,
      referringDoctorPhoneNumber: userDoctor.phoneNumber,
      referringDoctorAddress: userDoctor.address,
      referringDoctorWebsite: userDoctor.website,
      referringDoctorImageURL: userDoctor.imageURL,
      referringDoctorId: userDoctor.id,
      doctorName: doctor.doctorName,
      doctorEmail: doctor.doctorEmail,
      doctorPhoneNumber: doctor.doctorPhoneNumber,
      doctorPhoneNumberE164: doctorPhoneNumberE164,
      doctorWebsite: doctor.doctorWebsite,
      doctorAddress: doctor.address,
      doctorImageURL: doctor.imageURL,
      doctorId: doctor.id,
      doctorSpecialty: doctor.specialty,
      referralNotificationTokens: doctor.doctorNotificationTokens
    };

    sendReferral(referralParms).then((message) => {
        console.log("referral sent", message);
        this.setState({overlayTitle: "Referral Sent!"});
      });
    storeReferralData(userDoctor.id, doctor.id, referralParms);

  }
  /*************************************************************************/

  /*************************************************************************/
  renderOverlay = () => (
    <Overlay
      isVisible={this.state.isOverlayVisible}
      onBackdropPress={() => {
          this.setState({ isOverlayVisible: false })
          this.props.navigation.navigate('ReferStartPage')}}
      style={styles.upgradeOverlay}
      windowBackgroundColor={COLORS.greyBackground}
      overlayBackgroundColor={COLORS.mainColor}
      height={Dimensions.get('window').height * (3 / 5)}
      width={Dimensions.get('window').width * (4 / 5)}
      animationType={'slide'}
      >
      <Text style={styles.overlayTitle}>{this.state.overlayTitle}</Text>
      <Image
        source={require('../Resources/doctorIcons/doctorWClipboard.png')}
        style={styles.overlayImage}
        />
      <Button title="Close" style={styles.overlayCloseButton} onPress={() => {
          this.setState({ isOverlayVisible: false });
          this.props.navigation.navigate('ReferStartPage')}}
          />
      </Overlay>
    )

    toggleOverlay = () => {
      this.setState({ isOverlayVisible: !this.state.isOverlayVisible });
    };
    /*************************************************************************/

  /*************************************************************************/

  render() {
    const spinner = this.state.isLoading ? (
      <ActivityIndicator size="large" />
    ) : null;
    const { navigation } = this.props;
    const doctor = navigation.getParam('doctor');
    console.log("doctor parms here!!!!!!!");
    console.log(doctor);
    const type = doctor.type === undefined ? 1 : doctor.type;
    var cellHeight = 50;
    if (type == 3) {
      console.log('platinum');
      cellHeight = 150;
    } else if (type == 2) {
      console.log('silver');
      cellHeight = 100;
    } else {
      console.log('basic');
      cellHeight = 50;
    }

    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
          <Image
            // source={require('../Resources/referMD_logo.png')}
            style={styles.image}
          />
        <View styles={styles.referringView}>
          <Text style={{textAlign: 'center'}}> Referring to: </Text>
          <DoctorTableViewCell
            style={{flex: 1}}
            width={Dimensions.get('window').width * (4.8 / 5)}
            label={doctor.doctorName}
            type={doctor.type}
            practiceName={doctor.practiceName}
            doctorName={doctor.doctorName}
            doctorEmail={doctor.doctorEmail}
            doctorPhoneNumber={doctor.doctorPhoneNumber}
            doctorWebsite={doctor.doctorWebsite}
            imageURL= {doctor.imageURL}
            logoURL= {doctor.logoURL}
            height={cellHeight}
            backgroundColor= {'transparent'}>
          </DoctorTableViewCell>
        </View>
          <ReferForm style={styles.referForm} onReferPressed={this.onReferPressed} doctor={doctor}/>
          {spinner}
      {this.renderOverlay()}
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 10,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  image: {
    resizeMode: 'contain',
    width: Dimensions.get('window').width * (4 / 5),
    flex: 1
  },
  referringView: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    flex: 2,
    backgroundColor: COLORS.mainColor,
  },
  referForm: {
    flex: 6,
  },
  upgradeOverlay: {
    margin: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayImage: {
    flex: 2,
    resizeMode: 'contain',
    alignSelf: 'center',
    height: Dimensions.get('window').height * (4 / 5),
    width: Dimensions.get('window').width * (3 / 5),
  },
  overlayTitle: {
    flex: 1,
    marginTop: 20,
    fontSize: 28,
    textAlign: 'center',
  },
  description: {
    flex: 0.5,
  }
});

AppRegistry.registerComponent('ReferPage', () => ReferPage);
