import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  Image,
  AppRegistry,
  Linking,
} from 'react-native';
import {COLORS} from '../../Resources/constants.js';

export default class SilverDoctorItem extends Component {

  constructor(props) {
    super(props);

  }

  render() {
    return (
        <View style={styles.silver}>
          <View style={styles.names}>
            <Text style={styles.text}> {this.props.doctorData.practiceName} </Text>
            <Text style={styles.text}> {this.props.doctorData.doctorName} </Text>
          </View>
            <View style={styles.contactInfo}>
              <Text style={ styles.phoneNumber} onPress={() => Linking.openURL('tel://'.concat(this.props.doctorData.doctorPhoneNumber))}>
                  {this.props.doctorData.doctorPhoneNumber.replace('+1 ','')}
              </Text>
            <Text style={ styles.website } onPress={() => Linking.openURL(this.props.doctorData.doctorWebsite) }>
                {this.props.doctorData.doctorWebsite}
            </Text>
          </View>
        </View>
      )
    }
}

const styles = StyleSheet.create({
  silver: {
    borderColor: COLORS.mainColor,
    borderWidth: 10,
    borderRadius: 15,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    justifyContent: 'flex-start',
    alignItems: 'center',
    },
    names: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      margin: 10,
      marginLeft: 10,
      marginRight: 0,
    },
    contactInfo: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-end',
      marginRight: 20,
      marginLeft: 10,
    },
    text: {
      marginBottom: 5,
    },
    phoneNumber: {
      color: 'blue',
      marginBottom: 5,
      marginTop: 5,
      justifyContent: 'flex-end',
      textAlign: 'right'
    },
    website: {
      color: 'blue',
      marginBottom: 5,
      marginTop: 5,
      textAlign: 'right'
    },
});

AppRegistry.registerComponent('SilverDoctorItem', () => SilverDoctorItem);
