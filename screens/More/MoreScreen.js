// import React, { Component } from 'react';
// import {
//   Text, View, ScrollView, StyleSheet, TouchableOpacity, Image,
//   Platform, Modal, TextInput, Share, Linking, AsyncStorage, Picker
// } from 'react-native';
// import NetInfo from '@react-native-community/netinfo';
// import { NavigationEvents } from 'react-navigation';
// import Config from '../../Config/Config';
// import Global from '../Global';
// import CountryDetails from '../CountryDetails';
// import ContactUs from '../Contact/ContactUs';
// import ProvideFeedback from '../More/ProvideFeedback';
// import Events from '../More/Events';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import { ImagePicker, Permissions, Constants } from 'expo';
// import OnlineCheckerToast from '../OflineSection/OnlineCheckerToast';
// import SecureFetch from '../SecureFetch';
// import Prompt from 'react-native-prompt-crossplatform';
// import Language from '../More/Language';
// import ModalSelector from 'react-native-modal-selector';
// import Theme from '../Theme';
// import Currency from '../More/Currency';
// import StaticPageTile from './StaticPageTile';
// import StaticPageDescription from './StaticPageDescription';
// import Checkout from '../More/Checkout';
// import Header from '../../components/Header';

// export default class MoreScreen extends Component {
//   static navigationOptions = { header: null }
//   constructor(props) {
//     super(props);
//     this.state = {
//       image: '',
//       name: null,
//       phone: null,
//       location: null,
//       currency: '',
//       language: '',
//       modalVisible: false,
//       detailInfo: '',
//       selectedOption: '',
//       location: '',
//       netInfo: '',
//       userName: '',
//       userPhone: '',
//       userLocation: '',
//       IfNoneMatch: '',
//       countryCodeKey: '',
//       countryCodeLabel: '',
//       userCountryCode: '',
//       profileTypeValue: '',
//       profileTypeId: '',
//       profileType: '',
//       AsyncProfileTypes: '',
//       font: '',
//       txtColor: '',
//       titleTxtColor: '',
//       modalCancelColor: '',
//       modalSubmitColor: '',
//       CurrencyCode: '',
//       modalSubmitColor: '',
//       result: [],
//       refreshing: true,
//       cartUrl: Config.Basepath + '?target=cart',
//       searchIconColor: '',
//       visiblePrompt: false,
//       promptValue: ''
//     };

//     this.handleRefresh();
//     this.getCurrencyDetail();
//     this.state.profileType = Global.data.types;
//     this.getProducts();
//   }

//   async getCurrencyDetail() {
//     Global.CurrencyRate = await AsyncStorage.getItem('CurrencyRate');
//     Global.CurrencyPrefix = await AsyncStorage.getItem('CurrencyPrefix');
//     Global.CurrencySuffix = await AsyncStorage.getItem('CurrencySuffix');
//     Global.CurrencyDelimeter = await AsyncStorage.getItem('CurrencyDelimeter');
//   }

//   async handleRefresh() {
//     this.setState({ name: await AsyncStorage.getItem('Name') });
//     this.setState({ phone: await AsyncStorage.getItem('Phone') });
//     this.setState({ location: await AsyncStorage.getItem('Location') });
//     this.setState({ language: await AsyncStorage.getItem('Language') });
//     this.setState({ IfNoneMatch: await AsyncStorage.getItem('IfNoneMatch') });
//     this.setState({ countryCodeKey: await AsyncStorage.getItem('CountryCde') });
//     this.setState({ AsyncProfileTypes: await AsyncStorage.getItem('ProfileTypes') });
//     this.setState({ profileTypeId: await AsyncStorage.getItem('ProfileTypeId') });
//     this.setState({ CurrencyCode: await AsyncStorage.getItem('CurrencyCode') });
//   }

//   askPermissionsAsync = async () => {
//     await Permissions.askAsync(Permissions.CAMERA);
//     await Permissions.askAsync(Permissions.CAMERA_ROLL);
//   };

//   async onShare() {
//     try {
//       if (Global.PlatformInfo === 'android') {
//         const result = await Share.share({
//           message:
//             'http://play.google.com/store/apps/details?id=' + Config.AppPackageName,
//         })
//       } else if (Global.PlatformInfo === 'ios') {
//         const result = await Share.share({
//           message:
//             'itms://itunes.apple.com/us/app/apple-store/' + Config.AppPackageName + '?mt=8',
//         })
//       }
//     } catch (error) {
//       alert(error.message);
//     }
//   };

