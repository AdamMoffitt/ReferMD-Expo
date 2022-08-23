import React, { Component } from 'react'
import { Card, Icon, Avatar, Overlay, Button } from 'react-native-elements'
import { HeaderBackButton } from 'react-navigation-stack';
import {
  Image,
  ImageBackground,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  AppRegistry,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Dimensions,
  TextInput
} from 'react-native'
import PropTypes from 'prop-types'
// import ImagePicker from 'react-native-image-picker'
import ImagePicker from 'react-native-image-crop-picker';
import Email from './Email'
import Separator from './Separator'
import Tel from './Tel'
import Website from './Website'
import { getDoctorThenUpdate, claimDoctorProfile, uploadDoctorImage, uploadLogoImage, getDoctorDocuments, getDocument, uploadDocument, saveDoctorDataUpdates, convertToE164 } from '../../Services/ItemService'
import profileStyles from './ProfileStyle'
import firebase from '@react-native-firebase/app'
import {NavigationInjectedProps} from 'react-navigation'
import {COLORS} from '../../Resources/constants.js'
import PDFView from 'react-native-view-pdf'
import DocumentPicker from 'react-native-document-picker'
import SendSMS from 'react-native-sms'
import { AuthContext } from '../../Services/AuthContext.js';

const platinumUpgradeTitle = "Upgrade to Platinum to fully customize your profile!"
const platinumUpgradeMessage = "Platinum doctors appear first and show Practice details and images in search results and can upload documents that are pushed to other doctors.";
const silverUpgradeTitle = "Upgrade to customize and publicize your profile!"
const silverUpgradeMessage = "Upgraded doctors are able to customize and publicize their profile, add images, and appear before Basic doctors in search results.";


export default class ProfilePage extends Component {

  static contextType = AuthContext;
  static navigationOptions = ({navigation}) => ({
      title: navigation.getParam('title', ''),
      headerRight: navigation.getParam('headerRight', null)
  })

  constructor(props) {
    super(props);
    console.log("AUTHENTICATION experiment!!!!!!!");
    const fbAuthUserID = firebase.auth()._user._user.uid;
    const doctor = props.navigation.getParam("doctor", "");
    console.log("fb auth id", fbAuthUserID);
    console.log("doctor id", doctor.id);
    console.log("refer profile page user", doctor);
    const isUser = (fbAuthUserID == doctor.id);
    console.log(isUser);
    const documents = doctor.doctorDocuments ? [...Object.values(doctor.doctorDocuments)] : [];
    const overlayTitle = doctor.type == 2 ? platinumUpgradeTitle : silverUpgradeTitle;
    const overlayMessage = doctor.type == 2 ? platinumUpgradeMessage : silverUpgradeMessage;
    this.state = {
      userId: fbAuthUserID,
      loading: false,
      isLoadingLogo: true,
      isLoadingProfileImage: true,
      doctor: doctor,
      documents: documents,
      isUser: isUser,
      isEditable: isUser,
      isOverlayVisible: false,
      overlayTitle: overlayTitle,
      overlayMessage: overlayMessage,
      name: doctor.name,
      practiceName: doctor.practiceName,
      email: doctor.email,
      website: doctor.website,
      phoneNumber: doctor.phoneNumber,
    }
    console.log("DOCTOR:::", this.state.doctor);

      this.props.navigation.setParams({
          headerRight:
               <Button
                 onPress={() => this.handleLogOut()}
                 title="Log Out"
                 type="clear"
               />
        })

    // if (isUser) {
    //     this.props.navigation.setOptions({
    //       title: '',
    //       headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)} />,
    //       headerRight:
    //            <Button
    //              onPress={this.logOut()}
    //              title="Log Out"
    //              type="clear"
    //            />
    //     });
    // }
  }

  handleLogOut = () => {
    firebase.auth().signOut().then(() => this.props.navigation.navigate('Loading'))
    console.log("logout");
  }

  claimProfile = (doctor) => {
    console.log("Claim Profile");
    doctor.claimed = true;
    claimDoctorProfile(doctor, fbAuthUserID);
  }

  editAvatar = () => {
    console.log("editAvatar");
    this.setState( {isLoadingProfileImage: true });
    if (this.state.doctor.type == 3 && this.state.isEditable) { // only platinum users can edit their Avatar Image
      const options = {
        mediaType: 'photo',
        cropping: true,
        width: 300,
        height: 300,
        compressImageMaxWidth: 300,
        compressImageMaxHeight: 300,
        compressImageQuality: 0.8,
        cropperCircleOverlay: true,
      }
      this.handleChoosePhotoForceSize(options, uploadDoctorImage, (url) => {
        console.log("HERHERHEHREHREHREHREHREHRERHEH ", url);
        this.setState(prevState => ({
          doctor: {                   // object that we want to update
            ...prevState.doctor,    // keep all other key-value pairs
            imageURL: url       // update the value of specific key
          },
          isLoadingProfileImage: false,
        }));
      });
    } else { // prompt upgrade
      this.toggleOverlay();
    }
  }

