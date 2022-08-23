// ItemService.js

/*********************************************************************************/
/*** Contains all API / REST methods for communicating with Firebase Storage, ****/
/******* Firestore Database, Firebase Functions, and all external APIs ***********/
/*********************************************************************************/

import firestore from '@react-native-firebase/firestore';
import messaging, { AuthorizationStatus } from '@react-native-firebase/messaging';
import storage from '@react-native-firebase/storage';
// import RNFetchBlob from 'react-native-fetch-blob'
import firebase from '@react-native-firebase/app';

const doctorsRef = firestore().collection('doctors');


/*********************************************************************************/
export const getAllDoctors = async () => {
  console.log('Get Doctors data');
  const doctorSnapshot = await doctorsRef.orderBy('type', "desc").get();
  console.log('User data', doctorSnapshot.docs);
  return doctorSnapshot.docs.map((doctor) => {
    if (doctor.data().name) {
        const name = doctor.data().name;
        console.log(name);
        return doctor.data();
    }
  })
}
/*********************************************************************************/

/*********************************************************************************/
export const getDoctorsBySpecialty = async (specialty) => {
  console.log('Get Doctors data by specialty');
  console.log(specialty);
  const doctorSnapshot = await doctorsRef.where("specialty", "==", specialty).orderBy('type', "desc").get();
  console.log('User data', doctorSnapshot.docs);
  return doctorSnapshot.docs.map((doctor) => {
    const name = doctor.data().name;
    console.log(name);
    return doctor.data();
  })
}
/*********************************************************************************/

/*********************************************************************************/
export const getDoctorsBySpecialtyAndSubSpecialty = async (specialty, subSpecialty) => {
  console.log('Get Doctors data by specialty');
  const doctorSnapshot = await doctorsRef.where("specialty", "==", specialty).where("subSpecialty", "==", subSpecialty).orderBy('type', "desc").get();
  // console.log('User data', doctorSnapshot.docs);
  return doctorSnapshot.docs.map((doctor) => {
    const name = doctor.data().name;
    console.log(name);
    return doctor.data();
  })
}
/*********************************************************************************/

/*********************************************************************************/
export const updateTokens = async (doctor) => {
  console.log("update tokens");
  await requestUserPermission();
  updateAPNSTokenIfChanged(doctor);
  updateFCMTokenIfChanged(doctor);
}
/*********************************************************************************/

/*********************************************************************************/
requestUserPermission = async () => {
  try {
    const authStatus = await messaging().requestPermission();
    console.log("auth status: " + authStatus);

    if (authStatus) {
      console.log('Authorization status:', authStatus);
    }
  } catch (err) {
      console.log(err);
  }
}
/*********************************************************************************/

/*********************************************************************************/
export const updateAPNSTokenIfChanged = async (doctor) => {
  console.log('updateAPNSTokenIfChanged', doctor.id);
  const apnsToken = await messaging().getAPNSToken(); // get APNS Token
  if (apnsToken) {
    console.log('User APNS Token:', apnsToken);
  }
  console.log('apns token ', doctor.apnsToken, " =? ", apnsToken);
  if (apnsToken !== doctor.apnsToken) {
    doctorsRef.doc(doctor.id).update({
      apnsToken: apnsToken
    })
  }
}
/*********************************************************************************/

/*********************************************************************************/
export const updateFCMTokenIfChanged = async (doctor) => {
  console.log('updateFCMTokenIfChanged', doctor.id);
  messaging()
        .getToken()
        .then(token => {
          console.log('FCM tokens ', doctor.notificationTokens, " contains? ", token);
          if (doctor.notificationTokens == null) { // no existing notification tokens
            var tokens = [token]
            doctorsRef.doc(doctor.id).update({
              notificationTokens: tokens
            })
          } else if (!doctor.notificationTokens.includes(token)) { // fcm token not already in database
            console.log("FCM token not included already");
            var tokens = doctor.notificationTokens;
            tokens.push(token);
            doctorsRef.doc(doctor.id).update({
              notificationTokens: tokens
            })
          }

          messaging().onTokenRefresh(token => {
            updateFCMTokenIfChanged(doctor);
          });
        });
}
/*********************************************************************************/

