// With Flow type annotations (https://flow.org/)
import PDFView from 'react-native-view-pdf';
import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet, AppRegistry, Alert } from 'react-native'
// Without Flow type annotations
// import PDFView from 'react-native-view-pdf/lib/index';

const resources = {
  file: Platform.OS === 'ios' ? 'downloadedDocument.pdf' : '/sdcard/Download/downloadedDocument.pdf',
  url: 'https://www.ets.org/Media/Tests/TOEFL/pdf/SampleQuestions.pdf',
  base64: 'JVBERi0xLjMKJcfs...',
};

export default class PDFViewPage extends React.Component {

  static navigationOptions = ({navigation}) => ({
      title: navigation.getParam('title', ''),
      headerRight: navigation.getParam('headerRight', null)
  })

  constructor(props) {
      super(props);
      const document = props.navigation.getParam("document");
      this.state = {
        document: document,
        isLoading: true
      }
  }

  render() {

    return (
      <View style={{ flex: 1 }}>
      {this.state.isLoading ? <ActivityIndicator style={styles.activityIndicator} size="large" /> : null}
        <PDFView
          fadeInDuration={250.0}
          style={{ flex: 1 }}
          resource={this.state.document.url}
          resourceType={'url'}
          onLoad={() => {console.log(`PDF rendered from url`); this.setState({isLoading: false})}}
          onError={(error) => {
            console.log('Cannot render PDF', error);
            this.setState({isLoading: false})
            Alert.alert(
              'PDF cannot be loaded', '',
              [
                {text: 'OK', onPress: () => this.props.navigation.goBack()},
              ],
              {cancelable: false},
            );
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  activityIndicator: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
  })

AppRegistry.registerComponent('PDFViewPage', () => PDFViewPage);
