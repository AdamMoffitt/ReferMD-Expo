import React from 'react';
import {
  StyleSheet,
  TextInput,
  Dimensions
} from 'react-native';
import {COLORS} from './constants.js';

export default class AutoExpandingTextInput extends React.Component {

  constructor(props) {
    super(props);
    this.state = {text: '', height: 0};
  }
  render() {
    return (
      <TextInput
        {...this.props}
        multiline={true}
        onChangeText={(text) => {
            this.setState({ text })
        }}
        onContentSizeChange={(event) => {
            this.setState({ height: event.nativeEvent.contentSize.height })
        }}
        style={[styles.default, {height: Math.max(35, this.state.height)}]}
        value={this.state.text}
      />
    );
  }
}

const styles = StyleSheet.create({
  default: {
    width: Dimensions.get('window').width * (4 / 5),
    height: 40,
    margin: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.mainColor,
}
})
