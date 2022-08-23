import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Icon } from 'react-native-elements'
import PropTypes from 'prop-types'
import { TextInputMask } from 'react-native-masked-text'

import {COLORS} from '../../Resources/constants.js';

class Tel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: '',
      phoneNumberFormat: ''
    };
  }

  render() {
    const {
      containerStyle,
      index,
      number,
      onPressSms,
      onPressTel,
      isEditable,
      onChangePhoneNumber
    } = this.props;
    return (
      <TouchableOpacity onPress={() => {
          onPressTel(number)
        }}>
        <View style={[styles.container, containerStyle]}>
          <View style={styles.iconRow}>
            <Icon
              name="call"
              underlayColor="transparent"
              iconStyle={styles.telIcon}
              onPress={() => onPressTel(number)}
            />
          </View>
          <View style={styles.telRow, isEditable ? {flex: 4} : {flex:7}}>
            <View style={styles.telNumberColumn}>
              <TextInputMask
                editable={isEditable}
                placeholder={number ? number : "Enter Phone Number"}
                placeholderTextColor={'grey'}
                placeholderStyle={{fontStyle: 'italic'}}
                textColor={'black'}
                style={styles.telNumberText}
                value={this.state.phoneNumberFormat}
                onChangeText={(phoneNumberFormat) => {
                  let phoneNumber = phoneNumberFormat.toString().replace(/\D+/g, '');
                  this.setState({phoneNumberFormat: phoneNumberFormat, phoneNumber: phoneNumber})
                  onChangePhoneNumber(phoneNumberFormat);
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
            </View>
          </View>
          { isEditable ?
            <View style={styles.editTextView}>
              <Text style={styles.editText}> Click to Edit </Text>
            </View> : null }
            {/*}<View style={styles.smsRow, isEditable ? {flex: 2} : {flex:4}}>
              <Icon
                name="textsms"
                underlayColor="transparent"
                iconStyle={styles.smsIcon}
                onPress={() => onPressSms()}
              />
            </View> */}
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 25,
  },
  iconRow: {
    flex: 2,
    justifyContent: 'center',
  },
  telIcon: {
    color: COLORS.mainColor,
    fontSize: 30,
  },
  telNameColumn: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  telNameText: {
    color: 'gray',
    fontSize: 14,
    fontWeight: '200',
  },
  telNumberColumn: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 5,
  },
  telNumberText: {
    color: 'black',
    fontSize: 16,
  },
  telRow: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  editTextView: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  editText: {
    fontSize: 10,
    fontStyle: 'italic',
    color: '#aaaaaa',
  },
  smsIcon: {
    color: 'gray',
    fontSize: 30,
  },
  smsRow: {
    justifyContent: 'flex-start',
  },
})


export default Tel