//   onReview() {
//     if (Global.PlatformInfo === 'android') {
//       Linking.openURL('http://play.google.com/store/apps/details?id=' + Config.AppPackageName);
//     } else if (Global.PlatformInfo === 'ios') {

//     }
//   }

//   // pickImage = async () => {
//   //   if (this.state.isConnected === false) {
//   //     alert('No internet Connection, Please connect to internet');
//   //   }
//   //   else { 
//   //   await this.askPermissionsAsync();
//   //   let result = await ImagePicker.launchImageLibraryAsync({
//   //     allowsEditing: true,
//   //     aspect: [6, 8],
//   //     base64: true,
//   //     quality: 1,
//   //   });
//   //   if (!result.cancelled) {
//   //     this.setState({ image: result.uri }, () => {
//   //       Global.UserData.photo = result.base64;
//   //       this.props.navigation.navigate('LoadingPage');
//   //       SecureFetch.updateProfile('profile');
//   //       this.props.navigation.navigate('Profile');
//   //       this.state.PhotoUpdatestatus = true;
//   //     });
//   //   }
//   // };

//   submitDetail() {
//     if (this.state.userName != null && this.state.userPhone != null && this.state.userLocation != null && this.state.AsyncProfileTypes != null) {
//       this.state.name = this.state.userName;
//       this.state.phone = this.state.userPhone;
//       this.state.location = this.state.userLocation;
//       AsyncStorage.setItem('Name', this.state.userName);
//       AsyncStorage.setItem('Phone', this.state.userPhone);
//       AsyncStorage.setItem('Location', this.state.userLocation);
//       let countryCde = this.state.countryCodeKey.toString();
//       AsyncStorage.setItem('CountryCde', countryCde);
//       AsyncStorage.setItem('ProfileTypes', this.state.AsyncProfileTypes);
//       var typesId = this.state.profileTypeId.toString();
//       AsyncStorage.setItem('ProfileTypeId', typesId);

//       this.setModalVisible(false);
//     } else {
//       if (this.state.name != null &&
//         this.state.phone != null &&
//         this.state.location != null &&
//         this.state.countryCodeKey != null &&
//         this.state.AsyncProfileTypes != null) {
//         this.setModalVisible(false);
//       } else {
//         alert(SecureFetch.getTranslationText('mbl-MandatoryFieldTxt', 'All feilds are requied'));
//       }
//     }
//   }

//   submitDetailValidation() {
//     if (this.state.userName == '') {
//       this.state.userName = this.state.name;
//     }
//     if (this.state.userPhone == '') {
//       this.state.userPhone = this.state.phone;
//     }
//     if (this.state.userLocation == '') {
//       this.state.userLocation = this.state.location;
//     }
//     this.state.countryCodeKey = this.state.countryCodeKey != null ? this.state.countryCodeKey : Global.DefaultCountryCode;
//     this.submitDetail();
//   }

//   fillUserDetailModal() {
//     this.setModalVisible(true);
//   }

//   closeModal = () => {
//     this.handleRefresh();
//     this.setModalVisible(false);
//   }

//   setModalVisible = (visible) => {
//     this.setState({ modalVisible: visible });
//   }

//   componentWillMount() {
//     NetInfo.fetch().then(isConnected => {
//       this.setState({ netInfo: isConnected });
//     });
//     NetInfo.addEventListener(state => { this.handleConnectivityChange(state.isConnected) });
//   }

//   handleConnectivityChange = (isConnected) => {
//     this.setState({ netInfo: isConnected });
//     Global.NetworkInfo = isConnected;
//   }

//   openSearchPrompt() {
//     this.setState({ visiblePrompt: true });
//   }

//   searchNavigation(value) {
//     Global.SearchSourceNavKey = 'MoreScreen';
//     this.props.navigation.navigate('Search',
//       { sourcePage: 'MoreScreen', data: value })
//   }

//   feedBackValidation() {
//     if (this.state.name != null && this.state.phone != null) {
//       this.props.navigation.navigate('ProvideFeedback');
//     } else {
//       alert(SecureFetch.getTranslationText('mbl-NameAndPhoneValForFeedback',
//         'Name and phone number required for feedback'));
//     }
//   }

