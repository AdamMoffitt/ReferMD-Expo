
	/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow
 */

'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {Picker, Text, View, StyleSheet, AppRegistry} = ReactNative;

var PickerItemIOS = PickerIOS.Item;

const specialties =
    {
      Radiology: [
        "Diagnostic Radiology",
        "Interventional Radiology and Diagnostic",
        "Radiology",
        "Radiation Oncology",
        "Medical Physics (Diagnostic, Nuclear, Therapeutic)",
        "Hospice and Palliative Medicine",
        "Neuroradiology",
        "Nuclear Radiology",
        "Pain Medicine",
        "Pediatric Radiology"],
      Surgery: [
        "General Surgery",
        "Vascular Surgery",
        "Complex General Surgical Oncology",
        "Hospice and Palliative Medicine",
        "Pediatric Surgery",
        "Surgery of the Hand",
        "Surgical Critical Care"
      ],
      Urology: [
        "Female Pelvic Medicine and Reconstructive Surgery",
        "Pediatric Urology",
    ]
};

var CAR_MAKES_AND_MODELS = {
  amc: {
    name: 'AMC',
    models: ['AMX', 'Concord', 'Eagle', 'Gremlin', 'Matador', 'Pacer'],
  },
  alfa: {
    name: 'Alfa-Romeo',
    models: [
      '159',
      '4C',
      'Alfasud',
      'Brera',
      'GTV6',
      'Giulia',
      'MiTo',
      'Spider',
    ],
  },
  aston: {
    name: 'Aston Martin',
    models: ['DB5', 'DB9', 'DBS', 'Rapide', 'Vanquish', 'Vantage'],
  },
};

export default class Picker extends React.Component<{}, $FlowFixMeState> {
  state = {
    specialty: 'Surgery',
    subspecialtyIndex: 3,
  };

  render() {
    var specialty = specialties[this.state.specialty];
    var selectionString = specialty + ' ' + specialty[this.state.modelIndex];
    return (
      <View style={styles.picker}>
        <PickerIOS
          selectedValue={this.state.specialty}
          onValueChange={specialty => this.setState({Specialty, modelIndex: 0})}>
          {Object.keys(specialties).map(specialty => (
            <PickerItemIOS
              key={specialty}
              value={specialty}
              label={specialty}
            />
          ))}
        </PickerIOS>
      </View>
    );
  }

}


// <PickerIOS
//           selectedValue={this.state.subspecialtyIndex}
//           key={this.state.subspecialty}
//           onValueChange={subspecialtyIndex => this.setState({subspecialtyIndex})}>
//           {specialties[this.state.specialty].map(
//             (subspecialty, subspecialtyIndex) => (
//               <PickerItemIOS
//                 key={this.state.specialty + '_' + subspecialtyIndex}
//                 value={subspecialtyIndex}
//                 label={subspecialty}
//               />
//             ),
//           )}
//         </PickerIOS>

const styles = StyleSheet.create({
  picker: {

  },
})

AppRegistry.registerComponent('Picker', () => Picker);
