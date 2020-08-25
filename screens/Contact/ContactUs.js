import React, { Component } from 'react';
import {
  Text, View, StyleSheet, Image, ScrollView, Linking,
  TouchableOpacity, BackHandler, Share, Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import Config from '../../Config/Config';
import Global from '../Global';
import MoreScreen from '../More/MoreScreen';
import SecureFetch from '../SecureFetch';
import Theme from '../Theme';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import BannerCarousel from '../../components/BannerCarousel';
import { Badge } from 'react-native-elements';
import { Header, Button, Left, Body, Title, Right } from 'native-base';

const BannerWidth = Dimensions.get('window').width;
const BannerHeight = 260;

const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();

export default class ContactUs extends Component {
  static navigationOptions = { header: null, };
  constructor(props) {
    super(props);
    this.state = {
      backgroundColor: '',
      titleColor: '',
      footerColor: '',
      footerTitleColor: '',
      bannerImages: [],
      backIconColor: '',
      whatsAppIconColor: '',
      callIconColor: '',
      shareIconColor: '',
      txtColor: '',
      font: '',
      searchIconColor: ''
    }
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.handleNavigation(); // works best when the goBack is async

      return true;
    });
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  handleNavigation() {
    this.props.navigation.goBack();
  }

  callMobileNumber = () => {
    if (Global.data.company.secondary_phone == '') {
      Global.data.company.secondary_phone = Global.data.company.phone;
    }

    Linking.openURL(`tel:` + Global.data.company.secondary_phone);
  }

  onClickShare() {
    let shareMobileNumber = '';
    if (Global.data.company.secondary_phone != '') {
      shareMobileNumber = Global.data.company.secondary_phone;
    } else {
      shareMobileNumber = Global.data.company.phone
    }
    Share.share({
      message: SecureFetch.getTranslationText('mbl-CompanyName', 'Company Name')
        + ': ' + entities.decode(Global.data.company.name) + ', ' + SecureFetch.getTranslationText('mbl-ContactNumber', 'Contact Number')
        + ': ' + shareMobileNumber + ', ' + SecureFetch.getTranslationText('mbl-Email', 'Email')
        + ': ' + Global.data.company.email,
    })
  }

  sendWhatsAppData() {
    if (Global.data.company.whatsapp_phone == '') {
      Global.data.company.whatsapp_phone = Global.data.company.phone;
    }

    var uri = Config.WhatsAppBasePath + "phone=" + Global.data.company.whatsapp_phone + "&text=&source=&data=#";
    var encode = encodeURI(uri);
    Linking.openURL(encode);
  }

  openSocialMedia(platformLink) {
    Linking.openURL(platformLink);
  }

  render() {
    this.state.backgroundColor = Theme.setHeaderAndFooterColor('header-backgroundColor');
    this.state.titleColor = Theme.setHeaderAndFooterColor('header-titleColor');
    this.state.footerColor = Theme.setHeaderAndFooterColor('footer-color');
    this.state.footerTitleColor = Theme.setHeaderAndFooterColor('footer-titleColor');
    this.state.backIconColor = Theme.setColorTheme('BackIconColor');
    this.state.whatsAppIconColor = Theme.setColorTheme('WhatsAppIconColor');
    this.state.callIconColor = Theme.setColorTheme('CallIconColor');
    this.state.shareIconColor = Theme.setColorTheme('ShareIconColor');
    this.state.txtColor = Theme.setColorTheme('TxtColor');
    this.state.font = Theme.setFont();
    this.state.searchIconColor = Theme.setColorTheme('SearchIconColor');

    return (
      <View style={styles.mainView}>
        <View style={styles.headerShadowStyles}>
          <Header style={{ backgroundColor: this.state.backgroundColor, height: 75, paddingTop: 20 }}>
            <Left>
              <Button transparent onPress={() => this.props.navigation.openDrawer()}>
                <Icon name="navicon" size={22} color={this.state.searchIconColor} />
              </Button>
            </Left>
            <Body>
              <Text
                style={[styles.headerTitleStyles, { color: this.state.titleColor, fontFamily: this.state.font }]}>
                {entities.decode(Global.data.company.name)} </Text>
            </Body>
          </Header>
        </View>

        <ScrollView>
          <BannerCarousel bannerImgs={SecureFetch.getBannerImagesTop()} />

          <Text> </Text>

          <View style={{ marginBottom: '5%', marginLeft: '3%' }}>
            <Text>
              <Text style={[styles.labelStyles, { fontSize: Global.TxtFontSize, color: this.state.txtColor, fontFamily: this.state.font }]}>
                {SecureFetch.getTranslationText('mbl-Phone', 'Phone')}: </Text>
              <Text style={[styles.descriptionStyles, { fontSize: Global.TxtFontSize, color: this.state.txtColor, fontFamily: this.state.font }]}>
                {Global.data.company.secondary_phone != '' ? Global.data.company.secondary_phone : Global.data.company.phone}</Text>
            </Text>

            {/* <Text>
              <Text style={[styles.labelStyles, { fontSize: Global.TxtFontSize, color: this.state.txtColor, fontFamily: this.state.font }]}
                onPress={() => Linking.openURL(decodeURIComponent(Global.data.company.homePage))}>
                {SecureFetch.getTranslationText('mbl-HomePage', 'My Homepage')}: </Text>
              <Text style={[styles.descriptionStyles, { fontSize: Global.TxtFontSize, color: this.state.txtColor, fontFamily: this.state.font }]}>
                {decodeURIComponent(Global.data.company.homePage)} </Text>
            </Text> */}

            {
              Global.data.company.location != '' ?
                <Text>
                  <Text style={[styles.labelStyles, { fontSize: Global.TxtFontSize, color: this.state.txtColor, fontFamily: this.state.font }]}>
                    {SecureFetch.getTranslationText('mbl-Location', 'Location')}: </Text>
                  <Text style={[styles.descriptionStyles, { fontSize: Global.TxtFontSize, color: this.state.txtColor, fontFamily: this.state.font }]}>
                    {Global.data.company.location}
                  </Text>
                </Text> : null
            }
            {
              Global.data.company.city != '' ?
                <Text>
                  <Text style={[styles.labelStyles, { fontSize: Global.TxtFontSize, color: this.state.txtColor, fontFamily: this.state.font }]}>
                    {SecureFetch.getTranslationText('mbl-City', 'City')}: </Text>
                  <Text style={[styles.descriptionStyles, { fontSize: Global.TxtFontSize, color: this.state.txtColor, fontFamily: this.state.font }]}>
                    {Global.data.company.city} </Text>
                </Text> : null
            }
            {
              Global.data.company.state != '' ?
                <Text>
                  <Text style={[styles.labelStyles, { fontSize: Global.TxtFontSize, ontSize: Global.TxtFontSize, color: this.state.txtColor, fontFamily: this.state.font }]}>
                    {SecureFetch.getTranslationText('mbl-State', 'State')}: </Text>
                  <Text style={[styles.descriptionStyles, { fontSize: Global.TxtFontSize, color: this.state.txtColor, fontFamily: this.state.font }]}>
                    {Global.data.company.state} </Text>
                </Text> : null
            }
            {
              Global.data.company.email != '' ?
                <Text>
                  <Text style={[styles.labelStyles, { fontSize: Global.TxtFontSize, color: this.state.txtColor, fontFamily: this.state.font }]}>
                    {SecureFetch.getTranslationText('mbl-Email', 'Email')}: </Text>
                  <Text style={[styles.descriptionStyles, { fontSize: Global.TxtFontSize, color: this.state.txtColor, fontFamily: this.state.font }]}>
                    {Global.data.company.email} </Text>
                </Text> : null
            }
          </View>

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
                  <Image style={{ height: 23, width: 23, marginTop: '15%' }} source={require('../../assets/images/instagramLogo.png')} />
                </TouchableOpacity> : null
            }

          </View>
          {
            Global.data.company['google-map'] != '' && Global.NetworkInfo ?
              <WebView
                cacheEnabled={false}
                originWhitelist={['maps://']}
                style={styles.WebViewStyles}
                source={{ html: Global.data.company['google-map'] }} />
              : null
          }
        </ScrollView>

        <View style={[styles.viewStyles, { backgroundColor: this.state.footerColor }]}>
          <TouchableOpacity style={styles.iconBackStyle} onPress={() => this.handleNavigation()}>
            <Icon name='chevron-left' size={25} color={this.state.backIconColor} />
            <Text style={[styles.TextStyles, { fontSize: Global.TxtFontSize, color: this.state.footerTitleColor }]}>{SecureFetch.getTranslationText('mbl-Back', 'Back')}</Text>
          </TouchableOpacity>

          <View style={styles.iconHeartstyles}>
            <TouchableOpacity onPress={() => this.sendWhatsAppData()}>
              <Icon name='whatsapp' size={25} color={this.state.whatsAppIconColor} />
            </TouchableOpacity>
          </View>

          <View style={styles.iconHeartstyles}>
            <TouchableOpacity onPress={() => this.callMobileNumber()}>
              <Icon name='phone' size={25} color={this.state.callIconColor} />
            </TouchableOpacity>
          </View>

          <View style={styles.iconHeartstyles}>
            <TouchableOpacity onPress={() => this.onClickShare()}>
              <Icon name='share-alt' size={25} color={this.state.shareIconColor} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  upperTagLine: {
    marginLeft: '5%',
    marginRight: '5%',
    marginTop: '2%',
    fontSize: 18,
    color: '#C51515',
    fontWeight: 'bold',
  },
  container: {
    marginLeft: 20,
    marginTop: '50%',
  },
  descriptionStyles: {
    marginLeft: '4%',
    marginRight: '2%',
    marginTop: '1%',
  },
  SubView: {
    alignSelf: 'baseline',
    justifyContent: 'center',
    width: '100%',
    marginBottom: '2%',
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
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
  },
  iconBackStyle: {
    justifyContent: 'flex-start',
    marginLeft: '5%',
    marginTop: '3%',
    width: '50%',
    flexDirection: 'row'
  },
  TitleStyles: {
    justifyContent: 'center',
    width: '40%'
  },
  viewStyles: {
    position: 'absolute',
    justifyContent: 'center',
    bottom: 0,
    height: hp('7%'),
    flexDirection: 'row',
  },
  TextStyles: {
    fontWeight: 'bold',
    marginLeft: '5%',
  },
  iconHeartstyles: {
    justifyContent: 'center',
    width: '15%'
  },
  carouselContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center'
  },
  labelStyles: {
    marginLeft: '6%',
    marginRight: '2%',
    marginTop: '5%',
    fontWeight: 'bold',
  },
  iconContainerStyles: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    marginLeft: '5%',
    marginRight: '5%',
    marginBottom: '15%',
  },
  iconstyles: {
    marginLeft: '5%',
    marginRight: '5%',
  },
  WebViewStyles: {
    height: 250,
    width: 560,
    marginBottom: '15%',
    marginLeft: '4%',
    marginTop: '4%',
  },
});