/*********************************************************************************/
export const getDoctorThenUpdate = async (doctorsRefId, updateFunction) => {
  console.log('Get Doctor data', doctorsRefId);
  const snapshot = await doctorsRef.where("id", "==", doctorsRefId).get()
  .then(function(querySnapshot) {
    if (querySnapshot.empty) {
      updateFunction(null);
    } else {querySnapshot.forEach(function(doc) {
      // doc.data() is never undefined for query doc snapshots
      console.log('doctor data ', doc.id, " => ", doc.data());
      // changeDoctorKeytoID(doc.id, doc.data(), doc.data().id);
      updateFunction(doc.data());
    })}
  })
  .catch(function(error) {
    console.log("Error getting Doctor: ", error);
  });
}
/*********************************************************************************/

/*********************************************************************************/
export const getDoctorDocuments = async (doctorsRefId) => {
  console.log("getDoctorDocuments");
  storage()
  .ref(`doctors/${doctorsRefId}/documents`).listAll().then(function(res) {
    return res.items.forEach(function(itemRef) {
      return itemRef.getDownloadURL()
      .then( url => {
        console.log( "Got Doctor Image download url: ", url );
        return url;
      });
    });
  }).catch(function(error) {
    // Uh-oh, an error occurred!
  });
}
/*********************************************************************************/

/*********************************************************************************/
export const addSimpleUserDoctor = (doctor) => {
  // const addDoctor = await firestore().collection('doctors').put(doctor);
  console.log('Put Doctors data ', doctor);
  // const timestamp = new Date().getTime().toString();
  doctorsRef.doc(doctor.id).set({
    type: 1,
    email: doctor.email,
    id: doctor.id,
  })
}
/*********************************************************************************/

/*********************************************************************************/
export const addDoctor = (doctor) => {
  // const addDoctor = await firestore().collection('doctors').put(doctor);
  console.log('Put Doctors data ', doctor);
  const timestamp = new Date().getTime().toString();
  doctorsRef.doc(timestamp).set({
    type: 1,
    firstName: doctor.firstName,
    lastName: doctor.lastName,
    name: doctor.firstName.concat(' ', doctor.lastName),
    phoneNumber: doctor.phoneNumber,
    email: doctor.email,
    id: timestamp,
    specialty: doctor.specialty,
    subspecialty: doctor.subspecialty,
  })
}
/*********************************************************************************/

/*********************************************************************************/
export const changeDoctorKeytoID = (oldKey, doctor, newKey) => {
  console.log("!!changeDoctorKeytoID!!");
  console.log(oldKey, " " , doctor, " " , newKey);
  doctorsRef.doc(newKey).set(doctor);
  doctorsRef.doc(oldKey).delete().then(function() {
    console.log("Document successfully deleted!");
  }).catch(function(error) {
    console.log("Error removing document: ", error);
  });
}
/*********************************************************************************/

/*********************************************************************************/
export const claimDoctorProfile = (doctor, userId) => {
  console.log('Claim Doctors Profile ', doctor);
  doctorsRef.doc(doctor.id).set({
    id: userId
  })
  this.changeDoctorKeytoID(doctor.id, doctor, userId);
}
/*********************************************************************************/

/*********************************************************************************/
export const getDoctorImage = (doctorsRefId) => {
  storage()
  .ref(`doctors/${doctorsRefId}/images/profileImage`)
  .getDownloadURL()
  .then( url => {
    console.log( "Got Doctor Image download url: ", url );
    return url;
  });
}
/*********************************************************************************/

/*********************************************************************************/
export const getLogoImage = (doctorsRefId) => {
  storage()
  .ref(`doctors/${doctorsRefId}/images/logoImage`)
  .getDownloadURL()
  .then( url => {
    console.log( "Got Logo download url: ", url );
    return url;
  });
}
/*********************************************************************************/

