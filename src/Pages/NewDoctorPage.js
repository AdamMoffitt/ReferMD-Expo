'use strict';
import * as Yup from 'yup';
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  Image,
  AppRegistry,
  TouchableOpacity,
  Picker
} from 'react-native';
import { Button } from 'react-native-elements';
import { useFormik } from 'formik';
import styled from '@emotion/styled';
import PropTypes from 'prop-types'
import { addDoctor } from '../Services/ItemService';
import Form from 'react-native-form'
import { TextInputMask } from 'react-native-masked-text'
import {specialties} from '../Resources/specialties'
import {COLORS} from '../Resources/constants.js';

/*********************** NewDoctorPage *****************************/
/*************************************************************************/

const referoptionsarray = ["Consult Only", "Evaluate"];

// And now we can use these
export default class NewDoctorPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumberFormat: '',
      phoneNumber: '',
      specialty: 'Internal Medicine',
      subSpecialty: 'Adolescent Medicine',
    };
  }

  addNewDoctor() {
    console.log(this.state);
    addDoctor(this.state);
    const doctor = this.state;
    const doctorData = {
      label:doctor.firstName + " " + doctor.lastName,
      type:1,
      doctorName:doctor.firstName + " " + doctor.lastName,
      doctorEmail:doctor.email,
      doctorPhoneNumber:doctor.phoneNumber,
      height:50,
      backgroundColor: 'transparent'
    }
    if (this.validate()) {
      this.props.navigation.navigate('ReferPage', {doctor: doctorData});
    }
  }

  validate() {
    const doctor = this.state;
    console.log(doctor);
    if (doctor.firstName == "") {
      this.state.error = "Please enter the Doctor's First Name";
      return false;
    } else if (doctor.lastName == "") {
      this.state.error = "Please enter the Doctor's Last Name";
      return false;
    } else if (doctor.email == "") {
      this.state.error = "Please enter the Doctor's Phone Number";
      return false;
    } else if (doctor.phoneNumber == "") {
      this.state.error = "Please enter the Doctor's Email";
      return false;
    } else {
      this.state.error = "";
      return true;
    }
  }

  handleChange = amount => {
    this.setState({ amount })
  }

  // TODO: ADD DOCTOR SPECIALTY PICKER
  render() {
    const user = this.props.navigation.getParam('user', {});
    console.log("user:" + user);
    return (
      <View style={styles.container}>
        <Form ref="form" styles={styles.form}>
          <Image
            // source={require('../Resources/referMD_logo.png')}
            style={styles.image}
            />
          <TextInput
            style={styles.textInput}
            name = "firstName"
            placeholder="Doctor's First Name"
            onChangeText={text => this.setState({firstName: text})}
            />
          <TextInput
            style={styles.textInput}
            name = "lastName"
            placeholder="Doctor's Last Name"
            onChangeText={text => this.setState({lastName: text})}
            />
          <TextInputMask
            placeholder="Phone Number"
            style={styles.textInput}
            value={this.state.phoneNumber}
            onChangeText={(phoneNumber) => {
              let phoneNumberFormat = phoneNumber.toString().replace(/\D+/g, '');
              this.setState({phoneNumber: phoneNumber, phoneNumberFormat: phoneNumberFormat})
            }}
            type={'cel-phone'}
            maxLength={this.state.phoneNumber.toString().startsWith("1") ? 18 : 16}
            options={
              this.state.phoneNumberFormat.startsWith("1") ?
              {
                dddMask: '9 (999) 999 - '
              } : {
                dddMask: '(999) 999 - '
              }
            }
            />
          <TextInput
            style={styles.textInput}
            name = "email"
            placeholder="Email"
            onChangeText={text => this.setState({email: text})}
            />
        </Form>
        <Text style={styles.error}>{this.state.message}</Text>
        <View style={styles.picker}>
        <Text style={styles.text}>Specialty: </Text>
          <Picker
              style={styles.specialtyPicker}
              itemStyle={styles.pickerItem}
                  selectedValue={this.state.specialty}
              onValueChange={(specialty, specialtyIndex, name) => {
                  this.setState({ specialty: specialty })}}>
                {Object.keys(specialties).map((key, index) =>
                {
                  const specialty = specialties[key];
                  var specialtyName = specialty.name;
                  if (user.favoriteSpecialties != null) {
                    if (specialtyName in user.favoriteSpecialties) {
                      specialtyName = "⭐ " + specialtyName;
                    }
                  }

                  return (<Picker.Item label={specialtyName} value={specialty.name} key={key} />)}
                )}
          </Picker>
          {/*<Picker
              style={styles.subSpecialtyPicker}
              itemStyle={styles.pickerItem}
              selectedValue={this.state.subSpecialty}
              onValueChange={(subSpecialty, specialtyIndex) => this.setState({ subSpecialty: subSpecialty })}>
                {specialties[this.state.specialty].subSpecialties.map((subSpecialty, index) =>
                {
                  return (<Picker.Item label={subSpecialty} value={subSpecialty} key={index} />)}
                )}
          </Picker> */}
        </View>
        <Button buttonStyle={styles.addButton} onPress={() => this.addNewDoctor()} title="Add Doctor" />
      </View>
    );
  }
}
/*************************************************************************/
/*************************************************************************/

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  image: {
    width: 300,
    height: 100,
  },
  form: {
    flex: 8
  },
  textInput: {
    width: 300,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
  },
  picker: {
    width: 300,
    flexDirection: 'row',
    // backgroundColor: '#a34aa5',
  },
      specialtyPicker: {
        margin: 10,
        flex: 1,
        // backgroundColor: '#f34aa5'
      },
      subSpecialtyPicker: {
        margin: 10,
        flex: 1,
      },
          pickerItem: {
            fontSize: 15,
          },
  notes: {
    width: 300,
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
  },
  addButton: {
    backgroundColor: COLORS.mainColor,
    width: 300,
  },
  error: {
    fontSize: 12,
    textAlign: 'left',
    color: 'red',
    marginLeft: 10
  },
});

AppRegistry.registerComponent('NewDoctorPage', () => NewDoctorPage);
