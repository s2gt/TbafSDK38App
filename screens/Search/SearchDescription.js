import React, { Component } from 'react';
import {
  Text, View, StyleSheet, Image, ScrollView, Linking, TouchableOpacity, ActivityIndicator,
  AsyncStorage, Modal, Share, TextInput, Platform, BackHandler, Dimensions, Picker
} from 'react-native';
import { WebView } from 'react-native-webview';
import Config from '../../Config/Config';
import Theme from '../Theme';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Global from '../Global';
import CountryDetails from '../CountryDetails';
import Icon from 'react-native-vector-icons/FontAwesome';
import Prompt from 'react-native-prompt-crossplatform';
import SecureFetch from '../SecureFetch';
import ModalSelector from 'react-native-modal-selector';
import Carousel from 'react-native-banner-carousel';
import HTML from 'react-native-render-html';
import Spinner from 'react-native-loading-spinner-overlay';
import HTMLView from 'react-native-htmlview';
import { Button as ElemetsButton } from 'react-native-elements';
import Header from '../../components/Header';
import Checkout from '../More/Checkout';
import { connect } from 'react-redux';
import * as countActions from '../../actions/counts';
import { bindActionCreators } from 'redux';

const BannerWidth = Dimensions.get('window').width;
const BannerHeight = 260;
let localHtmlForm = '';