//   openLanguagePage() {
//     if (Global.NetworkInfo == true) {
//       this.props.navigation.navigate('Language', { sourcePage: 'MoreScreen' });
//     } else {
//       alert(SecureFetch.getTranslationText('mbl-OfflineTxt', 'You are offline, Please connect to internet'));
//     }
//   }

//   changeCurrencyHandler() {
//     this.props.navigation.navigate('Currency', { sourcePage: 'MoreScreen' });
//   }

//   handleEventsNavigation() {
//     if (Global.EnabledNews != '') {
//       this.props.navigation.navigate('Events');
//     } else {
//       alert('No Events available')
//     }
//   }

//   async getProducts() {
//     let sresult = [];
//     for (var prop in Global.data.static_pages) {
//       if (Object.prototype.hasOwnProperty.call(Global.data.static_pages, prop)) {
//         var spage = prop;
//         sresult.push(Global.data.static_pages[spage])
//         this.state.result = sresult;
//       }
//     }
//   }

//   handleStaticPageNavigation(item) {
//     this.props.navigation.navigate('StaticPageDescription', { data: item });
//   }

//   goToCheckout() {
//     this.props.navigation.navigate('Checkout', { sourcePage: 'MoreScreen' })
//   }

//   openCartPage() {
//     this.props.navigation.navigate('Checkout', { sourcePage: 'MoreScreen' });
//   }

//   render() {
//     this.state.font = Theme.setFont();
//     this.state.txtColor = Theme.setColorTheme('TxtColor');
//     this.state.titleTxtColor = Theme.setColorTheme('TitleTxtColor');
//     this.state.modalCancelColor = Theme.setColorTheme('ModalCancelColor');
//     this.state.modalSubmitColor = Theme.setColorTheme('ModalSubmitColor');
//     this.state.titleColor = Theme.setHeaderAndFooterColor('header-titleColor');
//     this.state.searchIconColor = Theme.setColorTheme('SearchIconColor');
//     const defaultImg = 'http://www.vmalmo.se/wp-content/uploads/2014/12/facebook-blank-photo.jpg';
//     const Entities = require('html-entities').AllHtmlEntities;
//     const entities = new Entities();
//     let { image } = this.state;
//     let companyLogo = Config.Basepath.includes('agri');

//     return (
//       <View style={styles.MainView}>

//         <NavigationEvents
//           onWillFocus={() => this.handleRefresh()}
//         />

//         <Prompt
//           title={SecureFetch.getTranslationText('mbl-EntrSrchTxt', 'Enter search text')}
//           placeholder={SecureFetch.getTranslationText('mbl-SearchPlaceholder', 'Search')}
//           isVisible={this.state.visiblePrompt}
//           onChangeText={text => { this.setState({ promptValue: text }); }}
//           onCancel={() => {
//             this.setState({ promptValue: '', visiblePrompt: false, });
//           }}
//           onSubmit={() => {
//             let searchValue = this.state.promptValue.trim();
//             if (searchValue == '') {
//               alert('Please enter search text ...');
//             }
//             else {
//               this.setState({ visiblePrompt: false, }, () => {
//                 this.state.promptValue = '';
//                 Global.textSearch = searchValue;
//                 this.searchNavigation(searchValue)
//               }
//               );
//             }
//           }}
//         />

//         <Modal
//           animationType="slide"
//           transparent={true}
//           visible={this.state.modalVisible} onRequestClose={() => {
//             this.setModalVisible(!this.state.modalVisible);
//           }}>
//           <View style={styles.ModalStyles}>

//             <ScrollView>
//               <View>
//                 <Text style={[styles.infoText,
//                 { color: this.state.txtColor, fontFamily: this.state.font, fontSize: Global.TxtFontSize }]}>
//                   {SecureFetch.getTranslationText('mbl-EnterDetailsTxt', 'Please enter the below details, All the fields are mandatory')}</Text>
//                 <View style={styles.FirstInputWrap}>

//                   <TextInput style={[styles.NameStyles, {
//                     borderBottomWidth: 1,
//                     color: this.state.txtColor,
//                     fontFamily: this.state.font,
//                     fontSize: Global.TxtFontSize
//                   }]}
//                     underlineColorAndroid='transparent'
//                     placeholder={SecureFetch.getTranslationText('mbl-NameTxt', 'Enter your Name')}
//                     onChangeText={(userName) => this.setState({ userName })} >{this.state.name}</TextInput>