/*********************************************************************************/
export const convertToE164 = (num) => {
  let phoneNumber = num.startsWith('+1') ? num : num.startsWith('1') ? "+".concat(num) : "+1".concat(num);
  let phoneNumberE164 = phoneNumber.replace('(','').replace(')','').replace(/ /, '').replace(' - ','');
  console.log(phoneNumber, " -> ", phoneNumberE164);
  return phoneNumberE164;
}
/*********************************************************************************/

/*********************************************************************************/
export const saveDoctorDataUpdates = (doctorsRefId, newData) => {
  console.log("saveDoctorDataUpdates", newData);
  doctorsRef.doc(doctorsRefId).update(newData)
}
/*********************************************************************************/

/*********************************************************************************/
export const addImageURLToDoctor = (doctorsRefId, url) => {
  console.log("addImageURLToDoctor");
  doctorsRef.doc(doctorsRefId).update({
    imageURL: url
  })
}
/*********************************************************************************/

/*********************************************************************************/
export const addLogoURLToDoctor = (doctorsRefId, url) => {
  console.log("addLogoURLToDoctor");
  doctorsRef.doc(doctorsRefId).update({
    logoURL: url
  })
}
/*********************************************************************************/

/*********************************************************************************/
export const uploadDocument = (doctor, title, imageUri) => {
  // const ext = this.state.imageUri.split('.').pop(); // Extract image extension
  const documentID = new Date().getTime().toString();
  const filename = `${doctor.id}.${documentID}`; // Generate unique name
  const uploadTask = storage().ref(`doctors/${doctor.id}/documents/${filename}`)

  uploadTask.putFile(imageUri, {contentType: 'image/jpeg'}).then(function(){
    return uploadTask.getDownloadURL();
  }).then(function(url){
    console.log("Image url", {url:url});
    addDocumentToDoctor(doctor.id, documentID, title, url);
    this.sendDocumentNotifications(doctor, title);
  }).catch(function(error){
    console.log("Error while saving the image.. ", error);
  });
};
/*********************************************************************************/

/*********************************************************************************/
export const addDocumentToDoctor = (doctorRefId, documentID, title, url) => {
  console.log("addLogoURLToDoctor", `documents.${documentID}`);
  const doctorPath = `documents.${documentID}`;
  doctorsRef.doc(doctorRefId).update({
    documentPath: {
      title: title,
      url: url,
      id: documentID,
    }
  });
}
/*********************************************************************************/

/*********************************************************************************/
sendDocumentNotifications = (doctor, documentTitle, deepLinkURL) => { // todo DEEP LINK URL
  try {

    var referralNotificationTokens = Object.values(doctor.referralNotificationTokens);
    var parms = {
        doctorName: doctor.name,
        doctorID: doctor.id,
        referralNotificationTokens: referralNotificationTokens,
        documentTitle: documentTitle
    }

    var sendDocumentNotifications = firebase
    .functions()
    .httpsCallable('sendDocumentNotifications');

    sendDocumentNotifications(parms)
    .then(function(result) {
      console.log('sendDocumentNotifications called successfully.', result);
    })
    .catch(function(error) {
      // Getting the Error details.
      var code = error.code;
      var message = error.message;
      var details = error.details;
      console.log(
        'There was an error when calling the sendDocumentNotifications Cloud Function',
        error,
      );
    });
  } catch (e) {
      console.log(e);
     }
}
/*********************************************************************************/

/*********************************************************************************/
export const uploadDoctorImage = (doctor, imageUri, updateImageFunction) => {
  // const ext = this.state.imageUri.split('.').pop(); // Extract image extension
  const filename = `${doctor.id}-profileImage`; // Generate unique name
  const uploadTask = storage().ref(`doctors/${doctor.id}/images/${filename}`)

  uploadTask.putFile(imageUri, {contentType: 'image/jpeg'}).then(function(){
    return uploadTask.getDownloadURL();
  }).then(function(url){
    console.log("Image url", {url:url});
    addImageURLToDoctor(doctor.id, url);
    updateImageFunction(url);
  }).catch(function(error){
    console.log("Error while saving the image.. ", error);
    onError(error);
  });
};
/*********************************************************************************/