class SearchDescription extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      uniqueIdLabel: '',
      uniqueId: '',
      expectedOnLabel: '',
      expectedOn: '',
      callForPrice: '',
      quantityLabel: '',
      quantity: '',
      cityLabel: '',
      city: '',
      sourcePage: '',
      categoryId: '',
      callForPriceValue: '',
      priceValue: '',
      dataToSend: '',
      thumbnail: '',
      url: '',
      modalVisible: false,
      usrName: null,
      usrPhone: null,
      usrLocation: null,
      productId: '',
      iconName: 'heart-o',
      backgroundColor: '',
      TitleTxtColor: '',
      footerColor: '',
      description: '',
      uomValue: '',
      footerTitleColor: '',
      priceLabel: '',
      countryCodeKey: '',
      countryCodeLabel: '',
      parentPage: '',
      modelValue: '',
      modelLable: '',
      videoUrl: '',
      profileType: '',
      AsyncProfileTypes: '',
      profileTypeId: '',
      alterImages: [],
      spinnerLoading: false,
      backIconColor: '',
      whatsAppIconColor: '',
      callIconColor: '',
      wishlistIconColor: '',
      shareIconColor: '',
      txtColor: '',
      pdtPriceTxtColor: '',
      font: '',
      params: '',
      activityIndicatorvisible: false,
      badgeCountIndicator: false,
      localBadgeCount: '',
      searchIconColor: '',
      titleColor: '',
      currentUrl: '',
      visiblePrompt: false,
      promptValue: '',
      disableTouch: false
    }
    AsyncStorage.getItem('Name').then(usrName => this.setState({ usrName }), () => { });
    AsyncStorage.getItem('Phone').then(usrPhone => this.setState({ usrPhone }), () => { });
    AsyncStorage.getItem('Location').then(usrLocation => this.setState({ usrLocation }), () => { });
    AsyncStorage.getItem('CountryCde').then(countryCodeKey => this.setState({ countryCodeKey }), () => { });
    AsyncStorage.getItem('ProfileTypes').then(AsyncProfileTypes => this.setState({ AsyncProfileTypes }), () => { });
    AsyncStorage.getItem('ProfileTypeId').then(profileTypeId => this.setState({ profileTypeId }), () => { });

    this.state.profileType = Global.data.types;
    this.getBannerImages();
    this.onPressInject = this.onPressInject.bind(this);
  }

  onPressInject() {
    this.WEBVIEW_REF.injectJavaScript(
      `var previousCount = -1;
      function postCartCount() {
        var cartCount = document.getElementsByClassName('minicart-items-number')[0].innerText.trim();
          if (previousCount !== cartCount) {
          window.ReactNativeWebView.postMessage(cartCount);
          previousCount = cartCount;
        }
        setTimeout(postCartCount, 3000);
        }
      postCartCount();`
    );
  }

  onChangeCart(cartValue) {
    let { count, actions } = this.props;
    count = cartValue;
    actions.changeCount(count);
  }

  getCurrentProductDetails(params) {
    for (var i = 0; i < Global.data.products.length; i++) {
      if (params.productId == Global.data.products[i].productId) {
        this.state.name = Global.data.products[i].name;
        this.state.uniqueIdLabel = Global.data.products[i].uniqueId.label;
        this.state.uniqueId = Global.data.products[i].uniqueId.value;
        this.state.expectedOnLabel = Global.data.products[i].expectedOn.label;
        this.state.expectedOn = Global.data.products[i].expectedOn.value;
        this.state.callForPrice = Global.data.products[i].callForPrice.label;
        this.state.callForPriceValue = Global.data.products[i].callForPrice.value;
        this.state.quantityLabel = Global.data.products[i].quantity.label;
        this.state.quantity = Global.data.products[i].quantity.value;
        this.state.cityLabel = Global.data.products[i].city.label;
        this.state.city = Global.data.products[i].city.value;
        this.state.productId = Global.data.products[i].productId;
        this.state.categoryId = Global.data.products[i].categoryId;
        this.state.priceValue = Global.data.products[i].price.value;
        this.state.priceLabel = Global.data.products[i].price.label;
        this.state.thumbnail = Global.data.products[i].thumbnail;
        this.state.alterImages = Global.data.products[i]['alt-images'];
        this.state.url = decodeURIComponent(Global.data.products[i].url);
        this.state.description = Global.data.products[i].description;
        this.state.uomValue = Global.data.products[i].uom.value;
        this.state.modelValue = Global.data.products[i].model.value;
        this.state.modelLable = Global.data.products[i].model.label;
        this.state.videoUrl = Global.data.products[i].video;
      }
    }
  }

  getBannerImages() {
    const found = this.state.alterImages.some(el => el === this.state.thumbnail);
    if (!found) {
      this.state.alterImages.splice(0, 0, this.state.thumbnail);
    }
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.handleBackNavigation(); // works best when the goBack is async

      return true;
    });
  }

  componentWillUnmount() {
    clearTimeout(this.timerHandle);
    this.backHandler.remove();
  }

  handleBackNavigation = () => {
    Global.SearchText = [];
    this.props.navigation.navigate(Global.SearchProduct,
      { sourcePage: Global.SearchSourceNavKey, data: Global.SearchKey, tabOption: this.state.params.tabOption });
  }

  callMobileNumber = () => {
    if (Global.data.company.secondary_phone == '') {
      Global.data.company.secondary_phone = Global.data.company.phone;
    }

    Linking.openURL(`tel:` + Global.data.company.secondary_phone);
  }

  onClickShare(shareUrl) {
    Share.share({
      message: decodeURIComponent(shareUrl),
    })
  }

  sendWhatsAppData() {
    if (Global.data.company.whatsapp_phone == '') {
      Global.data.company.whatsapp_phone = Global.data.company.phone;
    }

    var uri = Config.WhatsAppBasePath + "phone=" + Global.data.company.whatsapp_phone + "&text=" + SecureFetch.getTranslationText('mbl-WhatsAppTxt1', 'I am interested in this Product') + ":" + decodeURIComponent(this.state.url) + '. ' + SecureFetch.getTranslationText('mbl-WhatsAppTxt2', 'Please call me') + "&source=&data=#";
    var encode = encodeURI(uri);
    Linking.openURL(encode);
  }

  openSearchPrompt() {
    this.setState({ visiblePrompt: true });
  }

  searchNavigation(value) {
    this.props.navigation.navigate('Search',
      { sourcePage: 'VehicleDescription', data: value })
  }

  addToWishlist = (productDetail) => {
    if (Global.NetworkInfo == true) {
      if (this.state.countryCodeKey == null) {
        this.state.countryCodeKey = Global.DefaultCountryCode;
      }

      if (this.state.usrName != null &&
        this.state.usrPhone != null &&
        this.state.usrLocation != null &&
        this.state.countryCodeKey != null &&
        this.state.AsyncProfileTypes != null) {
        if (this.state.iconName == 'heart') {
          this.setModalVisible(false);
        } else {
          this.submitDetail(productDetail);
        }
      } else {
        this.setModalVisible(true);
      }
    } else {
      alert(SecureFetch.getTranslationText('mbl-OfflineTxt', 'You are offline, Please connect to internet'));
    }
  }

  closeModal = () => {
    this.setModalVisible(false);
  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  submitDetail = (productDetail) => {
    if (this.state.countryCodeKey == null) {
      this.state.countryCodeKey = Global.DefaultCountryCode;
    }
    this.setState({ disableTouch: true });
    if (this.state.usrName != null && this.state.usrPhone != null && this.state.usrLocation != null && this.state.countryCodeKey != null && this.state.AsyncProfileTypes != null) {
      if (!Global.favouriteProducts.includes(productDetail.productId)) {
        if (Global.NetworkInfo == true) {
          this.setState({ spinnerLoading: true });
          SecureFetch.saveChanges('SaveUserData?', productDetail.productId)
            .then((response) => {
              if (response.status == 200) {
                this.setState({ iconName: 'heart' });
                Global.favouriteProducts.push(productDetail.productId)
                AsyncStorage.setItem('favouriteProducts', JSON.stringify(Global.favouriteProducts));
                this.setState({ spinnerLoading: false });
                alert(SecureFetch.getTranslationText('mbl-ProductWishlistAlert', 'Product added to wishlist successfully'));
              }
              else {
                this.setState({ spinnerLoading: false });
                alert(SecureFetch.getTranslationText('mbl-FetchResponseAlert', 'Something went wrong, Please try again later'));
                this.setState({ disableTouch: false });
              }
            });
        }
      }
      AsyncStorage.setItem('Name', this.state.usrName);
      AsyncStorage.setItem('Phone', this.state.usrPhone);
      AsyncStorage.setItem('Location', this.state.usrLocation);
      let contryCde = this.state.countryCodeKey.toString();
      AsyncStorage.setItem('CountryCde', contryCde);
      AsyncStorage.setItem('ProfileTypes', this.state.AsyncProfileTypes);
      var typesId = this.state.profileTypeId.toString();
      AsyncStorage.setItem('ProfileTypeId', typesId);
      this.setModalVisible(false);
    } else {
      alert(SecureFetch.getTranslationText('mbl-MandatoryFieldTxt', 'All feilds are requied'));
    }
  }

  openLanguagePage() {
    if (Global.NetworkInfo == true) {
      if (Global.data.company.display_cats === 'No') {
        this.props.navigation.navigate('Language', { sourcePage: Global.SearchProduct, parentPage: this.state.parentPage });
      } else {
        this.props.navigation.navigate('Language', { sourcePage: 'Search', parentPage: this.state.parentPage });
      }
    } else {
      alert(SecureFetch.getTranslationText('mbl-OfflineTxt', 'You are offline, Please connect to internet'));
    }
  }

  renderPage(image, index) {
    return (
      <View key={index}>
        <Image style={{ width: BannerWidth, height: BannerHeight, resizeMode: 'contain' }} source={image ? { uri: image } : null} />
      </View>
    );
  }

  openCartPage() {
    this.props.navigation.navigate('Checkout', { sourcePage: 'SearchDescription' });
  }

  getWebViewURL(url) {
    var encodeURL = encodeURIComponent(url);
    let hashValue = SecureFetch.getQslc(encodeURL);
    url = url + "&qslc=" + hashValue;

    return url;
  }

  render() {
    this.state.TitleTxtColor = Theme.setColorTheme('TitleTxtColor');
    this.state.footerColor = Theme.setHeaderAndFooterColor('footer-color');
    this.state.footerTitleColor = Theme.setHeaderAndFooterColor('footer-titleColor');
    this.state.backIconColor = Theme.setColorTheme('BackIconColor');
    this.state.whatsAppIconColor = Theme.setColorTheme('WhatsAppIconColor');
    this.state.callIconColor = Theme.setColorTheme('CallIconColor');
    this.state.wishlistIconColor = Theme.setColorTheme('WishlistIconColor');
    this.state.shareIconColor = Theme.setColorTheme('ShareIconColor');
    this.state.txtColor = Theme.setColorTheme('TxtColor');
    this.state.pdtPriceTxtColor = Theme.setColorTheme('PdtPriceTxtColor');
    this.state.font = Theme.setFont();
    this.state.searchIconColor = Theme.setColorTheme('SearchIconColor');
    this.state.backgroundColor = Theme.setHeaderAndFooterColor('header-backgroundColor');
    this.state.titleColor = Theme.setHeaderAndFooterColor('header-titleColor');
    const Entities = require('html-entities').AllHtmlEntities;
    const entities = new Entities();
    const params = this.props.navigation.getParam('data');
    this.state.params = params;
    const wishlisted = this.props.navigation.getParam('wishlisted');

    var productIcons = Global.data.company.custom1.split(',');
    this.state.sourcePage = this.props.navigation.getParam('sourcePage');
    this.state.parentPage = this.props.navigation.getParam('parentPage');
    this.getCurrentProductDetails(params);

    return (
      <View style={styles.mainView}>

        <Spinner
          visible={this.state.spinnerLoading}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />

        <Prompt
          title={SecureFetch.getTranslationText('mbl-EntrSrchTxt', 'Enter search text')}
          placeholder={SecureFetch.getTranslationText('mbl-SearchPlaceholder', 'Search')}
          isVisible={this.state.visiblePrompt}
          onChangeText={text => { this.setState({ promptValue: text }); }}
          onCancel={() => {
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

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible} onRequestClose={() => {
            this.setModalVisible(!this.state.modalVisible);
          }}>
          <View style={styles.ModalStyles}>
            <ScrollView>
              <View>
                <Text style={[styles.infoText, {
                  color: this.state.txtColor,
                  fontFamily: this.state.font,
                  fontSize: Global.TxtFontSize
                }]}>{SecureFetch.getTranslationText('mbl-EnterDetailsTxt', 'Please enter the below details')}</Text>
                <View style={styles.FirstInputWrap}>

                  <TextInput style={[styles.NameStyles, {
                    borderBottomColor: '#00000',
                    borderBottomWidth: 1,
                    fontSize: Global.TxtFontSize,
                    color: this.state.txtColor,
                    fontFamily: this.state.font
                  }]}
                    underlineColorAndroid='transparent'
                    placeholder={SecureFetch.getTranslationText('mbl-NameTxt', 'Enter your name')}
                    value={this.state.usrName}
                    onChangeText={(usrName) => this.setState({ usrName })} />

                  <ModalSelector
                    data={this.state.profileType}
                    initValue="Select"
                    onChange={(option) => {
                      this.setState({ profileTypeId: option.key })
                      this.setState({ AsyncProfileTypes: option.label })
                    }}
                  >
                    <TextInput
                      style={[styles.NameStyles, {
                        borderBottomColor: '#00000',
                        borderBottomWidth: 1,
                        fontSize: Global.TxtFontSize,
                        color: this.state.txtColor,
                        fontFamily: this.state.font
                      }]}
                      placeholder={SecureFetch.getTranslationText('mbl-ProfileType', 'Profile Type')}
                      underlineColorAndroid='transparent'
                      value={this.state.AsyncProfileTypes}
                    />
                  </ModalSelector>

                  <View style={{
                    borderBottomColor: '#00000',
                    borderBottomWidth: 1,
                  }}>
                    <Picker mode="dropdown"
                      style={[styles.NameStyles, {
                        fontSize: Global.TxtFontSize,
                        color: this.state.txtColor,
                        fontFamily: this.state.font
                      }]}
                      itemStyle={{ color: '#00000', fontFamily: this.state.font }}
                      selectedValue={this.state.countryCodeKey == null ? Global.DefaultCountryCode : this.state.countryCodeKey}
                      onValueChange={(countryCodeKey) => this.setState({ countryCodeKey: countryCodeKey })}>
                      {
                        CountryDetails.map((item) => {
                          return (
                            <Picker.Item
                              label={item.name + " (" + item.dial_code + ")"}
                              value={item.dial_code}
                            />
                          );
                        })
                      }
                    </Picker>
                  </View>

                  <TextInput style={[styles.NameStyles, {
                    borderBottomColor: '#00000',
                    borderBottomWidth: 1,
                    fontSize: Global.TxtFontSize,
                    color: this.state.txtColor,
                    fontFamily: this.state.font
                  }]}
                    keyboardType='numeric'
                    maxLength={10}
                    underlineColorAndroid='transparent'
                    value={this.state.usrPhone}
                    placeholder={SecureFetch.getTranslationText('mbl-PhoneTxt', 'Enter your Number')}
                    onChangeText={(usrPhone) => this.setState({ usrPhone })} />

                  <TextInput style={[styles.NameStyles, {
                    borderBottomColor: '#00000',
                    borderBottomWidth: 1,
                    fontSize: Global.TxtFontSize,
                    color: this.state.txtColor,
                    fontFamily: this.state.font
                  }]}
                    keyboardType='numeric'
                    maxLength={6}
                    underlineColorAndroid='transparent'
                    value={this.state.usrLocation}
                    placeholder={SecureFetch.getTranslationText('mbl-LocTxt', 'Enter your Pin code')}
                    onChangeText={(usrLocation) => this.setState({ usrLocation })} />

                </View>

                <View style={styles.row}>
                  <TouchableOpacity onPress={() => { this.submitDetail(this.state.productId) }}>
                    <Text style={[styles.submitStyle, { fontSize: Global.TxtFontSize }]}>
                      {SecureFetch.getTranslationText('mbl-Submit', 'Submit')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { this.closeModal() }}>
                    <Text style={[styles.cancelStyle, { fontSize: Global.TxtFontSize }]}>
                      {SecureFetch.getTranslationText('mbl-Cancel', 'Cancel')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </Modal>

        <Header
          openSearchPrompt={() => this.openSearchPrompt()}
          openLanguagePage={() => this.openLanguagePage()}
          openCartPage={() => this.openCartPage()}
          openDrawer={() => this.openDrawer()}
          navigation={this.props.navigation}
        />

        <WebView
          ref={ref => (this.WEBVIEW_REF = ref)}
          style={{ marginBottom: '10%' }}
          source={{ uri: this.getWebViewURL(this.state.url + '?appview=2') }}
          javaScriptEnabledAndroid={true}
          onMessage={event => { this.onChangeCart(event.nativeEvent.data); }}
          onLoadEnd={e => { this.onPressInject() }}
        />

        <View style={[styles.viewStyles, { backgroundColor: this.state.footerColor }]}>
          <TouchableOpacity style={styles.iconBackStyle} onPress={() => this.handleBackNavigation()}>
            <Icon name='chevron-left' size={25} color={this.state.backIconColor} />
            <Text style={[styles.TextStyles, { fontSize: Global.TxtFontSize, color: this.state.footerTitleColor }]}>{SecureFetch.getTranslationText('mbl-Back', 'Back')}</Text>
          </TouchableOpacity>
          {
            productIcons.includes('whatsapp') ?
              <View style={styles.iconHeartstyles}>
                <TouchableOpacity onPress={() => this.sendWhatsAppData()}>
                  <Icon name='whatsapp' size={25} color={this.state.whatsAppIconColor} />
                </TouchableOpacity>
              </View> :
              <View style={styles.iconHeartstyles} />
          }
          {
            productIcons.includes('phone') ?
              <View style={styles.iconHeartstyles}>
                <TouchableOpacity onPress={() => this.callMobileNumber()}>
                  <Icon name='phone' size={25} color={this.state.callIconColor} />
                </TouchableOpacity>
              </View> :
              <View style={styles.iconHeartstyles} />
          }
          {
            productIcons.includes('wishlist') ?
              <View style={styles.iconHeartstyles}>
                <TouchableOpacity onPress={() => this.addToWishlist(params)}
                  disabled={this.state.disableTouch}>
                  <Icon name={wishlisted ? 'heart' : this.state.iconName} size={25} color={this.state.wishlistIconColor} />
                </TouchableOpacity>
              </View> :
              <View style={styles.iconHeartstyles} />
          }
          {
            productIcons.includes('share') ?
              <View style={styles.iconHeartstyles}>
                <TouchableOpacity onPress={() => this.onClickShare(this.state.url)}>
                  <Icon name='share-alt' size={25} color={this.state.shareIconColor} />
                </TouchableOpacity>
              </View> :
              <View style={styles.iconHeartstyles} />
          }
        </View>

      </View>
    );
  }
}

const mapStateToProps = state => ({
  count: state.count.count
});

const ActionCreators = Object.assign({}, countActions);

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchDescription)

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  upperTagLine: {
    marginLeft: '5%',
    marginRight: '5%',
    marginTop: '2%',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  container: {
    marginLeft: 20,
    marginTop: '50%',
  },
  descriptionStyles: {
    marginLeft: '4%',
    marginRight: '2%',
    marginTop: '2%',
  },
  iconBackStyle: {
    justifyContent: 'flex-start',
    marginLeft: '4%',
    marginTop: '3%',
    width: '48%',
    flexDirection: 'row'
  },
  TitleStyles: {
    justifyContent: 'center',
    width: '25%'
  },
  viewStyles: {
    width: '100%',
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
  SubView: {
    alignSelf: 'baseline',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: '2%'
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
  searchIconStyles: {
    marginTop: '65%',
  },
  iconHeartstyles: {
    justifyContent: 'center',
    width: '13%'
  },
  ModalStyles: {
    backgroundColor: '#F5F5F5',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginRight: '5%',
    marginTop: (Platform.OS === 'ios') ? '8%' : 0,
  },
  infoText: {
    fontWeight: 'bold',
    marginLeft: '5%',
    marginRight: '5%',
    marginTop: '5%',
  },
  FirstInputWrap: {
    flex: 1,
    width: '90%',
    borderColor: "#cccccc",
    marginLeft: '5%',
    marginRight: '3%',
  },
  NameStyles: {
    marginTop: '3%',
    paddingBottom: 7,
  },
  row: {
    flex: 1,
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitStyle: {
    marginTop: '20%',
    marginRight: '20%',
    marginLeft: '5%',
    marginBottom: '20%',
    color: Config.ModalSubmitColor,
    fontWeight: 'bold',
  },
  cancelStyle: {
    color: Config.ModalCancelColor,
    fontWeight: 'bold',
  },
  priceStyles: {
    marginLeft: '4%',
    marginRight: '2%',
    marginTop: '2%',
    fontWeight: 'bold',
  },
  htmlviewStyles: {
    marginLeft: '4%',
    marginRight: '2%',
  },
  spinnerTextStyle: {
    color: '#FFFFFF',
  },
  videoContainer: {
    width: '100%',
    height: 250,
    marginBottom: '2%',
    marginTop: '3%'
  }
});
