import React, {Component} from 'react';
import {
  ActivityIndicator,
  Text,
  StyleSheet,
  View,
  AppRegistry,
  Dimensions,
  Image, FlatList
} from 'react-native';
import DoctorTableViewCell from './DoctorTableViewCell';
import { getAllDoctors, getDoctorsBySpecialty } from '../../Services/ItemService'
import {COLORS} from '../../Resources/constants.js';
import { Overlay, Button } from 'react-native-elements'

export default class DoctorsTableViewPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      doctors: [],
      showMessage: false,
      specialty: specialty,
      isOverlayVisible: false
    }
    const specialty = this.props.navigation.getParam('specialty');
    console.log("specialty table view");
    console.log(specialty);
    if (specialty == "All") {
      this.getAllDoctors();
    } else {
      this.getDoctorsBySpecialty(specialty);
    }
  }

  static navigationOptions = ({ navigation }) => {
    console.log("navigation options");
    console.log(navigation.getParam('specialty'));
    return {
      title: `${navigation.getParam('specialty')}`,
      headerBackTitle: 'Home'
    };
  };

  getDoctorsForTableView = async () => {
    const doctors = await getDoctors();
    console.log("!@#$!@#$!@#$!@#$!@#$!@#$!@#$!@#$!@#$!@#$!@#$!@#$!#$!@#");
    console.log(doctors);
    console.log("!@#$!@#$!@#$!@#$!@#$!@#$!@#$!@#$!@#$!@#$!@#$!@#$!#$!@#");
    this.setState({ isLoading: false, doctors: doctors });
  }

  getAllDoctors = async () => {
    const doctors = await getAllDoctors();
    console.log("!@#$!@#$!@#$!@#$!@#$!@#$!@#$!@#$!@#$!@#$!@#$!@#$!#$!@#");
    console.log(doctors);
    console.log("!@#$!@#$!@#$!@#$!@#$!@#$!@#$!@#$!@#$!@#$!@#$!@#$!#$!@#");
    const showMessage = false;
    if (doctors.length <= 0) {
      // showMessage = true;
      console.log("toggle overlay");
      this.toggleOverlay();
    }
    this.setState({ isLoading: false, doctors: doctors, showMessage: showMessage});
  }

  getDoctorsBySpecialty = async (specialty) => {
    const doctors = await getDoctorsBySpecialty(specialty);
    console.log("!@#$!@#$!@#$!@#$!@#$!@#$!@#$!@#$!@#$!@#$!@#$!@#$!#$!@#");
    console.log(doctors);
    console.log("!@#$!@#$!@#$!@#$!@#$!@#$!@#$!@#$!@#$!@#$!@#$!@#$!#$!@#");
    const showMessage = false;
    if (doctors.length <= 0) {
      // showMessage = true;
      console.log("toggle overlay");
      this.toggleOverlay();
    }
    this.setState({ isLoading: false, doctors: doctors, showMessage: showMessage});
  }

  addDoctor = () => {
    console.log("add doctor to Table View");
  }

  toggleOverlay = () => {
    this.setState({ isOverlayVisible: !this.state.isOverlayVisible });
  };

  render() {
    const { navigation } = this.props;
    // const doctors = navigation.getParam('doctors');
    // console.log(doctors);

    console.log("Doctor Table View", this.state.doctors);
    const isLoading = this.state.isLoading;
    const doctors = this.state.doctors;
    const showMessage = this.state.showMessage;

    if (isLoading == true) {
      return (
        <ActivityIndicator
          style={{marginTop: 200}}
          size="large"
          />
      );
    }

    return (
      <View style={styles.viewContainer} >
        {this.state.isLoading ? <ActivityIndicator style={styles.activityIndicator} size="large" /> : null}
        <FlatList
               data={doctors}
               keyExtractor={doctor => doctor.id}
               backgroundColor={COLORS.mainColor}
               renderItem={({ item: doctor }) => {
                  console.log("flatlist doctor: ", doctor);
                   if (doctor && !(doctor === undefined)) {
                       var cellHeight = 50;
                       if (doctor.type == 3) {
                         console.log('platinum');
                         cellHeight = 200;
                       } else if (doctor.type == 2) {
                         console.log('silver');
                         cellHeight = 120;
                       } else {
                         console.log('basic');
                         cellHeight = 50;
                       }
                  }
                  return (<DoctorTableViewCell
                   label={doctor.name}
                   type={doctor.type}
                   id={doctor.id}
                   imageURL={doctor.imageURL}
                   logoURL={doctor.logoURL}
                   practiceName={doctor.practiceName}
                   doctorName={doctor.name}
                   doctorEmail={doctor.email}
                   doctorPhoneNumber={doctor.phoneNumber}
                   doctorWebsite={doctor.website}
                   doctorDocuments={doctor.documents}
                   doctorNotificationTokens={doctor.notificationTokens}
                   height={cellHeight}
                   navigation={navigation}
                   backgroundColor={COLORS.mainColor}
 /> )}}
              />
        <Overlay
          isVisible={this.state.isOverlayVisible}
          onBackdropPress={() => this.setState({ isOverlayVisible: false })}
          style={styles.upgradeOverlay}
          windowBackgroundColor={COLORS.greyBackground}
          overlayBackgroundColor={COLORS.secondaryColor}
          height={Dimensions.get('window').height * (3 / 5)}
          width={Dimensions.get('window').width * (4 / 5)}
          animationType={'slide'}
          >
          <Text style={styles.overlayTitle}> No {this.state.specialty} Doctors Found </Text>
          <Image
            source={require('../../Resources/doctorIcons/nurse.png')}
            style={styles.overlayImage}
            />
          <Text style={styles.overlayMessage}> Click below to Add a Doctor </Text>
          <Button style={styles.overlayButton} title="Add Doctor" onPress={() => {
              this.setState({ isOverlayVisible: false });
              this.props.navigation.navigate('NewDoctorPage')}}
              />
            <Button style={styles.overlayButton} title="Cancel" onPress={() => {
                this.setState({ isOverlayVisible: false });
                this.props.navigation.goBack()}}
                />
            </Overlay>
          </View>
        )
      }

      // <View>
      // <Text>
      //   {isLoading ? 'isLoading doctors' : 'Loaded doctors'}
      // </Text>
      // {isLoading && <ActivityIndicator />}

    }

    const styles = StyleSheet.create({
      viewContainer: {
        flex: 1,
        backgroundColor: COLORS.lightBackgroundColor,
      },
      upgradeOverlay: {
        margin: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      },
      overlayImage: {
        flex: 4,
        resizeMode: 'contain',
        alignSelf: 'center',
      },
      overlayTitle: {
        flex: 1,
        marginTop: 20,
        fontSize: 24,
        textAlign: 'center',
        flexWrap: 'wrap'
      },
      overlayMessage: {
        flex: 0.5,
        fontSize: 22,
        marginTop: 20,
        marginBottom: 20,
        textAlign: 'center',
      },
      overlayButton: {
        margin: 10,
      }
    })

    AppRegistry.registerComponent('DoctorsTableViewPage', () => DoctorsTableViewPage);




    // {doctors.map(function(doctor) {
    //   console.log("doctor for tableview:", doctor);
    //   if (doctor && !(doctor === undefined)) {
    //     var cellHeight = 50;
    //     if (doctor.type == 3) {
    //       console.log('platinum');
    //       cellHeight = 200;
    //     } else if (doctor.type == 2) {
    //       console.log('silver');
    //       cellHeight = 120;
    //     } else {
    //       console.log('basic');
    //       cellHeight = 50;
    //     }
    //     return (
    //       <DoctorTableViewCell
    //      label={doctor.name}
    //      type={doctor.type}
    //      id={doctor.id}
    //      imageURL={doctor.imageURL}
    //      logoURL={doctor.logoURL}
    //      practiceName={doctor.practiceName}
    //      doctorName={doctor.name}
    //      doctorEmail={doctor.email}
    //      doctorPhoneNumber={doctor.phoneNumber}
    //      doctorWebsite={doctor.website}
    //      height={cellHeight}
    //      navigation={navigation}
    //      backgroundColor={COLORS.mainColor}
    //    >
    //    </DoctorTableViewCell>
    //     );
    // }})}
