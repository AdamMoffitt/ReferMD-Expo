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

export default class BasicDoctorItem extends Component {

  constructor(props) {
    super(props);

  }

  render() {
    return (
        <View style={styles.basic}>
            <Text style = {styles.name} > {this.props.doctorData.doctorName} </Text>
              <Text style={styles.phoneNumber} onPress={() => Linking.openURL('tel://'.concat(this.props.doctorData.doctorPhoneNumber))}>
                  {this.props.doctorData.doctorPhoneNumber.replace('+1 ','')}
              </Text>
        </View>
      )
    }
}

const styles = StyleSheet.create({
  basic: {
    borderColor: COLORS.mainColor,
    borderWidth: 10,
    borderRadius: 15,
    height: 50,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff'
    },
    info: {
      flexDirection: 'row',
      flex: 2,
    },
    name: {
      marginLeft: 10,
      flex: 1.6,
    },
    phoneNumber: {
      color: 'blue',
      justifyContent: 'flex-end',
      marginRight: 5,
      flex: 1,
      // backgroundColor: '#ff43ff',
      textAlign: 'right'
    }
});

AppRegistry.registerComponent('BasicDoctorItem', () => BasicDoctorItem);