  editLogoBackground = () => {
    console.log("editLogoBackground");
    if (this.state.doctor.type == 3 && this.state.isEditable) { // only platinum users can edit their Logo Background Image
      const options = {
        mediaType: 'photo',
        cropping: true,
        width: 415,
        height: 250,
        compressImageMaxWidth: 415,
        compressImageMaxHeight: 250,
        compressImageQuality: 0.8,
      }
      this.setState( {isLoadingLogo: true });
      this.handleChoosePhotoForceSize(options, uploadLogoImage, (url) => {
        console.log("INCEPTIONASDFASDFASDFASDF ", url);
        this.setState(prevState => ({
          doctor: {                   // object that we want to update
            ...prevState.doctor,    // keep all other key-value pairs
            logoURL: url       // update the value of specific key
          },
          isLoadingLogo: false,
        }));
      });
    } else { // prompt upgrade
      this.toggleOverlay();
    }
  }

  handleChoosePhotoForceSize = (options, uploadFunction, updateImageFunction) => {

    Alert.alert(
      'Choose Photo',
      '',
      [
        { text: 'Chose from Photos',
          onPress: () => ImagePicker.openPicker(options).then(image => {
            console.log(image);
            if (image.path) {
              uploadFunction(this.state.doctor, image.path, updateImageFunction);
            }
          })
        },
        {
          text: 'Take Photo',
          onPress: () => ImagePicker.openCamera(options).then(image => {
            console.log(image);
            if (image.path) {
              uploadFunction(this.state.doctor, image.path, updateImageFunction);
            }
          })
        },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
    );
  }

  pickDocument =  async () => {
    // Pick multiple files
    this.showPlatinumUpgradeMessage()
    try {
      const results = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.pdf],
      });
        console.log(
          res.uri,
          res.type, // mime type
          res.name,
          res.size
        );
      uploadDocument = (this.state.doctor, res.name, res.uri)
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
        DocumentPicker.
        console.log("canceled RIP");
      } else {
        throw err;
      }
    }
  }

  saveUpdates = (doctor) => {
    const updateData = {
      ...(this.state.doctorName != doctor.name) && { name: this.state.doctorName },
      ...(this.state.practiceName != doctor.practiceName) && { practiceName: this.state.practiceName },
      ...(this.state.email != doctor.email ) && { email: this.state.email },
      ...(this.state.phoneNumber != doctor.phoneNumber ) && { phoneNumber: this.state.phoneNumber },
      ...(this.state.website != doctor.website ) && { name: this.state.website },
    }
    console.log("updateDate:", updateData);
    saveDoctorDataUpdates(doctor.id, updateData, getDoctorThenUpdate(this.state.doctor.id, (doctor) =>
        {
          this.context.updateUserDoctor(doctor);
          console.log(" this.setstate: ", doctor);
          this.setState({
            doctor: doctor,
            name: doctor.name,
            practiceName: doctor.practiceName,
            email: doctor.email,
            website: doctor.website,
            phoneNumber: doctor.phoneNumber})
        }
      ));

  }

  renderSaveButton = (doctor) => {
    if (this.state.doctorName != doctor.name
      || this.state.practiceName != doctor.practiceName
      || this.state.email != doctor.email
      || this.state.phoneNumber != doctor.phoneNumber
      || this.state.website != doctor.website ) {
        console.log(" true save button");
      return (
        <Button title="Save Changes" onPress={() => this.saveUpdates(doctor)}/>
      )
    }
    console.log(" false save button");
  }

  renderContactHeader = (doctor) => {
    const avatar = doctor.imageURL;
    const avatarBackground = doctor.logoURL;
    const message = "Claim This Profile";
    console.log("avatar: " , avatar, avatar === undefined);
    return (
      <View style={styles.headerContainer1}>
        {(this.state.doctor.type == 1 && this.state.doctor.claimed == false) && //If the profile is basic, show "Claim Profile" Button
          <TouchableOpacity style={styles.claimProfileButton} onPress={this.claimProfile}>
            <Text> {message} </Text>
          </TouchableOpacity>
        }
        <View style={styles.coverContainer}>
          {this.state.isLoadingLogo ? <ActivityIndicator style={styles.activityIndicator} size="large" /> : null}
          <ImageBackground
            source={
              avatarBackground ? {uri: avatarBackground} : require('../../Resources/referMD_logo_your_logo_here.png')
            }
            style={styles.coverImage}
            resizeMode= 'contain'
            onLoadStart={() => this.setState({isLoadingLogo: true})}
            onLoadEnd={() => this.setState({isLoadingLogo: false})}
            >
            { this.state.isEditable ?
              <Icon
                raised
                reverse
                name='edit'
                type='font-awesome'
                color='#aaaaaa'
                onPress={() => this.editLogoBackground()}/> : null}
          </ImageBackground>
        </View>
        <View style={styles.profileImageContainer}>
          <Avatar
            source={!(avatar === undefined) ? {uri: avatar} : null}
            icon={{name: 'user', type: 'font-awesome'}}
            showEditButton={this.state.isEditable}
            rounded
            size="large"
            onPress={() => this.editAvatar()}
            disabled={!this.state.isEditable}
            activeOpacity={this.state.isEditable ? 0.2 : 1}
            onLoadStart={() => this.setState({isLoadingProfileImage: true})}
            onLoadEnd={() => this.setState({isLoadingProfileImage: false})}
            >
          </Avatar>
          <View style={styles.coverTitleContainer}>
            <TextInput onChangeText={(value) => this.setState({doctorName: value})} editable={this.state.isEditable} style={doctor.doctorName ? styles.coverDoctorName : styles.doctorNamePlaceholder}>{doctor.doctorName ? doctor.doctorName : "Enter Doctor Name"}</TextInput>
            {this.state.isEditable && this.state.doctor.type != 1
              ? <TextInput onChangeText={(value) => this.setState({practiceName: value})} style={doctor.practiceName ? styles.coverPracticeName : styles.practiceNamePlaceholder}>{doctor.practiceName ? doctor.practiceName : "Enter Practice Name"}</TextInput>
              : <Text style={doctor.practiceName ? styles.coverPracticeName : styles.practiceNamePlaceholder} onPress={() => this.showSilverUpgradeMessage()}>{doctor.practiceName ? doctor.practiceName : "Enter Practice Name"}</Text>}
            </View>
          </View>
        </View>
        )
      }

  showSilverUpgradeMessage = () => {
    if (this.state.doctor.type < 2) { // can only edit website if silver or platinum doctor
      this.state.overlayTitle = silverUpgradeTitle;
      this.state.overlayMessage = silverUpgradeMessage;
      this.toggleOverlay();
    }
  }

  showPlatinumUpgradeMessage = () => {
    if (this.state.doctor.type < 3) { // can only edit website if silver or platinum doctor
      console.log("plebian alert");
      this.state.overlayTitle = platinumUpgradeTitle;
      this.state.overlayMessage = platinumUpgradeMessage;
      this.toggleOverlay();
    }
  }

  renderTel = (doctor) => (
    <Tel
      name={doctor.doctorName}
      number={doctor.doctorPhoneNumber}
      onPressSms={this.onPressSms}
      onPressTel={this.onPressTel}
      isEditable={this.state.isEditable}
      onChangePhoneNumber={(phoneNumber) => this.setState({phoneNumber: phoneNumber})}
      />
  )


  onPressTel = number => {
    if (this.state.isEditable) {
      // showSilverUpgradeMessage();
    } else {
      Linking.openURL(`tel://${number}`).catch(err => console.log('Error:', err))
    }
  }

  onPressSms = () => {
    if (this.state.isEditable) {
      // showSilverUpgradeMessage();
    } else {
      SendSMS.send({
        recipients: [doctor.doctorPhoneNumber],
        successTypes: ['sent', 'queued'],
        allowAndroidSendWithoutReadPermission: true
      }, (completed, cancelled, error) => {
        console.log('SMS Callback: completed: ' + completed + ' cancelled: ' + cancelled + 'error: ' + error);
      });
    }
  }

  renderEmail = (doctor) => (
    <Email
      email={doctor.doctorEmail}
      onPressEmail={this.onPressEmail}
      isEditable={this.state.isEditable}
      onChangeText={(email) => this.setState({email: email})}
      />
  )

  onPressEmail = email => {
    if (this.state.isEditable) {
      // showSilverUpgradeMessage();
    } else {
      Linking.openURL(`mailto:${email}?subject=ReferMD&body=body`).catch(err =>
        console.log('Error:', err)
      )
    }
  }

  renderWebsite = (doctor) => (
    <Website
      website={doctor.doctorWebsite}
      onPressWebsite={this.onPressWebsite}
      isEditable={this.state.isEditable}
      type={doctor.type}
      onChangeText={(website) => this.setState({website: website})}
      />
  )

  onPressWebsite = websiteURL => {
    if (this.state.isEditable) {
      this.showSilverUpgradeMessage();
    } else {
      Linking.openURL(websiteURL).catch(err =>
        console.log('Error:', err)
      )
    }
  }

  renderDocuments = () => (
    <View style={{marginTop: 10}}>
      <View style={styles.flexCenter}>
        <Text style={styles.coverBio}>Doctor Uploads</Text>
        {this.state.isEditable ? <Button type="clear" title="Upload" onPress={() => this.pickDocument()}/> : null}
      </View>
      <FlatList
        style={{flex: 11}}
        data={this.state.documents}
        renderItem={({ item }) => (
          <View style={{ height: 100, flex: 1, alignItems: 'center', justifyContent: 'center', margin: 1 }}>
            <Icon
              style={styles.pdfIcon}
              size={50}
              name='insert-drive-file'
              color='#afafaf'
              onPress={() => this.props.navigation.navigate('PDFViewPage', {document: item})}/>
            <Text>{item.title}</Text>
          </View>
        )}
        numColumns={2}
        keyExtractor={(item, index) => index.toString()}
        />
    </View>
  )

  renderOverlay = (doctor) => (
    <Overlay
      isVisible={this.state.isOverlayVisible}
      onBackdropPress={() => this.setState({ isOverlayVisible: false })}
      style={styles.upgradeOverlay}
      windowBackgroundColor={COLORS.greyBackground}
      overlayBackgroundColor={COLORS.mainColor}
      height={Dimensions.get('window').height * (3 / 5)}
      width={Dimensions.get('window').width * (4 / 5)}
      animationType={'slide'}
      >
      <Text style={styles.overlayTitle} adjustsFontSizeToFit={true}>{this.state.overlayTitle}</Text>
      <Image
        source={require('../../Resources/doctorIcons/doctorWClipboard.png')}
        style={styles.overlayImage}
        />
      <Text style={styles.overlayMessage} adjustsFontSizeToFit={true}>{this.state.overlayMessage}</Text>
      <Button title="Upgrade Now" onPress={() => {
          this.setState({ isOverlayVisible: false });
          this.props.navigation.navigate('Upgrade', {user: doctor})}}
          />
      </Overlay>
    )

  toggleOverlay = () => {
    this.setState({ isOverlayVisible: !this.state.isOverlayVisible });
  };


  render() {
    const { navigation } = this.props;
    console.log("render profile page state");
    console.log(this.state);
    const doctor = this.state.doctor;
    return (
      <ScrollView style={styles.scroll}>
        <View style={styles.container}>
          <Card containerStyle={styles.cardContainer}>
            {this.renderContactHeader(doctor)}
            {this.renderTel(doctor)}
            {this.renderEmail(doctor)}
            {this.renderWebsite(doctor)}
            {this.renderSaveButton(doctor)}
            {this.state.documents.length || this.state.isEditable ? this.renderDocuments() : null}
            {this.state.isEditable ? this.renderOverlay(doctor) : null }
            {Separator()}
          </Card>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  claimProfileButton: {
    backgroundColor: COLORS.mainColor,
    height: Dimensions.get('window').width * (1 / 10),
    width: Dimensions.get('window').width,
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  cardContainer: {
    borderWidth: 0,
    flex: 1,
    margin: 0,
    padding: 0,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.mainColor,
  },
  activityIndicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  scroll: {
    backgroundColor: COLORS.lightBackgroundColor,
  },
  userImage: {
    borderColor: COLORS.mainColor,
    borderRadius: 85,
    borderWidth: 3,
    height: 170,
    marginBottom: 15,
    width: 170,
  },

  coverContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 55,
    position: 'relative',
  },
  flexEnd: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  flexCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverImage: {
    height: Dimensions.get('window').width * (3 / 5),
    width: Dimensions.get('window').width,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  coverDoctorName: {
    color: '#000000',
    fontSize: 28,
    fontWeight: 'bold',
    paddingBottom: 2,
  },
  doctorNamePlaceholder: {
    color: 'grey',
    fontSize: 28,
    fontWeight: 'bold',
    fontStyle: 'italic',
    paddingBottom: 2,
  },
  practiceNamePlaceholder: {
    color: 'grey',
    fontSize: 18,
    fontStyle: 'italic',
    fontWeight: '600',
  },
  coverTitleContainer: {
    backgroundColor: 'transparent',
    flex: 1,
    paddingTop: 20,
    paddingLeft: 20,
  },
  headerContainer1: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginBottom: 40,
  },
  profileImageContainer: {
    flexDirection: 'row',
    bottom: 0,
    left: 10,
    position: 'absolute',
  },
  coverBio: {
    fontSize: 18,
    textAlign: 'center',
  },
  imageThumbnail: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
  },
  pdfIcon: {
  },
  upgradeOverlay: {
    margin: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('window').height * (4 / 5),
    width: Dimensions.get('window').width* (4 / 5),
  },
  overlayImage: {
    flex: 5,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  overlayTitle: {
    flex: 2,
    marginTop: 20,
    fontSize: 20,
    textAlign: 'center',
  },
  overlayMessage: {
    flex: 2,
    fontSize: 15,
    marginBottom: 20,
    textAlign: 'center',
  },
})

AppRegistry.registerComponent('ProfilePage', () => ProfilePage);
