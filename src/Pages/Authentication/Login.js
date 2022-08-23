// Login.js
import React from 'react'
import { StyleSheet, Text, TextInput, View, Dimensions, AppRegistry, Image } from 'react-native'
import firebase from '@react-native-firebase/app';
import {Icon, Button, Overlay} from 'react-native-elements'
import {COLORS} from '../../Resources/constants.js';
import {getDoctorThenUpdate, updateTokens} from '../../Services/ItemService';
export default class Login extends React.Component {

static navigationOptions = {
      header: null,
       // headerLeft: ()=>(<Icon
       //   style={{ backgroundColor: 'transparent' }}
       //   size={24}
       //   name='keyboard-arrow-left'
       //   color='#000000'/>)
  }

  constructor(props) {
    super(props);
    this.state = {
        email: '',
        password: '',
        errorMessage: null,
        showOverlay: false,
        validEmail: true,
    }
  }

  handleLogin = () => {
    const { email, password } = this.state
    console.log(email + " " + password);
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        console.log("firebase completion handler");
        this.checkFirebaseLogin();
      })
      .catch(error => {
        console.log("error code: ", error.code);
        console.log("error message: ", error.message);
        this.setState({ errorMessage: error.message.split('] ').pop() })
      })
  }

  checkFirebaseLogin = () => {
    console.log("check firebase auth");
    firebase.auth().onAuthStateChanged(async user => {
      console.log("!!!!!!!!!!!!!!!!!USER!!!!!!!!!!!!!!!!!!!!");
      console.log(user);
      if (user == null || user === undefined) {
        console.log("user is null");
        this.props.navigation.replace('SignUp');
        return;
      } else {
          await getDoctorThenUpdate(user.uid, (doctor) => {
              console.log("CALLBACK", doctor);
              updateTokens(doctor);
              if (typeof this.context.updateUserDoctor === 'function') {
                  this.context.updateUserDoctor(doctor);
              }
              console.log("context 3 ",this.context);
              this.props.navigation.replace(doctor ? 'ReferStartPage' : 'SignUp', {user: doctor})
          }).catch(err => console.log("error: ", error))
      }})
  }

  validate = (text) => {
    console.log(text);
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
    if(reg.test(text) === false)
    {
    console.log("Email is Not Correct");
    this.setState({email:text, validEmail: false})
    return false;
      }
    else {
      this.setState({email:text, validEmail: true})
      console.log("Email is Correct");
    }
  }

  renderOverlay = () => (
    <Overlay
      isVisible={this.state.showOverlay}
      onBackdropPress={() => this.setState({ showOverlay: false })}
      style={styles.overlay}
      windowBackgroundColor={COLORS.greyBackground}
      overlayBackgroundColor={COLORS.mainColor}
      height={Dimensions.get('window').height * (3 / 5)}
      width={Dimensions.get('window').width * (4 / 5)}
      animationType={'slide'}
      >
      <Text style={styles.overlayTitle}>{"Reset Password"}</Text>
      <Image
        source={require('../../Resources/doctorIcons/doctorWClipboard.png')}
        style={styles.overlayImage}
        />
      <Text style={styles.overlayMessage}>{"Enter your email and you will receive an email to reset your password."}</Text>
      <TextInput
        style={styles.textInput}
        autoCapitalize="none"
        placeholder="Email"
        onChangeText={email => this.setState({validEmail: this.validate(email)})}
        value={this.state.email}
      />
      <Text style={styles.validEmailMessage}>{!this.state.validEmail ? "Invalid Email" : ""}</Text>
      <Button style={{marginTop: 15}} title="Send Email" onPress={() => {
            this.setState({ showOverlay: false });
            firebase.auth().sendPasswordResetEmail(this.state.email)}}
        />
    </Overlay>
  )

  render() {
    return (
      <View style={styles.container}>
        <Image
          // source={require('../../Resources/referMD_logo.png')}
          style={styles.image}
          />
        <TextInput
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Email"
          onChangeText={email => this.validate(email)}
          value={this.state.email}
        />
        <TextInput
          secureTextEntry
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Password"
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
        <Text style={styles.errorText}>
          {this.state.errorMessage}
        </Text>
        <Button
          style={styles.buttons}
          title="Login" onPress={this.handleLogin} />
        <Button
          style={styles.buttons}
          type="clear"
          title="Don't have an account? Sign Up"
          onPress={() => this.props.navigation.replace('SignUp')}
        />
        <Button
          style={styles.buttons}
          type="clear"
          title="Forgot Password"
          onPress={() => this.setState({showOverlay: true})}
        />
        {this.state.showOverlay ? this.renderOverlay() : null }
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightBackgroundColor,
  },
  image: {
    height: Dimensions.get('window').width * (2 / 5),
    width: Dimensions.get('window').width * (4 / 5),
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  errorText: { color: 'red', margin: 10, textAlign: 'center' },
  textInput: {
    height: 40,
    width: '90%',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 8,
    backgroundColor: 'white',
  },
  buttons: {
    width: 300,
    margin: 20,
  },
  overlay: {
    margin: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayImage: {
    flex: 2,
    resizeMode: 'contain',
    justifyContent: 'center',
    alignSelf: 'center',
    height: Dimensions.get('window').height * (4 / 5),
    width: Dimensions.get('window').width * (3 / 5),
  },
  overlayTitle: {
    flex: 1,
    marginTop: 20,
    fontSize: 28,
    textAlign: 'center',
  },
  overlayMessage: {
    flex: 1,
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  validEmailMessage: {
    color: 'red',
  }
})

AppRegistry.registerComponent('Login', () => Login);