//                   <ModalSelector
//                     data={this.state.profileType}
//                     initValue="Select"
//                     onChange={(option) => {
//                       this.setState({ profileTypeId: option.key })
//                       this.setState({ AsyncProfileTypes: option.label })
//                     }}
//                   >
//                     <TextInput
//                       style={[styles.NameStyles, {
//                         borderBottomWidth: 1,
//                         color: this.state.txtColor,
//                         fontFamily: this.state.font,
//                         fontSize: Global.TxtFontSize
//                       }]}
//                       placeholder={SecureFetch.getTranslationText('mbl-ProfileType', 'Profile Type')}
//                       underlineColorAndroid='transparent'
//                       value={this.state.AsyncProfileTypes == null ? this.state.profileTypeValue
//                         : this.state.AsyncProfileTypes}
//                     />
//                   </ModalSelector>

//                   <View style={{
//                     borderBottomWidth: 1,
//                   }}>
//                     <Picker mode="dropdown"
//                       style={[styles.NameStyles, {
//                         color: this.state.txtColor,
//                         fontFamily: this.state.font,
//                         fontSize: Global.TxtFontSize
//                       }]}
//                       itemTextStyle={{ color: this.state.txtColor, fontFamily: this.state.font }}
//                       itemStyle={{ color: '#00000', fontFamily: this.state.font }}
//                       selectedValue={this.state.countryCodeKey == null ? Global.DefaultCountryCode : this.state.countryCodeKey}
//                       onValueChange={(countryCodeKey) => this.setState({ countryCodeKey: countryCodeKey })}>
//                       {
//                         CountryDetails.map((item) => {
//                           return (
//                             <Picker.Item
//                               label={item.name + " (" + item.dial_code + ")"}
//                               value={item.dial_code}
//                             />
//                           );
//                         })
//                       }
//                     </Picker>
//                   </View>

//                   <TextInput style={[styles.NameStyles, {
//                     borderBottomWidth: 1,
//                     color: this.state.txtColor,
//                     fontFamily: this.state.font,
//                     fontSize: Global.TxtFontSize
//                   }]}
//                     keyboardType='numeric'
//                     maxLength={10}
//                     underlineColorAndroid='transparent'
//                     placeholder={SecureFetch.getTranslationText('mbl-PhoneTxt', 'Enter your Mobile Number')}
//                     onChangeText={(userPhone) => this.setState({ userPhone })} >{this.state.phone}</TextInput>

//                   <TextInput style={[styles.NameStyles, {
//                     borderBottomWidth: 1,
//                     color: this.state.txtColor,
//                     fontFamily: this.state.font,
//                     fontSize: Global.TxtFontSize
//                   }]}
//                     keyboardType='numeric'
//                     maxLength={6}
//                     underlineColorAndroid='transparent'
//                     placeholder={SecureFetch.getTranslationText('mbl-LocTxt', 'Enter your Pin code')}
//                     onChangeText={(userLocation) => this.setState({ userLocation })} >{this.state.location}</TextInput>
//                 </View>
//                 <View style={styles.row}>
//                   <TouchableOpacity onPress={() => { this.submitDetailValidation() }}>
//                     <Text style={[styles.submitStyle, { fontSize: Global.TxtFontSize, color: this.state.modalSubmitColor, fontFamily: this.state.font }]}>
//                       {SecureFetch.getTranslationText('mbl-Submit', 'Submit')}
//                     </Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity onPress={() => { this.closeModal() }}>
//                     <Text style={[styles.cancelStyle, { fontSize: Global.TxtFontSize, color: this.state.modalCancelColor, fontFamily: this.state.font }]}>
//                       {SecureFetch.getTranslationText('mbl-Cancel', 'Cancel')}
//                     </Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </ScrollView>

//           </View>
//         </Modal>

//         <Header
//           openSearchPrompt={() => this.openSearchPrompt()}
//           openLanguagePage={() => this.openLanguagePage()}
//           openCartPage={() => this.openCartPage()}
//           openDrawer={() => this.openDrawer()}
//           navigation={this.props.navigation}
//         />

//         <ScrollView>
//           <Text style={[styles.profileTitle, { fontSize: Global.TxtTittleFontSize, color: this.state.titleTxtColor, fontFamily: this.state.font }]}>
//             {SecureFetch.getTranslationText('mbl-MyProfile', 'My Profile')}</Text>
//           <View style={styles.aboutYouStyle}>
//             <View style={styles.ImageContainer}>
//               <TouchableOpacity>
//                 <Image source={{ uri: image || defaultImg }} style={{ width: 100, height: 100, borderRadius: 20 }} />
//               </TouchableOpacity>
//             </View>

