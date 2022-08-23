import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  Image,
  AppRegistry,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
Dimensions
} from 'react-native';
import PropTypes from 'prop-types';
import NavigationService from '../../Services/NavigationService.js';
import {COLORS} from '../../Resources/constants.js';

export default class PlatinumDoctorItem extends Component {

  constructor(props) {
    super(props);
    console.log("platinum props");
    console.log(props);
    this.state = {
      isLoadingImage: true,
    }
  }

  render() {
    const doctor = this.props.doctorData;
    return (
        <View style={styles.platinum}>
        <TouchableOpacity style={styles.platinumImageView} onPress={event => NavigationService.navigate('ProfilePage', {doctor: doctor})} >
          {this.state.isLoadingImage ? <ActivityIndicator style={styles.activityIndicator} size="large" /> : null}
            <Image
              source={{
                uri: doctor.imageURL
              }}
              style={styles.image}
              onLoadStart={() => this.setState({isLoadingImage: true})}
              onLoadEnd={() => this.setState({isLoadingImage: false})}
            />
            <Text style={styles.text, {color: 'blue'}}> View Profile </Text>
          </TouchableOpacity>
            <View style={styles.info} >
              <Text numberOfLines={0} style={styles.text}> {doctor.practiceName} </Text>
              <Text style={styles.text}> {doctor.doctorName} </Text>
              <Text style={styles.text}> {doctor.doctorEmail} </Text>
              <Text style={styles.phoneNumber} onPress={() => Linking.openURL('tel://'.concat(doctor.doctorPhoneNumber))}>
                  {doctor.doctorPhoneNumber.replace('+1 ','')}
              </Text>
              <Text style={styles.website} onPress={() => Linking.openURL(doctor.doctorWebsite)}>
                  {doctor.doctorWebsite}
              </Text>
            </View>
        </View>
      )
    }
}

const styles = StyleSheet.create({
  platinum: {
    borderColor: COLORS.mainColor,
    borderWidth: 10,
    borderRadius: 15,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff'
    },
  platinumImageView: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
  },
  info: {
      flex: 2,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      marginRight: 20,
      marginLeft: 20,
    },
  image: {
    width: 100,
    height: 120
  },
  text: {
    marginBottom: 5,
  },
  phoneNumber: {
    color: 'blue',
    marginBottom: 5,
    marginTop: 5,
  },
  website: {
    color: 'blue',
    marginBottom: 5,
    marginTop: 5,
  },
  activityIndicator: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
});

// export default withNavigation(PlatinumDoctorItem);


AppRegistry.registerComponent('PlatinumDoctorItem', () => PlatinumDoctorItem);
