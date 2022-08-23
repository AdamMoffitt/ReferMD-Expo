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
  KeyboardAvoidingView,
Dimensions
} from 'react-native';
import { Button, CheckBox } from 'react-native-elements';
import {Formik, Field, Form, useField} from 'formik';
import styled from '@emotion/styled';
import PropTypes from 'prop-types'
import {COLORS} from '../Resources/constants.js';
import { TextInputMask } from 'react-native-masked-text'
import PhoneInput from 'react-native-phone-input'
import AutoExpandingTextInput from '../Resources/AutoExpandingTextInput.js';
/*********************** ReferForm *****************************/
/*************************************************************************/

const SignupSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('Required'),
  lastName: Yup.string()
    .required('Required'),
  phoneNumber: Yup.string()
    .required('Required'),
    email: Yup.string()
    .email('Invalid email address')
});


// And now we can use these
export default class ReferForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedReferOption: "Consult Only",
      phoneNumberFormat: '',
      phoneNumber: '',
    };
    let data = [];
    for(var i=0;i<100;i++){
        data.push(i);
    }
  }

  renderReferOptions = (type) => {
      if (type == 3) {
        return (
          <View style={styles.referralOptions}>
            <CheckBox
                center
                title='Consult Only'
                checked={this.state.selectedReferOption == "Consult Only"}
                containerStyle={{backgroundColor: 'transparent', borderWidth: 0}}
                onPress={() => this.setState({selectedReferOption: "Consult Only"})}
              />
            <CheckBox
              center
              title='Evaluate and Treat'
              checked={this.state.selectedReferOption == "Evaluate and Treat"}
              containerStyle={{backgroundColor: 'transparent', borderWidth: 0}}
              onPress={() => this.setState({selectedReferOption: "Evaluate and Treat"})}
            />
          </View>
        )} else if (type == 2) {
        return (
          <AutoExpandingTextInput
                name="notes"
                style={styles.textInput}
                placeholder="Notes"
                enablesReturnKeyAutomatically={true}
                returnKeyType={'done'}
                autoCorrect={true}
                multiline={true}
              /> )
      }
  }

  render() {
    console.log("refer form parms ", this.props);
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <Formik
          initialValues={{firstName: '', lastName: '', phoneNumber: '', email: ''}}
          onSubmit={values => {
                  console.log("submit pushed ", values);
                  const notes = this.props.doctor.type == 3 ? values.notes
                                : this.props.doctor.type == 2 ? this.state.selectedReferOption : "";
                  this.props.onReferPressed(this.props.doctor, values, notes);}}
          validationSchema={SignupSchema}>
          {({handleChange, handleBlur, handleSubmit, values, errors}) => (
            <View style = {styles.formikTextFields}>
              <TextInput
                name="firstName"
                value={values.firstName}
                style={styles.textInput}
                onChangeText={handleChange('firstName')}
                onBlur={handleBlur('firstName')}
                placeholder="Patient First Name"
                enablesReturnKeyAutomatically={true}
                returnKeyType={'next'}
autoCorrect={false}
              />
              {errors.firstName ? ( <Text style={styles.error}>{errors.firstName}</Text> ) : null}
              <TextInput
                name="lastName"
                value={values.lastName}
                style={styles.textInput}
                onChangeText={handleChange('lastName')}
                onBlur={handleBlur('lastName')}
                placeholder="Patient's Last Name"
                enablesReturnKeyAutomatically={true}
                returnKeyType={'next'}
autoCorrect={false}
              />
              {errors.lastName ? ( <Text style={styles.error}>{errors.lastName}</Text> ) : null}
              <Field name="phoneNumber" render={({ field, form }) => {
                      return <TextInputMask
                        {...field}
                        name="phoneNumber"
                        placeholder="Phone Number"
                        style={styles.textInput}
                        value={this.state.phoneNumberFormat}
                        onChangeText={(phoneNumberFormat) => {
                          let phoneNumber = phoneNumberFormat.toString().replace(/\D+/g, '');
                          this.setState({phoneNumberFormat: phoneNumberFormat, phoneNumber: phoneNumber})
                          form.setFieldValue(field.name, phoneNumberFormat)
                        }}
                        type={'cel-phone'}
                        maxLength={this.state.phoneNumberFormat.toString().startsWith("1") ? 18 : 16}
                        options={
                          this.state.phoneNumber.startsWith("1") ?
                          {
                            dddMask: '9 (999) 999 - '
                          } : {
                            dddMask: '(999) 999 - '
                          }
                        }
                        />
                    }} />
                {errors.phoneNumber ? ( <Text style={styles.error}>{errors.phoneNumber}</Text> ) : null}
              <TextInput
                name="email"
                value={values.email}
                style={styles.textInput}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                placeholder="Email"
                enablesReturnKeyAutomatically={true}
                returnKeyType={'done'}
autoCorrect={false}
              />
              {console.log(errors, values)}
              {errors.email ? ( <Text style={styles.error}>{errors.email}</Text> ) : null}
              {this.renderReferOptions(this.props.doctor.type)}
              <Button buttonStyle={styles.referButton} onPress={handleSubmit} title="Refer" />
            </View>
          )}
        </Formik>
    </KeyboardAvoidingView>
    );
  }
}
/*************************************************************************/
/*************************************************************************/

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    flex: 6,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  error: {
    fontSize: 12,
    textAlign: 'left',
    color: 'red',
    marginLeft: 10
  },
  image: {
    width: 300,
    height: 100,
  },
  formikTextFields: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  textInput: {
    width: Dimensions.get('window').width * (4 / 5),
    flex: 1,
    margin: 2.5,
    paddingHorizontal: 15,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.mainColor,
    fontSize: 10,

  },
  referButton: {
  backgroundColor: COLORS.mainColor,
  marginTop: 10,
  marginBottom: 10,
  width: Dimensions.get('window').width * (3 / 5)
},
referralOptions: {
  flexDirection: 'row',
},
  notes: {
    width: Dimensions.get('window').width * (4 / 5),
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
  },
});

AppRegistry.registerComponent('ReferForm', () => ReferForm);
