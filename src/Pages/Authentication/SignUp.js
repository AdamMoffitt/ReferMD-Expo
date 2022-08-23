// SignUp.js
import React from 'react'
import { StyleSheet, Text, TextInput, View, AppRegistry, Image, Dimensions } from 'react-native'
import {Icon,Button} from 'react-native-elements'
import firebase from '@react-native-firebase/app';
import { addDoctor, addSimpleUserDoctor, getDoctorThenUpdate, updateTokens } from '../../Services/ItemService';
import {COLORS} from '../../Resources/constants.js';

export default class SignUp extends React.Component {

  static navigationOptions = {
      header: null,
      // cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
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
        errorMessage: null
    }
  }

  handleSignUp = () => {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then((result) => {
            console.log("handle sign up result");
            console.log("result-auth-user-user-uid", result.user._user.uid);

            console.log("user id");
            addSimpleUserDoctor({
              email: this.state.email,
              id: result.user._user.uid,
            });
            this.checkFirebaseLogin()
            this.props.navigation.navigate('ReferStartPage')
        })
        .catch(error => {
          console.log("error: ", error);
          console.log("error code: ", error.code);
          console.log("error message: ", error.description);
          if (error.code == 'auth/weak-password') {
            this.setState({ errorMessage:"The password is too weak. Use at least 6 characters." })
          } else {
            this.setState({ errorMessage:error.message.replace('['+error.code+']', '') })
          }
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

render() {
    return (
      <View style={styles.container}>
        <Image
          // source={require('../../Resources/referMD_logo.png')}
          style={styles.image}
          />
        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <TextInput
          secureTextEntry
          placeholder="Password"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
          <Text style={styles.errorText}>
            {this.state.errorMessage}
          </Text>
        <Button
          style={styles.buttons}
          title="Sign Up"
          onPress={this.handleSignUp} />
        <Button
          style={styles.buttons}
          type="clear"
          title="Already have an account? Login"
          onPress={() => this.props.navigation.replace('Login')}
        />
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
    marginTop: 8
  },
  buttons: {
    width: 300,
    margin: 20,
  }
})

AppRegistry.registerComponent('SignUp', () => SignUp);