/*********************************************************************************/
export const uploadLogoImage = (doctor, imageUri, updateImageFunction) => {
  // const ext = this.state.imageUri.split('.').pop(); // Extract image extension
  const filename = `${doctor.id}-LOGO`; // Generate unique name
  const uploadTask = storage().ref(`doctors/${doctor.id}/images/${filename}`)

  uploadTask.putFile(imageUri, {contentType: 'image/jpeg'}).then(function(){
    return uploadTask.getDownloadURL();
  }).then(function(url){
    console.log("Image url", {url:url});
    addLogoURLToDoctor(doctor.id, url);
    updateImageFunction(url);
  }).catch(function(error){
    console.log("Error while saving the image.. ", error);
  });
};
/*********************************************************************************/

/*********************************************************************************/
export const storeReferralData = (referringDoctorID, doctorsRefId, patientParms) => {
  const referralID = new Date().getTime().toString();
  const referral = {
          referringDoctor: referringDoctorID,
          receivingDoctor: doctorsRefId,
          timestamp: referralID,
          patientFirstName: patientParms.patientFirstName,
          patientLastName: patientParms.patientLastName,
          patientPhoneNumber: patientParms.patientPhoneNumber,
          patientEmail: patientParms.patientEmail,
          notes: patientParms.notes
      };
  console.log("storeReferralData ", referral);
  doctorsRef.doc(referringDoctorID).collection("referralsSent").doc(referralID).set(referral)
      .then(function() {
        console.log("Referral successfully saved to referring doctor!");
      })
      .catch(function(error) {
        console.log("Error saving referral to referring doctor: ", error);
      });


  const specialty = patientParms.doctorSpecialty;
  doctorsRef.doc('${referringDoctorID}/favoriteSpecialties').update({
      specialty:true
    }).then(function(){
       console.log("Successfully added specialty to favorites");
    }).catch(function(error) {
      console.log("Error saving specialty to favorites: ", error);
    });


  doctorsRef.doc(doctorsRefId).collection("referralsReceived").doc(referralID).set(referral)
      .then(function() {
        console.log("Referral successfully saved to receiving doctor!");
      })
      .catch(function(error) {
        console.log("Error saving referral to receiving doctor: ", error);
      });
}
/*********************************************************************************/

/*********************************************************************************/
export const sendReferral = async (referralParms) => {
  console.log('send referral');
  console.log(referralParms);
  sendReferralTextToPatient(referralParms);
  // sendReferralTextToDoctor(referralParms); // Drew decided not to
  if (referralParms.patientEmail != "") {
    sendReferralEmailToPatient(referralParms);
  }
  sendReferralEmailToDoctor(referralParms);
  sendReferralNotifications(referralParms);
  updateReferralNotificationTokens(referralParms.referringDoctorId, referralParms.doctorId, referralParms.referralNotificationTokens);
}
/*********************************************************************************/

/*********************************************************************************/
sendReferralNotifications = async (referralParms) => { // todo DEEP LINK URL
  try {

    // console.log("SendReferralNotification referringDoctorName "+ referringDoctorName);
    // console.log("SendReferralNotification receivingDoctorID "+ receivingDoctorID);
    // console.log("SendReferralNotification tokens "+ notificationTokens);
    //
    // var parms = {
    //     referringDoctorName: referringDoctorName,
    //     receivingDoctorID: receivingDoctorID,
    //     referralNotificationTokens: notificationTokens
    // }

    var sendReferralNotifications = firebase
    .functions()
    .httpsCallable('sendReferralNotifications');

    sendReferralNotifications({ referralParms : referralParms })
    .then(function(result) {
      console.log('sendReferralNotifications called successfully.', result);
    })
    .catch(function(error) {
      // Getting the Error details.
      var code = error.code;
      var message = error.message;
      var details = error.details;
      console.log(
        'There was an error when calling the sendReferralNotifications Cloud Function',
        error,
      );
    });
  } catch (e) {
      console.log(e);
     }
}
/*********************************************************************************/

