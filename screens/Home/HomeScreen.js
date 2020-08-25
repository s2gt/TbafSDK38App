import React, { Component } from 'react';
import {
  Text, View, StyleSheet, TouchableOpacity, ScrollView, TextInput,
  Image, AsyncStorage, BackHandler, Linking, Share
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Config from '../../Config/Config';
import Global from '../Global';
import SecureFetch from '../SecureFetch';
import OnlineCheckerToast from '../OflineSection/OnlineCheckerToast';
import Icon from 'react-native-vector-icons/FontAwesome';
import Prompt from 'react-native-prompt-crossplatform';
import Search from '../Search/Search';
// import HTMLView from 'react-native-htmlview';
import BannerCarousel from '../../components/BannerCarousel';
import Language from '../More/Language';
import Theme from '../Theme';
import moment from 'moment';
import { Card } from 'react-native-cards';
import EventDescription from '../More/EventDescription';
import { WebView } from 'react-native-webview';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Checkout from '../More/Checkout';
import ChildCategory from '../More/ChildCategory';
import { Button } from 'native-base';
import Header from '../../components/Header';
import { NavigationEvents } from 'react-navigation';
import AutoHeightWebView from 'react-native-autoheight-webview';

async function getExpoPushToken() {
  let { status } = await Permissions.askAsync(
    Permissions.NOTIFICATIONS,
  );
  if (status !== 'granted') {
    alert('You need to enable permission in settings')
    return;
  }
  let value = await Notifications.getExpoPushTokenAsync();
  AsyncStorage.setItem('Device_token', value);
}

export default class HomeScreen extends Component {
  static navigationOptions = { header: null, };
  constructor(props) {
    super(props);
    this.state = {
      asin: '',
      title: '',
      price: '',
      rating: '',
      imageUrl: '',
      data: '',
      languageCode: '',
      NetworkInfo: '',
      netInfo: null,
      name: '',
      phone: '',
      location: '',
      language: '',
      titleColor: '',
      bannerImages: [],
      txtColor: '',
      font: '',
      latestEvent: '',
      pdtPriceTxtColor: '',
      titleTxtColor: '',
      callIconColor: '',
      shareIconColor: '',
      notification: '',
      iconName: 'star-o',
      backgroundColor: '',
      titleColor: '',
      searchIconColor: '',
      langIconColor: '',
      visiblePrompt: false,
      promptValue: '',
      buyerId: ''
    };

    AsyncStorage.getItem('LanguageCode').then(languageCode => this.setState({ languageCode }), () => { });
    Global.LanguageCode = this.state.languageCode;
    SecureFetch.getFavEventsItem('favouriteEvents');
    this.getCurrencyDetail();
    this.getLatestEvent();
    SecureFetch.getBannerImagesTop();
  }

  async getCurrencyDetail() {
    Global.CurrencyRate = await AsyncStorage.getItem('CurrencyRate');
    Global.CurrencyPrefix = await AsyncStorage.getItem('CurrencyPrefix');
    Global.CurrencySuffix = await AsyncStorage.getItem('CurrencySuffix');
    Global.CurrencyDelimeter = await AsyncStorage.getItem('CurrencyDelimeter');
    this.setState({ buyerId: await AsyncStorage.getItem('Bid') });
  }

  clearAsync() {
    // AsyncStorage.setItem('selectLanguage', 'False');
    // AsyncStorage.setItem('LoginToken', '');
    // AsyncStorage.setItem('Bid', '');
    // AsyncStorage.setItem('bUserName', '');
    // AsyncStorage.setItem('bEmail', '');
    // AsyncStorage.setItem('favouriteProducts', '');
    // AsyncStorage.setItem('favouriteEvents', '');
    // AsyncStorage.setItem('offlineAppData', '');
    // AsyncStorage.setItem('IfNoneMatch', '');
    // AsyncStorage.setItem('Name', '');
    // AsyncStorage.setItem('Phone', '');
    // AsyncStorage.setItem('CountryCde', '');
    // AsyncStorage.setItem('Location', '');
    // AsyncStorage.setItem('ProfileTypes', '');
    // AsyncStorage.setItem('AppStaringKey', '');
    // AsyncStorage.setItem('bcount', '');
    // AsyncStorage.setItem('StoresData', '');
    // AsyncStorage.setItem('CartProducts', '');
    // SecureFetch.getUtc();
  }

  componentDidMount() {
    getExpoPushToken();
    this._notificationSubscription = Notifications.addListener(this.listen);
    Linking.addEventListener('url', this._handleOpenURL);
    NetInfo.fetch().then(isConnected => {
      this.setState({ netInfo: isConnected });
    });
    NetInfo.addEventListener(state => { this.handleConnectivityChange(state.isConnected) });
    this.handleDeepLinkState();
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this._handleOpenURL);
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton = () => {
    this.props.navigation.navigate('ChildCategory');
    return true;
  }

  listen = (notification) => {
    this.setState({ notification: notification });
    this.handleDeepLinkNavigation(this.state.notification.data.data);
  };

  _handleOpenURL = (event) => {
    this.handleDeepLinkNavigation(event.url);
  }

  handleDeepLinkNavigation(url) {
    // let res = url.split("/")[4];
    // let prodId = url.split("/")[5];
    // for (let i = 0; i < Global.data.products.length; i++) {
    //   if (prodId == Global.data.products[i].productId) {
    //     if (res == 'product') {
    //       this.props.navigation.navigate('Description', { sourcePage: 'HomeScreen', data: prodId });
    //     }
    //   }
    // }
    let res = url.split("/")[4];
    let Id = url.split("/")[5];
    if (Global.EnabledEvents.length > 0) {
      for (let i = 0; i < Global.EnabledEvents[i]; i++) {
        if (Id == Global.EnabledEvents[i].id) {
          Id = Global.EnabledEvents[i];
          if (res == 'Events' && Global.DeepLinkNavToken == true) {
            Global.DeepLinkNavToken = false;
            this.props.navigation.navigate('EventDescription', { sourcePage: 'HomeScreen', data: Id });
          }
        }
      }
    }
  }

  handleDeepLinkState() {
    Linking.getInitialURL().then(url => {
      let res = url.split("/")[4];
      let Id = url.split("/")[5];
      if (Global.EnabledEvents.length > 0) {
        for (let i = 0; i < Global.EnabledEvents[i]; i++) {
          if (Id == Global.EnabledEvents[i].id) {
            Id = Global.EnabledEvents[i];
            if (res == 'Events' && Global.DeepLinkNavToken == true) {
              Global.DeepLinkNavToken = false;
              this.props.navigation.navigate('EventDescription', { sourcePage: 'HomeScreen', data: Id });
            }
          }
        }
      }
    });
  }

  onAddtoStarred = (event) => {
    if (Global.NetworkInfo == true) {
      if (event.starred == 'false') {
        objIndex = Global.EnabledEvents.findIndex((obj => obj.id == event.id));
        Global.EnabledEvents[objIndex].starred = "true";
        this.setState({ iconName: 'star' }, () => {
          AsyncStorage.setItem('favouriteEvents', JSON.stringify(Global.EnabledEvents));
        });
        alert(SecureFetch.getTranslationText('mbl-EventsStarAlert', 'Event starred successfully'));
      } else {
        objIndex = Global.EnabledEvents.findIndex((obj => obj.id == event.id));
        Global.EnabledEvents[objIndex].starred = "false";
        this.setState({ iconName: 'star-o' }, () => {
          AsyncStorage.setItem('favouriteEvents', JSON.stringify(Global.EnabledEvents));
        });
        alert(SecureFetch.getTranslationText('mbl-EventsUnstarAlert', 'Successfully removed starred event'));
      }
    }
  }

  getLatestEvent() {
    if (Global.data.news.length == 0) {
      let EventsLength = Global.EmptyEvent.length;
      for (let j = 0; j < EventsLength; j++) {
        if (!Global.EnabledEvents.includes(Global.EmptyEvent[j])) {
          Global.EnabledEvents.push(Global.EmptyEvent[j]);
        }
      }
    } else {
      let EventsLength = Global.data.news.length;
      for (let j = 0; j < EventsLength; j++) {
        if (Global.data.news[j].enabled === true) {
          if (!Global.EnabledEvents.includes(Global.data.news[j])) {
            Global.EnabledEvents.push(Global.data.news[j]);
          }
        }
      }
    }
    Global.EnabledEvents.forEach(function (element) {
      element.starred = "false";
    });
    if (Global.EnabledEvents.length > 0) {
      let EventsDates = Global.EnabledEvents.map(n => this.convertDateFormat(n.date, n.timestamp));
      let moments = EventsDates.map(d => moment(d)),
        maxDate = moment.max(moments).format('DD/MM/YYYY hh:mm:ss');
      let dates = [];
      for (let i = 0; i < Global.EnabledEvents.length; i++) {
        dates[i] = Global.EnabledEvents[i].date + " " + Global.EnabledEvents[i].timestamp;
        let result = this.compareDateFormat(dates[i], maxDate);
        if (result === 0) {
          Global.EventKey = i;
        }
      }
    }
  }

  compareDateFormat(dateTimeA, dateTimeB) {
    let momentA = moment(dateTimeA, "DD/MM/YYYY hh:mm:ss");
    let momentB = moment(dateTimeB, "DD/MM/YYYY hh:mm:ss");
    if (momentA > momentB) return 1;
    else if (momentA < momentB) return -1;

    else return 0;
  }

  convertDateFormat(date, timestamp) {
    let d = new Date(date.split("/").reverse().join("-"));

    return (moment(d).format('MM/DD/YYYY') + " " + timestamp);
  }

  handleConnectivityChange = (isConnected) => {
    this.setState({ netInfo: isConnected });
    Global.NetworkInfo = isConnected;
  }

  searchNavigation(value) {
    Global.SearchSourceNavKey = 'HomeScreen';
    this.props.navigation.navigate('Search',
      { sourcePage: 'HomeScreen', data: value })
  }

  openSearchPrompt() {
    this.setState({ visiblePrompt: true });
  }

  openLanguagePage() {
    if (Global.NetworkInfo == true) {
      this.props.navigation.navigate('Language', { sourcePage: 'HomeScreen' });
    } else {
      alert(SecureFetch.getTranslationText('mbl-OfflineTxt', 'You are offline, Please connect to internet'));
    }
  }

  openCartPage() {
    this.props.navigation.navigate('Checkout', { sourcePage: 'HomeScreen' });
  }

  openSocialMedia(platformLink) {
    Linking.openURL(platformLink);
  }

  handleEventNavigation() {
    this.props.navigation.navigate('EventDescription', {
      sourcePage: 'HomeScreen', data: Global.EnabledEvents[Global.EventKey],
      onNavigateBack: this.setStarredIcon.bind(this)
    });
  }

  callMobileNumber = () => {
    if (Global.data.company.secondary_phone == '') {
      Global.data.company.secondary_phone = Global.data.company.phone;
    }

    Linking.openURL(`tel:` + Global.data.company.secondary_phone);
  }

  onClickShare(shareContent1, shareContent2) {
    Share.share({
      message: shareContent1 + ' \n ' + shareContent2
    })
  }

  setStarredIcon() {
    if (Global.EnabledEvents.length > 0) {
      if (Global.EnabledEvents[Global.EventKey].starred == 'true') {
        this.setState({ iconName: 'star' });
      } else {
        this.setState({ iconName: 'star-o' });
      }
    }
  }

  async newChildSToreData() {
    this.getLatestEvent();
    SecureFetch.getBannerImagesTop();
  }

  render() {
    Global.LanguageCode = this.state.languageCode;
    const Entities = require('html-entities').AllHtmlEntities;
    const entities = new Entities();
    const htmlContent = entities.decode(Global.data.company.description);
    this.state.txtColor = Theme.setColorTheme('TxtColor');
    this.state.font = Theme.setFont();
    this.state.pdtPriceTxtColor = Theme.setColorTheme('PdtPriceTxtColor');
    this.state.titleTxtColor = Theme.setColorTheme('TitleTxtColor');
    this.state.callIconColor = Theme.setColorTheme('CallIconColor');
    this.state.shareIconColor = Theme.setColorTheme('ShareIconColor');
    this.state.backgroundColor = Theme.setHeaderAndFooterColor('header-backgroundColor');
    this.state.titleColor = Theme.setHeaderAndFooterColor('header-titleColor');
    this.state.searchIconColor = Theme.setColorTheme('SearchIconColor');
    this.state.langIconColor = Theme.setColorTheme('LangIconColor');

    return (
      <View style={styles.mainView}>

        <NavigationEvents
          onDidFocus={this.setStarredIcon.bind(this)}
          onWillFocus={this.newChildSToreData.bind(this)}
        />

        <Prompt
          title={SecureFetch.getTranslationText('mbl-EntrSrchTxt', 'Enter search text')}
          placeholder={SecureFetch.getTranslationText('mbl-SearchPlaceholder', 'Search')}
          isVisible={this.state.visiblePrompt}
          onChangeText={text => { this.setState({ promptValue: text }); }}
          onCancel={() => {
            Global.textSearch = '';
            this.setState({ promptValue: '', visiblePrompt: false, });
          }}
          onSubmit={() => {
            let searchValue = this.state.promptValue.trim();
            if (searchValue == '') {
              alert('Please enter search text ...');
            }
            else {
              this.setState({ visiblePrompt: false, }, () => {
                this.state.promptValue = '';
                Global.textSearch = searchValue;
                this.searchNavigation(searchValue)
              }
              );
            }
          }}
        />

        <Header
          openSearchPrompt={() => this.openSearchPrompt()}
          openLanguagePage={() => this.openLanguagePage()}
          openCartPage={() => this.openCartPage()}
          openDrawer={() => this.openDrawer()}
          navigation={this.props.navigation}
        />

        {/* <TextInput
          multiline
          numberOfLines={4}
          style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={text => onChangeText(text)}
          value={Global.Utag}
          placeholder='Utag'
        />

        <TextInput
          multiline
          style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={text => onChangeText(text)}
          value={Global.ViewCart}
          placeholder='ViewCart'
        />

        <TextInput
          multiline
          style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={text => onChangeText(text)}
          value={Global.Logoff}
          placeholder='Logoff'
        /> */}

        <ScrollView>
          <BannerCarousel bannerImgs={SecureFetch.getBannerImagesTop()} />

          <Text> </Text>

          <View style={styles.iconContainerStyles}>
            {
              Global.data.company.facebook != '' ?
                <TouchableOpacity onPress={() => this.openSocialMedia(Global.data.company.facebook)}>
                  <Icon name='facebook-square' size={26} style={styles.iconstyles} color='#3b5998' />
                </TouchableOpacity> : null
            }
            {
              Global.data.company.twitter != '' ?
                <TouchableOpacity onPress={() => this.openSocialMedia(Global.data.company.twitter)}>
                  <Icon name='twitter-square' size={26} style={styles.iconstyles} color='#1da1f2' />
                </TouchableOpacity> : null
            }
            {
              Global.data.company.pinterest != '' ?
                <TouchableOpacity onPress={() => this.openSocialMedia(Global.data.company.pinterest)}>
                  <Icon name='pinterest-square' size={26} style={styles.iconstyles} color='#c8232c' />
                </TouchableOpacity> : null
            }
            {
              Global.data.company.linkedin != '' ?
                <TouchableOpacity onPress={() => this.openSocialMedia(Global.data.company.linkedin)}>
                  <Icon name='linkedin-square' size={26} style={styles.iconstyles} color='#0e76a8' />
                </TouchableOpacity> : null
            }
            {
              Global.data.company.youtube != '' ?
                <TouchableOpacity onPress={() => this.openSocialMedia(Global.data.company.youtube)}>
                  <Icon name='youtube-play' size={26} style={styles.iconstyles} color='#c4302b' />
                </TouchableOpacity> : null
            }
            {
              Global.data.company.instagram != '' ?
                <TouchableOpacity onPress={() => this.openSocialMedia(Global.data.company.instagram)}>
                  <Image style={{ height: 23, width: 23, marginTop: '20%' }} source={require('../../assets/images/instagramLogo.png')} />
                </TouchableOpacity> : null
            }
          </View>
          {
            Global.data.news.length > 0 && Global.EnabledEvents.length > 0 ?
              <View>
                <Card style={[styles.row, { borderColor: this.state.titleTxtColor }]} >
                  <TouchableOpacity onPress={() => this.handleEventNavigation()}>
                    <View style={{ flexDirection: 'row', marginTop: '1%', marginBottom: '2%' }}>
                      <View style={{ width: '90%', marginLeft: '2%' }}>
                        <Text style={[styles.text,
                        { color: this.state.titleTxtColor, fontFamily: this.state.font, fontSize: Global.TxtFontSize, fontWeight: 'bold' }]}>
                          {Global.EnabledEvents[Global.EventKey].date}
                        </Text>
                        <Text style={[styles.text,
                        { color: this.state.pdtPriceTxtColor, fontFamily: this.state.font, fontSize: Global.TxtFontSize, fontWeight: 'bold' }]}>
                          {Global.EnabledEvents[Global.EventKey].name}
                        </Text>
                        <Text style={[styles.text,
                        { color: this.state.txtColor, fontFamily: this.state.font, fontSize: Global.TxtFontSize }]}>
                          {Global.EnabledEvents[Global.EventKey].brief}
                        </Text>
                      </View>
                      <View style={styles.forwardIconStyles}>
                        <Icon name='angle-right' size={26} style={{ marginRight: 10 }} color='#795548' />
                      </View>
                    </View>
                  </TouchableOpacity>
                  <View style={styles.eventIconContainerStyles}>

                    <View style={[styles.iconViewStyles, {
                      borderBottomColor: this.state.backgroundColor, borderLeftColor: this.state.backgroundColor
                    }]}>
                      <TouchableOpacity onPress={() => this.callMobileNumber()}>
                        <Icon name='phone' size={23}
                          style={styles.eventIconstyles} color={this.state.callIconColor} />
                      </TouchableOpacity>
                    </View>
                    <View style={[styles.iconViewStyles, { borderLeftWidth: 0.3, borderLeftColor: '#cfd8dc', height: '90%' }]}>
                      <TouchableOpacity onPress={() => this.onClickShare(Global.EnabledEvents[Global.EventKey].brief, Global.EnabledEvents[Global.EventKey].clean_url)}>
                        <Icon name='share-alt' size={23}
                          style={styles.eventIconstyles} color={this.state.shareIconColor} />
                      </TouchableOpacity>
                    </View>
                    <View style={[styles.iconViewStyles, { borderLeftWidth: 0.3, borderLeftColor: '#cfd8dc', height: '90%' }]}>
                      <TouchableOpacity onPress={() => this.onAddtoStarred(Global.EnabledEvents[Global.EventKey])}>
                        <Icon name={this.state.iconName} size={23}
                          style={styles.eventIconstyles} color={this.state.shareIconColor} />
                      </TouchableOpacity>
                    </View>

                  </View>
                </Card>
              </View> : null
          }
          {/* <View style={styles.viewStyles}>
            {htmlContent != '' ?
              <HTMLView
                value={`<div>${htmlContent.replace(/(\r\n|\n|\r)/gm, "")}</div>`}
                stylesheet={{
                  p: { color: this.state.txtColor, fontFamily: this.state.font, fontSize: Global.TxtFontSize },
                  b: { color: this.state.txtColor, fontFamily: this.state.font, fontSize: Global.TxtFontSize },
                  ul: { color: this.state.txtColor, fontFamily: this.state.font, fontSize: Global.TxtFontSize },
                  li: { color: this.state.txtColor, fontFamily: this.state.font, fontSize: Global.TxtFontSize },
                  a: { color: this.state.txtColor, fontFamily: this.state.font, fontSize: Global.TxtFontSize },
                  ol: { color: this.state.txtColor, fontFamily: this.state.font, fontSize: Global.TxtFontSize },
                  i: { color: this.state.txtColor, fontFamily: this.state.font, fontSize: Global.TxtFontSize },
                }}
              /> : null}
          </View> */}
          <AutoHeightWebView
            source={{ html: htmlContent, baseUrl: Config.Basepath }}
          />

          <Text> </Text>

          {
            Global.data.company['google-map'] != '' && Global.NetworkInfo ?
              <WebView
                cacheEnabled={false}
                originWhitelist={['maps://']}
                style={styles.WebViewStyles}
                source={{ html: Global.data.company['google-map'] }} />
              : null
          }
          {/* <Button info onPress={() => this.clearAsync()}><Text>Clear Async Storage</Text></Button> */}
        </ScrollView>
        <View>
          {Global.NetworkInfo ? <Text style={[styles.toastStyles, {
            color: this.state.txtColor,
            fontFamily: this.state.font,
            fontSize: Global.TxtFontSize
          }]} /> : <OnlineCheckerToast />}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  container: {
    marginLeft: 20,
    marginTop: '50%',
  },
  carouselContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center'
  },
  viewStyles: {
    marginLeft: '5%',
    marginRight: '2%',
    width: '93%',
    justifyContent: "center",
    alignItems: "center"
  },
  toastStyles: {
    flexDirection: 'row',
    position: 'absolute',
  },
  WebViewStyles: {
    height: 280,
    width: 560,
    marginBottom: '3%',
  },
  iconContainerStyles: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    marginLeft: '5%',
    marginRight: '5%',
    height: '50%'
  },
  iconstyles: {
    marginLeft: '5%',
    marginRight: '5%',
    marginTop: '5%',
    marginBottom: '5%'
  },
  row: {
    backgroundColor: Config.CardViewColor,
    borderRadius: 5,
    width: '97%',
    marginRight: '3%',
    marginTop: '2%',
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
    borderWidth: 1
  },
  forwardIconStyles: {
    width: '7%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    flexWrap: 'wrap',
  },
  eventIconstyles: {
    marginLeft: '52%',
    marginRight: '20%',
    marginBottom: '7%',
    marginTop: '7%',
  },
  iconViewStyles: {
    flex: 1,
    flexDirection: 'row',
    width: '50%',
    borderTopColor: '#cfd8dc',
    borderTopWidth: 0.3,
  },
  eventIconContainerStyles: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    height: '15%'
  },
  headerTitleStyles: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginRight: '10%',
    flexWrap: 'wrap'
  },
  headerShadowStyles: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    paddingBottom: 1
  }
});