//             <View style={{ width: '58%', marginLeft: '2%' }}>

//               <View style={{ borderBottomColor: '#00000', borderBottomWidth: 1 }}>
//                 <TouchableOpacity onPress={() => { this.fillUserDetailModal() }}>
//                   <Text style={[styles.lineStyles, { fontSize: Global.TxtFontSize, color: this.state.txtColor, fontFamily: this.state.font }]}>
//                     {SecureFetch.getTranslationText('mbl-Name', 'Name')}: {this.state.name}</Text>
//                   <Icon name='angle-right' size={20} style={styles.forwardIconStyles} />
//                 </TouchableOpacity>
//               </View>

//               <View style={{ borderBottomColor: '#00000', borderBottomWidth: 1 }}>
//                 <TouchableOpacity onPress={() => { this.fillUserDetailModal() }}>
//                   <Text style={[styles.lineStyles, { fontSize: Global.TxtFontSize, color: this.state.txtColor, fontFamily: this.state.font }]}>
//                     {SecureFetch.getTranslationText('mbl-Phone', 'Phone')}: {this.state.countryCodeKey}{this.state.phone}</Text>
//                   <Icon name='angle-right' size={20} style={styles.forwardIconStyles} />
//                 </TouchableOpacity>
//               </View>

//               <View style={{ borderBottomColor: '#00000', borderBottomWidth: 1 }}>
//                 <TouchableOpacity onPress={() => { this.fillUserDetailModal() }}>
//                   <Text style={[styles.lineStyles, { fontSize: Global.TxtFontSize, color: this.state.txtColor, fontFamily: this.state.font }]}>
//                     {SecureFetch.getTranslationText('mbl-Location', 'Location')}: {this.state.location}</Text>
//                   <Icon name='angle-right' size={20} style={styles.forwardIconStyles} />
//                 </TouchableOpacity>
//               </View>

//               <View style={{ borderBottomColor: '#00000', borderBottomWidth: 1 }}>
//                 <TouchableOpacity onPress={() => { this.fillUserDetailModal() }}>
//                   <Text style={[styles.lineStyles, { fontSize: Global.TxtFontSize, color: this.state.txtColor, fontFamily: this.state.font }]}>
//                     {SecureFetch.getTranslationText('mbl-ProfileType', 'Profile Type')}: {this.state.AsyncProfileTypes}</Text>
//                   <Icon name='angle-right' size={20} style={styles.forwardIconStyles} />
//                 </TouchableOpacity>
//               </View>

//               <View style={{ borderBottomColor: '#00000', borderBottomWidth: 1 }}>
//                 <TouchableOpacity onPress={() => this.changeCurrencyHandler()}>
//                   <Text style={[styles.lineStyles, { fontSize: Global.TxtFontSize, color: this.state.txtColor, fontFamily: this.state.font }]}>
//                     {SecureFetch.getTranslationText('mbl-Currency', 'Currency')}: {this.state.CurrencyCode}</Text>
//                   <Icon name='angle-right' size={20} style={styles.forwardIconStyles} />
//                 </TouchableOpacity>
//               </View>

//               <View>
//                 <TouchableOpacity onPress={() => this.openLanguagePage()}>
//                   <Text style={[styles.lineStyles, { fontSize: Global.TxtFontSize, color: this.state.txtColor, fontFamily: this.state.font }]}>
//                     {SecureFetch.getTranslationText('mbl-Language', 'Language')}: {this.state.language}</Text>
//                   <Icon name='angle-right' size={20} style={styles.forwardIconStyles} />
//                 </TouchableOpacity>
//               </View>

//             </View>
//           </View>



