import React, { Component } from 'react';
import { AsyncStorage, Alert } from 'react-native';
import Global from './Global';
import Config from '../Config/Config';
import moment from 'moment';
import sha256 from 'crypto-js/sha256';
import sha1 from 'crypto-js/sha1';
import _ from 'lodash';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import base64 from 'react-native-base64';

const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();
export default class SecureFetch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      UpdateStatus: '',
      appData: '',
      deviceToken: ''
    };
    var ts = '';
    var url = '';
    var qslc = '';
  }

  static async getJSON(apiMethod, cid = Config.Cid, basepath = Config.Basepath) {
    this.getDeviceToken();
    let value = await Notifications.getExpoPushTokenAsync();
    Global.Latitude = await AsyncStorage.getItem('Latitude');
    Global.Longitude = await AsyncStorage.getItem('Longitude');
    AsyncStorage.setItem('Device_token', value);
    SecureFetch.getItem('offlineAppData');
    const IfNoneMatch = await AsyncStorage.getItem('IfNoneMatch');
    ts = SecureFetch.getUtc();
    var subStringToken = value.substring(17).replace(/[[\]]/g, '');
    url = "cid=" + cid + "&ts=" + ts + "&lang=" + Global.LanguageCode + "&tkn=" + subStringToken
    var encodeURL = encodeURIComponent(url);
    qslc = SecureFetch.getQslc(encodeURL);
    fetchUrl = "cid=" + cid + "&lang=" + Global.LanguageCode + "&ts=" + ts + "&tkn=" + subStringToken
    var finalURL = basepath + apiMethod + fetchUrl + "&qslc=" + qslc;
    console.log('GetAppInfo..' + finalURL);
    console.log('IfNoneMatch..' + IfNoneMatch);

    return await fetch(finalURL, {
      method: 'POST',
      headers: {
        'If-None-Match': IfNoneMatch,
        'x-loc-lat': Global.Latitude,
        'x-loc-long': Global.Longitude,
        'Accept-Encoding': 'gzip',
      },
      body: JSON.stringify({
      }),
    });
  }

  static async getStoresJSON(apiMethod, cid = Config.Cid, basepath = Config.Basepath) {
    this.getDeviceToken();
    Global.Latitude = await AsyncStorage.getItem('Latitude');
    Global.Longitude = await AsyncStorage.getItem('Longitude');
    let value = await Notifications.getExpoPushTokenAsync();
    AsyncStorage.setItem('Device_token', value);
    ts = SecureFetch.getUtc();
    var subStringToken = value.substring(17).replace(/[[\]]/g, '');
    url = "cid=" + cid + "&ts=" + ts + "&lang=" + Global.LanguageCode + "&tkn=" + subStringToken
    var encodeURL = encodeURIComponent(url);
    qslc = SecureFetch.getQslc(encodeURL);
    fetchUrl = "cid=" + cid + "&lang=" + Global.LanguageCode + "&ts=" + ts + "&tkn=" + subStringToken
    var finalURL = basepath + apiMethod + fetchUrl + "&qslc=" + qslc;
    console.log('StoresGetAppInfo..' + finalURL);
    console.log('StoresGetAppInfo..' + Global.Latitude);

    return await fetch(finalURL, {
      method: 'POST',
      headers: {
        'If-None-Match': null,
        'x-loc-lat': Global.Latitude,
        'x-loc-long': Global.Longitude,
        'Accept-Encoding': 'gzip',
      },
      body: JSON.stringify({
      }),
    });
  }

  static async getLanguageJSON(apiMethod, cid = Config.Cid, basepath = Config.Basepath) {
    this.getDeviceToken();
    let value = await Notifications.getExpoPushTokenAsync();
    AsyncStorage.setItem('Device_token', value);
    SecureFetch.getItem('offlineAppData');
    ts = SecureFetch.getUtc();
    var subStringToken = value.substring(17).replace(/[[\]]/g, '');
    url = "cid=" + cid + "&ts=" + ts + "&tkn=" + subStringToken
    var encodeURL = encodeURIComponent(url);
    qslc = SecureFetch.getQslc(encodeURL);
    fetchUrl = "cid=" + cid + "&ts=" + ts + "&tkn=" + subStringToken
    var finalURL = basepath + apiMethod + fetchUrl + "&qslc=" + qslc;

    return await fetch(finalURL, {
      method: 'POST',
      headers: {
        'Accept-Encoding': 'gzip',
      },
      body: JSON.stringify({
      }),
    });
  }

  static async getDeviceToken() {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = await Notifications.getExpoPushTokenAsync();
    } else {
      alert('Must use physical device for Push Notifications');
    }
  }

  static getUtc = () => {
    const time = Date.now();
    const date = new Date(time);
    const todayUTC = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()))
    const newdate = moment(todayUTC).format('YYYYMMDDHHmmss');

    return newdate;
  }

  static getGMTformat = () => {
    var DATE_RFC2822 = "ddd, DD MMM YYYY HH:mm:ss [GMT]";
    var newdate = moment().lang("en").format(DATE_RFC2822);

    return newdate;
  }

  static getQslc = (url) => {
    const value = url + Config.QSLCSalt
    const hash = sha256(value);

    return hash;
  }

  static async getFavEventsItem(item) {
    try {
      const value = await AsyncStorage.getItem(item)
        .then(val => {
          return JSON.parse(val)
        });
      if (value != null) {
        Global.StarredEvents = value;
      }

      return value
    } catch (err) {
      return null
    }
  }

  static async getCartProducts() {
    try {
      const value = await AsyncStorage.getItem('CartProducts').then(
        (val) => {
          return JSON.parse(val);
        }
      );
      if (value != null) {
        Global.CartProducts = value;
      }

      return value;
    } catch (err) {
      return null;
    }
  }

  static async getItem(item) {
    try {
      const value = await AsyncStorage.getItem(item)
        .then(val => {
          return JSON.parse(val)
        });
      if (value != null) {
        if (item == 'offlineAppData') {
          Global.data = value;
        } else if (item == 'StoreChildData') {
          Global.StoreData = value;
        } else if (item == 'favouriteProducts') {
          Global.favouriteProducts = value;
        }
      }
      return value
    } catch (err) {
      console.log(err);

      return null
    }
  }

  static async getBadgeCount(key) {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        Global.BadgeCount = value;
      }
    } catch (error) {
      return null
    }

    return value
  }

  static getTranslationText(translationID, defaultText) {
    if (entities.decode(Global.data.translations[translationID]) != '') {

      return entities.decode(Global.data.translations[translationID]);
    } else {

      return defaultText;
    }
  }

  static getMenuItems(MenuText, translationText) {
    let rv = false;
    for (let i = 0; i < Global.data.menus.length; i++) {
      if (Global.data.menus[i].itemlink == MenuText) {
        rv = true;
        return Global.data.menus[i].itemname;
      }
    }
    if (rv == false) {
      return SecureFetch.getTranslationText(translationText, '');
    }
  }

  static checkMenuItems(MenuText) {
    let rv = false;
    for (let i = 0; i < Global.data.menus.length; i++) {
      if (Global.data.menus[i].itemlink == MenuText) {
        return true;
      }
    }
  }


  static sendFeedBack = (name, phone, feedbackSubject, feedbackContent) => {
    var feedBackUrl = Global.data.company.contactus != ''
      ? Global.data.company.contactus
      + '?action=send&returnURL=%2F%3Ftarget%3Dadvanced_contact_us'
      + '&field-id-1=' + name + '&field-id-5=' + phone + '&field-id-3=' + feedbackSubject + '&field-id-4=' + feedbackContent
      + '&field-id-2=' + '&field-id-6='
      :
      Config.FeedBackUrl + '&field-id-1=' + name + '&field-id-5=' + phone
      + '&field-id-3=' + feedbackSubject + '&field-id-4=' + feedbackContent + '&field-id-2=' + '&field-id-6=';

    fetch(feedBackUrl);
  }

  static async saveChanges(apiMethod, productId) {
    this.getDeviceToken();
    let value = await Notifications.getExpoPushTokenAsync();
    AsyncStorage.setItem('Device_token', value);

    const Name = await AsyncStorage.getItem('Name');
    const UserPhoneNo = await AsyncStorage.getItem('Phone');
    var CountryCde = await AsyncStorage.getItem('CountryCde');
    const UserLoc = await AsyncStorage.getItem('Location');
    const UserLangCode = await AsyncStorage.getItem('LanguageCode');
    const ProfileTypesId = await AsyncStorage.getItem('ProfileTypeId');
    const ProfileTypes = await AsyncStorage.getItem('ProfileTypes');
    var ValidateCntryCde = CountryCde == null ? Global.DefaultCountryCode : CountryCde;
    ValidateCntryCde = ValidateCntryCde.replace(/ +/g, "").replace('+', '');
    var UserName = base64.encode(Name);
    ts = SecureFetch.getUtc();
    var subStringToken = value.substring(17).replace(/[[\]]/g, '');

    fetchUrl = "b64fullname=" + UserName
      + "&phone=" + ValidateCntryCde + '' + UserPhoneNo
      + "&postal=" + UserLoc
      + "&productid=" + productId
      + "&cid=" + Config.Cid
      + "&lang=" + UserLangCode
      + "&ts=" + ts
      + "&tkn=" + subStringToken
      + "&referer=" + decodeURIComponent(Global.data.company.homePage)
      + "&types=" + ProfileTypesId
    var encodeURL = encodeURIComponent(fetchUrl);
    qslc = SecureFetch.getQslc(encodeURL);
    var bPath = Config.Basepath.includes('https://') ? Config.Basepath : 'https://' + Config.Basepath;
    var FinalUrl = bPath + '/' + apiMethod + fetchUrl + "&qslc=" + qslc;

    return await fetch(FinalUrl, {});
  }

  static async SetFondSize(LanguageCode) {
    Global.TxtFontSize = Config.TxtFontSize;
    Global.TxtTittleFontSize = Config.TxtTittleFontSize;

    if (LanguageCode === 'ta') {
      Global.TxtFontSize = Config.TamilTxtFontSize;
      Global.TxtTittleFontSize = Config.TamilTxtTittleFontSize;
    }
  }

  static async getLogoutURL(apimethod, buyerId, languageCode, currencyCode, basepath) {
    if (buyerId == null) {
      buyerId = '';
    } else {
      buyerId = buyerId.replace('+', '');
    }

    if (basepath) {
      bPath = basepath.includes('https://') ? basepath : 'https://' + basepath;
    } else {
      bPath = Config.Basepath;
    }

    ts = SecureFetch.getUtc();
    url = 'bid=' + buyerId + '&language=' + languageCode + '&ts=' + ts + '&currency_code=' + currencyCode;
    var encodeURL = encodeURIComponent(url);
    qslc = SecureFetch.getQslc(encodeURL);
    var finalURL = bPath + apimethod + '&' + url + "&qslc=" + qslc;
    console.log('logoff..' + finalURL);

    return finalURL;
  }

  static getBannerImagesTop() {
    let bannerCarouselImgs = []
    let bannerlength = Global.data['mobile-banners'].length;
    let homeBannerCheckTop = false;
    let homeBannerTopData = [];
    for (let i = 0; i < bannerlength; i++) {
      if (Global.data['mobile-banners'][i].location == 'WideTop' && Global.data['mobile-banners'][i].page == 'Home'
        && Global.data['mobile-banners'][i].enabled == true) {
        homeBannerCheckTop = true;
        homeBannerTopData.push(Global.data['mobile-banners'][i]['banner-image']);
        if (Global.data['mobile-banners'][i]['alt-images'].length > 0) {
          homeBannerTopData = homeBannerTopData.concat(Global.data['mobile-banners'][i]['alt-images']);
          // homeBannerTopData = homeBannerTopData.splice([i], 0, Global.data['mobile-banners'][i]['alt-images']);
        }
      }
    }
    if (homeBannerCheckTop === true) {
      bannerCarouselImgs = homeBannerTopData;
    } else {
      let bannerImages = Global.data.company['banner-image'];
      bannerCarouselImgs = Global.data.company['alt-images'];
      const found = bannerCarouselImgs.some(el => el === bannerImages);
      if (!found) {
        bannerCarouselImgs.splice(0, 0, bannerImages);
      }
    }

    if (Global.NetworkInfo) {
      return bannerCarouselImgs;
    } else {
      return bannerImages;
    }
  }

  static getWebViewURL(apimethod, buyerId, languageCode, currencyCode, basepath, utag) {
    if (buyerId == null) {
      buyerId = '';
    } else {
      buyerId = buyerId.replace('+', '');
    }

    if (basepath) {
      bPath = basepath.includes('https://') ? basepath : 'https://' + basepath;
    } else {
      bPath = Config.Basepath;
    }

    ts = SecureFetch.getUtc();
    url = 'bid=' + buyerId + '&language=' + languageCode + '&ts=' + ts + '&currency_code=' + currencyCode;
    var encodeURL = encodeURIComponent(url);
    qslc = SecureFetch.getQslc(encodeURL + utag);
    var finalURL = bPath + apimethod + '&' + url + "&qslc=" + qslc;
    console.log('customerProfile..' + finalURL);

    return finalURL;
  }
}