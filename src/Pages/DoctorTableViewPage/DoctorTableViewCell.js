import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  Image,
  AppRegistry,
  TouchableOpacity
} from 'react-native';
import PlatinumDoctorItem from './PlatinumDoctorItem';
import SilverDoctorItem from './SilverDoctorItem';
import BasicDoctorItem from './BasicDoctorItem';
import {COLORS} from '../../Resources/constants.js';
import NavigationService from '../../Services/NavigationService.js';

export default class DoctorTableViewCell extends Component {

  constructor(props) {
    super(props);
    console.log("cell constructor");
  }

  renderRow = (rowData) => {
    console.log("DoctorTableViewCell ROWDATA");
    console.log(rowData);
    if (rowData !== undefined) {
      switch(rowData.type) {
        case 3:
          return <PlatinumDoctorItem backgroundColor={'transparent'} doctorData={rowData}/>;
        case 2:
          return <SilverDoctorItem backgroundColor={'#0000ff'} doctorData={rowData}/>;
        case 1:
          return <BasicDoctorItem doctorData={rowData}/>;
        default:
          return <BasicDoctorItem doctorData={rowData}/>;
      }
    } else {
      return <BasicDoctorItem doctorData={rowData}/>;
    }
};

  render() {
    console.log("DoctorTableViewCellPROPS");
    console.log(this.props);
    return (
      <TouchableOpacity style={{width:this.props.width}} onPress={event => NavigationService.navigate('ReferPage', {doctor: this.props})}>
        {this.renderRow(this.props)}
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({

});

AppRegistry.registerComponent('DoctorTableViewCell', () => DoctorTableViewCell);
