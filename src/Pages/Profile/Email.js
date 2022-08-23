import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View, TextInput } from 'react-native'
import { Icon } from 'react-native-elements'
import PropTypes from 'prop-types'

import {COLORS} from '../../Resources/constants.js';

class Email extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }

  render() {
    const { containerStyle, onPressEmail, onChangeText, email, isEditable } = this.props;
    return (
  <TouchableOpacity onPress={() => {
      this.textInput.current.focus();
      onPressEmail(email)
    }}>
    <View style={[styles.container, containerStyle]}>
      <View style={styles.iconRow}>
          <Icon
            name="email"
            underlayColor="transparent"
            iconStyle={styles.emailIcon}
            onPress={() => onPressEmail()}
          />
      </View>
      <View style={styles.emailRow, isEditable ? {flex: 4} : {flex:7}}>
        <View style={styles.emailColumn}>
          <TextInput onChangeText={onChangeText} editable={isEditable} keyboardType={'email-address'} style={styles.emailText} ref={this.textInput}>{email}</TextInput>
        </View>
      </View>
      { isEditable ?
        <View style={styles.editTextView}>
          <Text style={styles.editText}> Click to Edit </Text>
        </View> : null }
    </View>
  </TouchableOpacity>
)}
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 25,
  },
  emailColumn: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 5,
  },
  emailIcon: {
    color: COLORS.mainColor,
    fontSize: 30,
  },
  emailNameColumn: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  emailNameText: {
    color: 'gray',
    fontSize: 14,
    fontWeight: '200',
  },
  emailRow: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  emailText: {
    fontSize: 16,
  },
  iconRow: {
    flex: 2,
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
  }
})

export default Email