//           <View style={{ borderTopColor: '#DCDCDC', borderTopWidth: 1, marginTop: '30%' }}>
//             <Text style={[styles.poweredByStyle, { color: this.state.txtColor, fontFamily: this.state.font }]}>
//               {SecureFetch.getTranslationText('mbl-PoweredBy', 'powered by')}
//             </Text>
//             <TouchableOpacity onPress={() => Linking.openURL("https://nambusiness.live/")} >
//               {
//                 companyLogo ? <Image style={styles.poweredByImageStyles}
//                   source={require('../../assets/images/MahindraSplash1.png')} /> :
//                   <Image style={styles.poweredByImageStyles}
//                     source={require('../../assets/images/NamLogo.png')} />
//               }
//             </TouchableOpacity>
//             <Text style={[styles.VersionStyle, { color: this.state.txtColor, fontFamily: this.state.font }]}>
//               Version 1.3.0.10</Text>
//             {
//               Config.TestMode == true ? <Text style={styles.ResponseStatusStyle}>CV: {this.state.IfNoneMatch}/{Global.ResponseStatus}</Text> : null
//             }
//           </View>
//         </ScrollView>

//         <View>
//           {Global.NetworkInfo ? <Text style={styles.toastStyles} /> : <OnlineCheckerToast />}
//         </View>
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   MainView: {
//     flex: 1,
//     flexDirection: 'column',
//   },
//   SubView: {
//     justifyContent: 'center',
//     flexDirection: 'row',
//     alignSelf: 'baseline',
//     marginBottom: '2%'
//   },
//   headerTitleStyles: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginRight: '10%',
//     flexWrap: 'wrap'
//   },
//   headerShadowStyles: {
//     shadowColor: "#000000",
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.27,
//     shadowRadius: 4.65,
//     elevation: 6,
//     paddingBottom: 1
//   },
//   profileTitle: {
//     marginLeft: '5%',
//     marginRight: '5%',
//     marginTop: '5%',
//     fontWeight: 'bold',
//     paddingBottom: '1%'
//   },
//   otherHeaderTitle: {
//     marginTop: '8%',
//     marginLeft: '5%',
//     marginRight: '5%',
//     fontWeight: 'bold',
//     paddingBottom: '2%'
//   },
//   ImageContainer: {
//     marginTop: '3%',
//     marginLeft: '5%',
//     paddingTop: (Platform.OS === 'ios') ? 20 : 0,
//     flexDirection: 'row',
//   },
//   aboutYouStyle: {
//     flex: 1,
//     flexDirection: 'row',
//   },
//   lineStyles: {
//     paddingTop: 4,
//     paddingBottom: 4,
//     paddingRight: '5%',
//   },
//   forwardIconStyles: {
//     position: "absolute",
//     marginTop: '2%',
//     right: '2%'
//   },
//   ModalStyles: {
//     backgroundColor: '#F5F5F5',
//     flexDirection: 'row',
//     alignItems: 'center',
//     width: '100%',
//     marginRight: '5%',
//     marginTop: (Platform.OS === 'ios') ? '8%' : 0,
//   },
//   infoText: {
//     fontWeight: 'bold',
//     marginLeft: '5%',
//     marginRight: '5%',
//     marginTop: '5%',
//   },
//   row: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   FirstInputWrap: {
//     flex: 1,
//     width: '90%',
//     borderColor: "#cccccc",
//     marginLeft: '5%',
//     marginRight: '3%',
//   },
//   NameStyles: {
//     marginTop: '3%',
//     paddingBottom: 7,
//   },
//   submitStyle: {
//     marginTop: '20%',
//     marginRight: '20%',
//     marginLeft: '5%',
//     marginBottom: '20%',
//     fontWeight: 'bold',
//   },
//   cancelStyle: {
//     fontWeight: 'bold',
//   },
//   poweredByStyle: {
//     textAlign: 'center',
//     fontSize: 10
//   },
//   VersionStyle: {
//     flexWrap: 'wrap',
//     textAlign: 'center',
//     fontSize: 10
//   },
//   ResponseStatusStyle: {
//     flexWrap: 'wrap',
//     color: Config.TxtColor,
//     textAlign: 'center',
//     fontSize: 10
//   },
//   searchIconStyles: {
//     marginTop: '65%',
//   },
//   poweredByImageStyles: {
//     width: '70%',
//     height: 30,
//     resizeMode: 'contain',
//     marginLeft: '15%',
//     marginRight: '15%'
//   },
//   othersContainerStyles: {
//     flexDirection: 'row',
//     width: '100%',
//     marginLeft: '10%',
//     marginBottom: '5%'
//   },
//   OtherIconStyles: {
//     width: '30%'
//   },
//   flatListStyles: {
//     flex: 1,
//   },
// });

import React from 'react';
import { Text, View } from 'react-native';

const MoreScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>
        More Screen
      </Text>
    </View>
  );
}

export default MoreScreen;