/*********************************************************************************/
sendReferralTextToPatient = async (referralParms) => {
  console.log('sendReferralTextToPatient');
  console.log(referralParms);
  try {
    var sendReferralTextToPatient = firebase
    .functions()
    .httpsCallable('sendReferralTextToPatient');

    sendReferralTextToPatient({referralParms: referralParms})
    .then(function(result) {
      console.log('sendReferralTextToPatient called successfully.', result);
    })
    .catch(function(error) {
      // Getting the Error details.
      var code = error.code;
      var message = error.message;
      var details = error.details;
      // [START_EXCLUDE]
      console.log(
        'There was an error when calling the sendReferralTextToPatient Cloud Function',
        error,
      );
    });
  } catch (e) {
      console.log(e);
     }
}
/*********************************************************************************/
/*********************************************************************************/
sendReferralTextToDoctor = async (referralParms) => {
  console.log('sendReferralTextToDoctor');
  console.log(referralParms);
  try {
    var sendReferralTextToDoctor = firebase
    .functions()
    .httpsCallable('sendReferralTextToDoctor');

    sendReferralTextToDoctor({referralParms: referralParms})
    .then(function(result) {
      console.log('sendReferralTextToDoctor called successfully.', result);
    })
    .catch(function(error) {
      // Getting the Error details.
      var code = error.code;
      var message = error.message;
      var details = error.details;
      // [START_EXCLUDE]
      console.log(
        'There was an error when calling the sendReferralTextToDoctor Cloud Function',
        error,
      );
    });
  } catch (e) {
      console.log(e);
     }
}
/*********************************************************************************/
/*********************************************************************************/
sendReferralEmailToDoctor = async (referralParms) => {
  console.log('sendReferralEmailToDoctor');
  console.log(referralParms);
  try {
    var sendReferralEmailToDoctor = firebase
    .functions()
    .httpsCallable('sendReferralEmailToDoctor');

    sendReferralEmailToDoctor({referralParms: referralParms})
    .then(function(result) {
      console.log('sendReferralEmailToDoctor Cloud Function called successfully.', result);
    })
    .catch(function(error) {
      // Getting the Error details.
      var code = error.code;
      var message = error.message;
      var details = error.details;
      // [START_EXCLUDE]
      console.log(
        'There was an error when calling the sendReferralEmailToDoctor Cloud Function',
        error,
      );
    });
  } catch (e) {
      console.log(e);
     }
}
/*********************************************************************************/

/*********************************************************************************/
sendReferralEmailToPatient = async (referralParms) => {
  console.log('sendReferralEmailToPatient');
  console.log(referralParms);
  try {
    var sendReferralEmailToPatient = firebase
    .functions()
    .httpsCallable('sendReferralEmailToPatient');

    sendReferralEmailToPatient({referralParms: referralParms})
    .then(function(result) {
      console.log('sendReferralEmailToPatient Cloud Function called successfully.', result);
    })
    .catch(function(error) {
      // Getting the Error details.
      var code = error.code;
      var message = error.message;
      var details = error.details;
      // [START_EXCLUDE]
      console.log(
        'There was an error when calling the sendReferralEmailToPatient Cloud Function',
        error,
      );
    });
  } catch (e) {
      console.log(e);
     }
}
/*********************************************************************************/

/*********************************************************************************/
export const updateReferralNotificationTokens = async (doctorId, referringDoctorId, referringDoctorNotificationTokens) => {
  console.log("updateReferralNotificationTokens ", referringDoctorId, doctorId);
  const key = 'referralNotificationTokens.'.concat(referringDoctorId);
  console.log("key", key);
  doctorsRef.doc(doctorId).update({
    key: referringDoctorNotificationTokens,
  })
}
/*********************************************************************************/
