
/**
* Copyright (c) 2015-present, Facebook, Inc.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
* @format
* @flow
*/

var React = require('react');
var ReactNative = require('react-native');
var {Picker, Text, View, StyleSheet, AppRegistry, Dimensions, ScrollView, Alert} = ReactNative;
import { PricingCard, Icon, Button, Overlay } from 'react-native-elements';
import {COLORS} from '../../Resources/constants.js'
import RNIap, { purchaseUpdatedListener, purchaseErrorListener }from "react-native-iap"


const items = Platform.select({
  ios: [
    'platinum1',
    'silver1'
  ],
  android: [
    'platinum1',
    'silver1'
  ]
});

export default class Upgrade extends React.Component {

  constructor(props) {
    super(props);
    console.log("upgrade constructor");

    // this.getProducts();
  }

  async componentDidMount() {
    try {
      const result = await RNIap.initConnection();
      console.log('result', result);
    } catch (err) {
      console.warn(err.code, err.message);
    }
    purchaseUpdateSubscription = purchaseUpdatedListener(
    (purchase: ProductPurchase) => {
      console.log('purchaseUpdatedListener', purchase);
      this.setState({
        receipt: purchase.transactionReceipt },
        () => {
            this.updateUserType(purchase.productId)
            this.setState({ purchaseId:purchase.productId })
            this.showPurchaseOverlay()
        }
      );
    });
    purchaseErrorSubscription = purchaseErrorListener(
    (error: PurchaseError) => {
      console.log('purchaseErrorListener', error);
      Alert.alert('purchase error', JSON.stringify(error));
    });
  }

  getProducts = async () => {
    console.log("try getting products");
    RNIap.getSubscriptions(items).then((subscriptions) => {
      console.log("got subscriptions");
      this.setState({ subscriptions });
      console.log(subscriptions);
    }).catch((error) => {
      console.log(error.message);
    })
  }

  purchase = async (sku) => {
    console.log("try purchase " + sku);
  try {
    RNIap.requestSubscription(sku);
  } catch (err) {
    console.log("subscription error");
    Alert.alert(err.message);
  }
}

updateUserType = (purchaseId) => {

}

renderPurchaseOverlay = () => {
  const purchaseString = (this.state.purchaseId == "platinum1") ? "Platinum Membership" : "Silver Membership";
  return (
  <Overlay
    isVisible={this.state.showPurchaseOverlay}
    onBackdropPress={() => this.setState({ showPurchaseOverlay: false })}
    style={styles.upgradeOverlay}
    windowBackgroundColor={COLORS.greyBackground}
    overlayBackgroundColor={COLORS.mainColor}
    height={Dimensions.get('window').height * (3 / 5)}
    width={Dimensions.get('window').width * (4 / 5)}
    animationType={'slide'}
    >
    <Text style={styles.overlayTitle} adjustsFontSizeToFit={true}>{"Congratulations!"}</Text>
    <Image
      source={require('../../Resources/doctorIcons/doctorWClipboard.png')}
      style={styles.overlayImage}
      />
    <Text style={styles.overlayMessage} adjustsFontSizeToFit={true}>{"You've purchased the " + purchaseString + "! Let's go customize your profile."}</Text>
    <Button title="View Profile" onPress={() => {
        this.setState({ showPurchaseOverlay: false });
        this.props.navigation.goBack()}}
        />
    </Overlay>
  )};

  showPurchaseOverlay = () => {
    this.setState({ showPurchaseOverlay: true });
  };

  render() {
    const user = this.props.navigation.getParam("user");
    console.log(this.props.navigation);
    console.log("user from props");
    console.log(user);
    return (
      <ScrollView style={styles.component}>
        {user.type < 3 ? <PricingCard
          color="#4f9deb"
          containerStyle={styles.priceCard}
          pricingStyle={styles.pricingStyle}
          titleStyle={styles.titleStyle}
          title="Platinum Doctor Membership"
          price="$49.99/Month"
          info={['Fully customizeable Doctor Profile', 'Rank first in search results', 'Search results show Practice Information, Logo, and profile information', 'Upload documents, newsletters, specials etc', 'Doctors who refer to you receive push notifications when you upload documents']}
          button={{ title: 'Upgrade to Platinum Membership'}}
          onButtonPress={() => this.purchase('platinum1')}
          /> : null}
          {user.type < 2 ? <PricingCard
            color="#4f9deb"
            containerStyle={styles.priceCard}
            pricingStyle={styles.pricingStyle}
            titleStyle={styles.titleStyle}
            title="Silver Doctor Membership"
            price="$9.99/Month"
            info={['Basic customizeable Doctor Profile', 'Public profile page', 'Rank ahead of Basic doctors in search results']}
            button={{ title: 'Upgrade to Silver Membership'}}
            onButtonPress={() => this.purchase('silver1')}
            /> : null}
            {this.state.showPurchaseOverlay ? this.renderPurchaseOverlay() : null }
          </ScrollView>
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
      component: {
        flexDirection: 'column',
        backgroundColor: COLORS.mainColor,
        height: Dimensions.get('window').height,
      },
      priceCard: {
      },
      titleStyle: {
        fontSize: 28,
      },
      pricingStyle: {
        fontSize: 25,
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

    AppRegistry.registerComponent('Upgrade', () => Upgrade);
