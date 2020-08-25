import React from 'react';
import {
  View, Image, StyleSheet, Text, TextInput, Linking, Dimensions,
  TouchableOpacity, Platform, Modal, Share, ScrollView, AsyncStorage, Picker, Button
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Global from '../Global';
import CountryDetails from '../CountryDetails';
import Config from '../../Config/Config';
import Theme from '../Theme';
import SecureFetch from '../SecureFetch';
import ViewMoreText from 'react-native-view-more-text';
import ModalSelector from 'react-native-modal-selector';
import Carousel from 'react-native-banner-carousel';
import Highlighter from 'react-native-highlight-words';
import Spinner from 'react-native-loading-spinner-overlay';
import { Card } from 'react-native-cards';
import AutoHeightWebView from 'react-native-autoheight-webview';
import { returnStatement } from '@babel/types';
import { connect } from 'react-redux';
import * as countActions from '../../actions/counts';
import { bindActionCreators } from 'redux';
import { withNavigation } from 'react-navigation';
import InputSpinner from 'react-native-input-spinner';
import { configure } from '@react-native-community/netinfo';

let localHtmlForm = '';
var bPath;

class ProductCategoriesTile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      number: '',
      iconName: 'heart-o',
      dataToSend: '',
      modalVisible: false,
      name: null,
      phone: null,
      location: null,
      countryCodeKey: null,
      countryCodeLabel: '',
      profileTypeId: '',
      profileType: '',
      AsyncProfileTypes: null,
      alterImages: [],
      searchText: [],
      spinnerLoading: false,
      txtColor: '',
      titleTxtColor: '',
      pdtPriceTxtColor: '',
      whatsAppIconColor: '',
      shareIconColor: '',
      callIconColor: '',
      wishlistIconColor: '',
      font: '',
      backgroundColor: '',
      activityIndicatorvisible: false,
      badgeCountIndicator: false,
      localBadgeCount: '',
      varietyColor: '',
      disableTouch: false,
      inputSpinnerVisible: false,
      inputSpinnerValue: 1,
      variants: '',
      addedText: SecureFetch.getTranslationText('mbl-AddtoCart', 'Add to Cart'),
      AddedIconColor: Theme.setColorTheme('CallIconColor'),
      CurrencyPrefix: '',
      childBasepath: '',
      productURL: ''
    }
    this.state.searchText = Global.SearchText;
    AsyncStorage.getItem('Name').then(name => this.setState({ name }), () => { });
    AsyncStorage.getItem('Phone').then(phone => this.setState({ phone }), () => { });
    AsyncStorage.getItem('Location').then(location => this.setState({ location }), () => { });
    AsyncStorage.getItem('CountryCde').then(countryCodeKey => this.setState({ countryCodeKey }), () => { });
    AsyncStorage.getItem('ProfileTypes').then(AsyncProfileTypes => this.setState({ AsyncProfileTypes }), () => { });
    AsyncStorage.getItem('ProfileTypeId').then(profileTypeId => this.setState({ profileTypeId }), () => { });
    AsyncStorage.getItem('CurrencyPrefix').then(CurrencyPrefix => this.setState({ CurrencyPrefix }), () => { });
    AsyncStorage.getItem('childBasepath').then(childBasepath => this.setState({ childBasepath }), () => { });

    this.state.profileType = Global.data.types;
  }

  incrementCount(spinnerCount) {
    let { count, actions } = this.props;
    count = parseInt(count) + parseInt(spinnerCount);
    console.log('count ' + count)
    actions.changeCount(count);
  }

  callMobileNumber = () => {
    if (Global.data.company.secondary_phone == '') {
      Global.data.company.secondary_phone = Global.data.company.phone;
    }

    Linking.openURL(`tel:` + Global.data.company.secondary_phone);
  }

  async checkAsyncData(productDetail) {
    if (this.state.name == null && this.state.phone == null && this.state.location == null &&
      this.state.countryCodeKey == null && this.state.AsyncProfileTypes == null) {

      this.setState({ name: await AsyncStorage.getItem('Name') });
      this.setState({ phone: await AsyncStorage.getItem('Phone') });
      this.setState({ location: await AsyncStorage.getItem('Location') });
      this.setState({ countryCodeKey: await AsyncStorage.getItem('CountryCde') });
      this.setState({ AsyncProfileTypes: await AsyncStorage.getItem('ProfileTypes') });
      this.setState({ profileTypeId: await AsyncStorage.getItem('ProfileTypeId') });

      this.addToWishlist(productDetail);
    } else {
      this.addToWishlist(productDetail);
    }
  }

  addToWishlist = (productDetail) => {
    if (Global.NetworkInfo == true) {
      if (this.state.countryCodeKey == null) {
        this.state.countryCodeKey = Global.DefaultCountryCode;
      }
      if (this.state.name != null && this.state.phone != null && this.state.location != null &&
        this.state.countryCodeKey != null && this.state.AsyncProfileTypes != null) {
        if (this.state.iconName == 'heart') {
          this.setModalVisible(false);
        } else {
          this.submitDetail(productDetail);
        }
      } else {
        this.setState({ spinnerLoading: false });
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
    if (!Global.favouriteProducts.includes(productDetail.productId)) {
      if (Global.NetworkInfo == true) {
        this.setState({ spinnerLoading: true });
        SecureFetch.saveChanges('SaveUserData?', productDetail.productId)
          .then((response) => {
            if (response.status == 200) {
              this.setState({ iconName: 'heart' });
              Global.favouriteProducts.push(productDetail.productId)
              AsyncStorage.setItem('favouriteProducts', JSON.stringify(Global.favouriteProducts));
              this.setModalVisible(false);
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
    else {
      this.setState({ spinnerLoading: false });
    }
  }

  setAsyncData(productDetail) {
    if (this.state.name != null && this.state.phone != null && this.state.location != null && this.state.AsyncProfileTypes != null) {
      AsyncStorage.setItem('Name', this.state.name);
      AsyncStorage.setItem('Phone', this.state.phone);
      AsyncStorage.setItem('Location', this.state.location);
      let contryCde = this.state.countryCodeKey.toString()
      AsyncStorage.setItem('CountryCde', contryCde);
      AsyncStorage.setItem('ProfileTypes', this.state.AsyncProfileTypes);
      var typesId = this.state.profileTypeId.toString();
      AsyncStorage.setItem('ProfileTypeId', typesId);
      this.submitDetail(productDetail);
    } else {
      alert(SecureFetch.getTranslationText('mbl-MandatoryFieldTxt', 'All fields are required'));
    }

  }

  componentDidMount() {
    this.getBannerImages();
  }

  getBannerImages() {
    var bannerImages = this.props.result.thumbnail;
    this.state.alterImages = this.props.result['alt-images'];
    const found = this.state.alterImages.some(el => el === bannerImages);
    if (!found) {
      this.state.alterImages.splice(0, 0, bannerImages);
    }
  }

  renderStickers(stickers) {

    return stickers.map((item) => {

      return (
        <Text style={{
          backgroundColor: '#' + item['back-color']
          , width: '80%'
          , textAlign: 'center'
          , marginBottom: '1%'
          , marginTop: '1%'
          , marginRight: '1%'
          , justifyContent: 'center'
          , flexWrap: 'wrap'
          , color: this.state.txtColor
          , fontSize: Global.TxtFontSize
        }} >
          {item.label}
        </Text>
      );
    });
  }

  onClickShare(shareUrl) {
    Share.share({
      message: decodeURIComponent(shareUrl)
    })
  }

  sendWhatsAppData() {
    if (Global.data.company.whatsapp_phone == '') {
      Global.data.company.whatsapp_phone = Global.data.company.phone;
    }

    var uri = Config.WhatsAppBasePath + "phone=" + Global.data.company.whatsapp_phone + "&text=" + SecureFetch.getTranslationText('mbl-WhatsAppTxt1', 'I am interested in this Product') + " :" + this.state.dataToSend + ". " + SecureFetch.getTranslationText('mbl-WhatsAppTxt2', 'Please call me.') + "&source=&data=#";
    var encode = encodeURI(uri);
    Linking.openURL(encode);
  }

  renderViewMore(onPress) {
    return (
      <Text style={styles.textStyle} onPress={onPress}>{SecureFetch.getTranslationText('mbl-More', 'more')}</Text>
    )
  }
  renderViewLess(onPress) {
    return (
      <Text style={styles.textStyle} onPress={onPress}>{SecureFetch.getTranslationText('mbl-Less', 'less')}</Text>
    )
  }

  renderPage(image, index) {
    return (
      <View key={index}>
        <Image style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
          source={image ? { uri: image } : null}
        />
      </View>
    );
  }

  addToCartWithVariants = (productId, spinnerCount, variants) => {
    let attrString = '';
    let template = 'attribute_values[%attributeID%]=%attributeValue%';
    var variant = '';
    if (this.state.childBasepath) {
      bPath = this.state.childBasepath.includes('https://') ? this.state.childBasepath : 'https://' + this.state.childBasepath
    } else {
      bPath = Config.Basepath;
    }

    if (this.state.variants.length === 0) {
      variant = variants[0].variantAttributes;
    } else {
      variant = variants;
    }
    for (let i = 0; i < variant.length; i++) {
      attrString = attrString + '&' + template.replace('%attributeID%', variant[i].attrId)
        .replace('%attributeValue%', variant[i].attrValue)
    }
    console.log('prodTile with Var..' + bPath + '?target=cart&action=add&product_id=' + productId + '&amount=' + spinnerCount + attrString + '&returnURL=?target=cart')
    this.setState({ activityIndicatorvisible: true });
    this.setState({ productURL: bPath + '?target=cart&action=add&product_id=' + productId + '&amount=' + spinnerCount + attrString + '&returnURL=?target=cart' });
    this.incrementCount(spinnerCount);
    Global.CartProducts.push(productId);
    AsyncStorage.setItem('CartProducts', JSON.stringify(Global.CartProducts));
    this.setState({ addedText: SecureFetch.getTranslationText('mbl-Added', 'Added'), AddedIconColor: Theme.setColorTheme('AddedIconColor') })

    // let attrArr = [];
    // let template = '<input type="hidden" value="%attributeValue%" name="attribute_values[%attributeID%]" />';
    // for (let i = 0; i < this.state.variants.length; i++) {
    //   attrArr.push(template.replace('%attributeValue%', this.state.variants[i].attrValue)
    //     .replace('%attributeID%', this.state.variants[i].attrId));
    // }

    // if (Global.NetworkInfo == true) {
    //   if (productId != '') {
    //     localHtmlForm = Global.VariantsHtmlForm;
    //     localHtmlForm = localHtmlForm.replace('%basepath%', bPath + "?");
    //     localHtmlForm = localHtmlForm.replace('%prodId%', productId);
    //     localHtmlForm = localHtmlForm.replace('%amount%', spinnerCount);
    //     localHtmlForm = localHtmlForm.replace('%attributeValues%', attrArr);
    //     this.setState({ activityIndicatorvisible: true });
    //     this.incrementCount(spinnerCount);
    //     Global.CartProducts.push(productId);
    //     AsyncStorage.setItem('CartProducts', JSON.stringify(Global.CartProducts));
    //     this.setState({ addedText: SecureFetch.getTranslationText('mbl-Added', 'Added'), AddedIconColor: Theme.setColorTheme('AddedIconColor') })
    //   }
    // } else {
    //   alert(SecureFetch.getTranslationText('mbl-OfflineTxt', 'You are offline, Please connect to internet'));
    // }
  }

  addToCart = (productId, spinnerCount) => {
    if (this.state.childBasepath) {
      bPath = this.state.childBasepath.includes('https://') ? this.state.childBasepath : 'https://' + this.state.childBasepath
    } else {
      bPath = Config.Basepath;
    }
    console.log('prodTile w/o Var..' + bPath + '?target=cart&action=add&product_id=' + productId + '&amount=' + spinnerCount + '&returnURL=?target=cart')
    this.setState({ activityIndicatorvisible: true });
    this.setState({ productURL: bPath + '?target=cart&action=add&product_id=' + productId + '&amount=' + spinnerCount + '&returnURL=?target=cart' });
    this.incrementCount(spinnerCount);
    Global.CartProducts.push(productId);
    AsyncStorage.setItem('CartProducts', JSON.stringify(Global.CartProducts));
    this.setState({ addedText: SecureFetch.getTranslationText('mbl-Added', 'Added'), AddedIconColor: Theme.setColorTheme('AddedIconColor') })

    // if (Global.NetworkInfo == true) {
    //   if (productId != '') {
    //     localHtmlForm = Global.HtmlForm;
    //     localHtmlForm = localHtmlForm.replace('%basepath%', bPath + "?");
    //     localHtmlForm = localHtmlForm.replace('%prodId%', productId);
    //     localHtmlForm = localHtmlForm.replace('%amount%', spinnerCount);
    //     this.setState({ activityIndicatorvisible: true });
    //     this.incrementCount(spinnerCount);
    //     Global.CartProducts.push(productId);
    //     AsyncStorage.setItem('CartProducts', JSON.stringify(Global.CartProducts));
    //     this.setState({ addedText: SecureFetch.getTranslationText('mbl-Added', 'Added'), AddedIconColor: Theme.setColorTheme('AddedIconColor') })
    //   }
    // } else {
    //   alert(SecureFetch.getTranslationText('mbl-OfflineTxt', 'You are offline, Please connect to internet'));
    // }
  }


  openInputSpinner = () => {
    this.setState({ inputSpinnerVisible: true })
  }

  changeSpinnerCount(productId, spinnerCount) {
    this.addToCart(productId, spinnerCount);
    this.setState({ inputSpinnerVisible: false, inputSpinnerValue: 1 })
  }

  changeSpinnerCountWithVariants(productId, spinnerCount, variants) {
    if (this.state.variants.length == 0) {
      this.addToCartWithVariants(productId, spinnerCount, variants);
    } else {
      this.addToCartWithVariants(productId, spinnerCount, this.state.variants);
    }
    this.setState({ inputSpinnerVisible: false, inputSpinnerValue: 1 })
  }

  setIconStyles() {
    if (Global.data.company.enable_checkout == 'Yes') {
      return styles.singleIconStyles;
    } else {
      return styles.hiddenAdd2CartStyles;
    }
  }

  render() {
    const Entities = require('html-entities').AllHtmlEntities;
    const entities = new Entities();
    let variantsArr = [];
    const {
      name,
      uniqueId,
      model,
      expectedOn,
      quantity,
      city,
      callForPrice,
      stickers,
      productId,
      price,
      thumbnail,
      url,
      description,
      uom,
      variants,
      variantName
    } = this.props.result;

    this.state.dataToSend = decodeURIComponent(url);
    const { itemWidth } = this.props;

    if (Global.favouriteProducts.includes(this.props.result.productId)) {
      this.state.iconName = 'heart';
    } else {
      this.state.iconName = 'heart-o';
    }

    if (Global.CartProducts.includes(this.props.result.productId)) {
      this.state.addedText = SecureFetch.getTranslationText('mbl-Added', 'Added');
      this.state.AddedIconColor = Theme.setColorTheme('AddedIconColor');
    } else {
      this.state.addedText = SecureFetch.getTranslationText('mbl-AddtoCart', 'Add to Cart');
    }

    var StrippedDescription = entities.decode(description).replace(/(<([^>]+)>)/ig, "");
    var bannerImages = this.props.result.thumbnail;
    this.state.alterImages = this.props.result['alt-images'];
    const found = this.state.alterImages.some(el => el === bannerImages);
    if (!found) {
      this.state.alterImages.splice(0, 0, bannerImages);
    }

    if (this.props.result.hasOwnProperty('variants')) {
      variantsArr = this.props.result.variants;
    }

    var productIcons = Global.data.company.custom1.split(',');

    this.state.backgroundColor = Theme.setColorTheme('HeaderBackgroundColor');
    this.state.whatsAppIconColor = Theme.setColorTheme('WhatsAppIconColor');
    this.state.callIconColor = Theme.setColorTheme('CallIconColor');
    this.state.shareIconColor = Theme.setColorTheme('ShareIconColor');
    this.state.wishlistIconColor = Theme.setColorTheme('WishlistIconColor');
    this.state.titleTxtColor = Theme.setColorTheme('TitleTxtColor');
    this.state.pdtPriceTxtColor = Theme.setColorTheme('PdtPriceTxtColor');
    this.state.txtColor = Theme.setColorTheme('TxtColor');
    this.state.varietyColor = Theme.setColorTheme('VarietyColor');
    this.state.font = Theme.setFont();

    return (
      <View>
        <Spinner
          visible={this.state.spinnerLoading}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle} />

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setModalVisible(!this.state.modalVisible);
          }}>

          <View style={styles.ModalStyles}>

            <ScrollView>
              <View>
                <Text style={[styles.infoText, { fontSize: Global.TxtFontSize, color: this.state.txtColor, fontFamily: this.state.font }]}>
                  {SecureFetch.getTranslationText('mbl-EnterDetailsTxt', 'Please enter the below details')}</Text>
                <View style={styles.FirstInputWrap}>

                  <TextInput style={[styles.NameStyles, {
                    borderBottomColor: '#00000',
                    borderBottomWidth: 1,
                    color: this.state.txtColor,
                    fontFamily: this.state.font,
                    fontSize: Global.TxtFontSize
                  }]}
                    underlineColorAndroid='transparent'
                    placeholder={SecureFetch.getTranslationText('mbl-NameTxt', 'Enter your name')}
                    value={this.state.name}
                    onChangeText={(name) => this.setState({ name })} />

                  <ModalSelector
                    data={this.state.profileType}
                    initValue="Select"
                    onChange={(option) => {
                      this.setState({ profileTypeId: option.key })
                      this.setState({ AsyncProfileTypes: option.label })
                    }} >
                    <TextInput
                      style={[styles.NameStyles, {
                        borderBottomColor: '#00000',
                        borderBottomWidth: 1,
                        color: this.state.txtColor,
                        fontFamily: this.state.font,
                        fontSize: Global.TxtFontSize
                      }]}
                      placeholder={SecureFetch.getTranslationText('mbl-ProfileType', 'Profile Type')}
                      underlineColorAndroid='transparent'
                      value={this.state.AsyncProfileTypes} />
                  </ModalSelector>

                  <View style={{
                    borderBottomColor: '#00000',
                    borderBottomWidth: 1,
                  }}>
                    <Picker mode="dropdown"
                      style={[styles.NameStyles, {
                        color: this.state.txtColor,
                        fontFamily: this.state.font,
                        fontSize: Global.TxtFontSize
                      }]}
                      itemStyle={{ color: '#00000', fontFamily: this.state.font }}
                      selectedValue={this.state.countryCodeKey == null ? Global.DefaultCountryCode
                        : this.state.countryCodeKey}
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
                    color: this.state.txtColor,
                    fontFamily: this.state.font,
                    fontSize: Global.TxtFontSize
                  }]}
                    keyboardType='numeric'
                    maxLength={10}
                    underlineColorAndroid='transparent'
                    value={this.state.phone}
                    placeholder={SecureFetch.getTranslationText('mbl-PhoneTxt', 'Enter your Number')}
                    onChangeText={(phone) => this.setState({ phone })} />

                  <TextInput style={[styles.NameStyles, {
                    borderBottomColor: '#00000',
                    borderBottomWidth: 1,
                    color: this.state.txtColor,
                    fontFamily: this.state.font,
                    fontSize: Global.TxtFontSize
                  }]}
                    keyboardType='numeric'
                    maxLength={6}
                    underlineColorAndroid='transparent'
                    value={this.state.location}
                    placeholder={SecureFetch.getTranslationText('mbl-LocTxt', 'Enter your Pin code')}
                    onChangeText={(location) => this.setState({ location })} />
                </View>
                <View style={styles.row}>
                  <TouchableOpacity onPress={() => { this.setAsyncData(this.props.result) }}>
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

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.inputSpinnerVisible}
          onRequestClose={() => { this.setState({ inputSpinnerVisible: false, inputSpinnerValue: 1 }) }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity onPress={() => { this.setState({ inputSpinnerVisible: false, inputSpinnerValue: 1 }) }}
                style={{ position: 'absolute', right: 30, top: 10, }} >
                <Icon name='close' size={35} color='grey' />
              </TouchableOpacity>

              <Text style={{ fontSize: 18 }}>
                {variantName}
              </Text>
              {
                this.props.result.hasOwnProperty('variants') ?
                  <View style={styles.inputSpinnerStyles}>
                    <Picker
                      selectedValue={this.state.variants}
                      onValueChange={(itemValue, itemIndex) => {
                        this.setState({ variants: itemValue });
                      }}>
                      {
                        variants.map(variant => (
                          <Picker.Item
                            label={variant.variantValue + ' - ' + Global.CurrencyPrefix + ' ' + variant.variantPrice.toFixed(2)}
                            value={variant.variantAttributes}
                          />
                        ))
                      }
                    </Picker>
                  </View>
                  : null
              }
              <InputSpinner
                max={10}
                min={1}
                step={1}
                colorMax={'#f04048'}
                colorMin={'#40c5f4'}
                value={this.state.inputSpinnerValue}
                onChange={(inputSpinnerValue) => this.setState({ inputSpinnerValue })}
              />
              <View style={{ marginTop: '15%', height: '15%', width: '80%' }}>
                {
                  this.props.result.hasOwnProperty('variants') ?
                    <Button
                      title={SecureFetch.getTranslationText('mbl-AddtoCart', 'Add to Cart')}
                      color={Config.ButtonColor}
                      onPress={() => { this.changeSpinnerCountWithVariants(productId, this.state.inputSpinnerValue, variants) }}
                    /> :
                    <Button
                      title={SecureFetch.getTranslationText('mbl-AddtoCart', 'Add to Cart')}
                      color={Config.ButtonColor}
                      onPress={() => { this.changeSpinnerCount(productId, this.state.inputSpinnerValue) }}
                    />
                }

              </View>
            </View>
          </View>
        </Modal>
        {
          this.state.activityIndicatorvisible ?
            <AutoHeightWebView
              style={{ height: 0, width: 0 }}
              source={{ uri: this.state.productURL }}
              onError={event => { alert(event.nativeEvent.data); }}
              onLoadEnd={e => { this.setState({ activityIndicatorvisible: false }) }}
            /> :
            null
        }

        <Card style={styles.cardLayoutStyles}>
          <View style={{ flexDirection: 'row', marginTop: 1 }}>
            <View style={styles.imageStyle}>
              <View style={styles.thumbnailStyle}>
                <Carousel
                  showsPageIndicator={false}
                  autoplay
                  autoplayTimeout={4000}
                  loop
                  index={0}
                  pageSize={100}>
                  {this.state.alterImages.map((image, index) => this.renderPage(image, index))}
                </Carousel>
              </View>
              {/* <View>
                    <Text style={[styles.moreTextStyles, {color : this.state.txtColor, fontFamily: this.state.font}]}>{SecureFetch.getTranslationText('mbl-More', 'more')}</Text>
                  </View> */}
              {/* {this.renderStickers(stickers)} */}
            </View>

            <View style={{ width: '54%' }}>
              <View style={styles.headerContentStyle}>
                {/* <Text style={[styles.prodNameStyle, {color : this.state.txtColor, fontFamily: this.state.font}]}>
                      {entities.decode(name)}
                    </Text> */}
                <Highlighter
                  highlightStyle={{ backgroundColor: 'yellow' }}
                  searchWords={this.state.searchText}
                  textToHighlight={entities.decode(name)}
                  style={[styles.prodNameStyle,
                  { color: this.state.titleTxtColor, fontFamily: this.state.font, fontSize: Global.TxtFontSize }]} />

                {
                  entities.decode(model.value) != '' ?
                    <Highlighter
                      highlightStyle={{ backgroundColor: 'yellow' }}
                      searchWords={this.state.searchText}
                      textToHighlight={entities.decode(model.value)}
                      style={[styles.descriptionStyles,
                      { color: this.state.varietyColor, fontFamily: this.state.font, fontSize: Global.TxtFontSize, fontWeight: 'bold' }]} />
                    : null
                }

                {/* <Text style={[styles.descriptionStyles, { color: this.state.txtColor, fontFamily: this.state.font }]}>
                      {entities.decode(uniqueId.label)} : {entities.decode(uniqueId.value)}
                    </Text> */}
                {
                  price.value == 0 ?
                    <Text style={[styles.descriptionStyles,
                    { color: this.state.txtColor, fontFamily: this.state.font, fontSize: Global.TxtFontSize }]}>
                      {/* {entities.decode(price.label)} :  */}
                      {SecureFetch.getTranslationText('mbl-CallForPrice', 'Call for Price')}
                    </Text> :
                    <Text style={[styles.priceDescriptionStyles, {
                      color: this.state.pdtPriceTxtColor, fontFamily: this.state.font, fontSize: Global.TxtFontSize
                    }]}>
                      {/* {entities.decode(price.label)} : */}
                      {this.state.CurrencyPrefix} {price.value.toFixed(2)} / {uom.value}
                    </Text>
                }
                {/* <Text style={[styles.descriptionStyles, { color: this.state.txtColor, fontFamily: this.state.font }]}>
                      {entities.decode(expectedOn.label)} : {entities.decode(expectedOn.value)}
                    </Text> */}
                {/* <Text style={[styles.descriptionStyles, { color: this.state.txtColor, fontFamily: this.state.font, fontSize: Global.TxtFontSize }]}>
                      {entities.decode(quantity.label)} : {quantity.value} {entities.decode(uom.value)}
                    </Text> */}
                {/* <Text style={[styles.descriptionStyles, { color: this.state.txtColor, fontFamily: this.state.font }]}>
                      {entities.decode(city.label)} : {entities.decode(city.value)}
                    </Text> */}
                <ViewMoreText
                  numberOfLines={2}
                  renderViewMore={this.renderViewMore}
                  renderViewLess={this.renderViewLess}>
                  <Highlighter
                    highlightStyle={{ backgroundColor: 'yellow' }}
                    searchWords={this.state.searchText}
                    textToHighlight={StrippedDescription}
                    style={[styles.descriptionStyles,
                    { color: this.state.txtColor, fontFamily: this.state.font }]} />
                </ViewMoreText>
              </View>
            </View>
          </View>
          <Text> </Text>

          <View style={styles.iconContainer}>
            {
              productIcons.includes('whatsapp') ?
                <View style={this.setIconStyles()}>
                  <TouchableOpacity onPress={() => this.sendWhatsAppData()}>
                    <Icon name='whatsapp' size={23} color={this.state.whatsAppIconColor} />
                  </TouchableOpacity>
                </View> :
                <View style={this.setIconStyles()} />
            }
            {
              productIcons.includes('phone') ?
                <View style={this.setIconStyles()}>
                  <TouchableOpacity onPress={() => this.callMobileNumber()}>
                    <Icon name='phone' size={23} color={this.state.callIconColor} />
                  </TouchableOpacity>
                </View> :
                <View style={this.setIconStyles()} />
            }
            {
              productIcons.includes('wishlist') ?
                <View style={this.setIconStyles()}>
                  <TouchableOpacity onPress={() => this.checkAsyncData(this.props.result)}
                    disabled={this.state.disableTouch}>
                    <Icon name={this.state.iconName} size={23} color={this.state.wishlistIconColor} />
                  </TouchableOpacity>
                </View> :
                <View style={this.setIconStyles()} />
            }
            {
              productIcons.includes('share') ?
                <View style={this.setIconStyles()}>
                  <TouchableOpacity onPress={() => this.onClickShare(entities.decode(url))}>
                    <Icon name='share-alt' size={23} color={this.state.shareIconColor} />
                  </TouchableOpacity>
                </View> :
                <View style={this.setIconStyles()} />
            }
            {
              price.value == 0 && Global.data.company.enable_checkout == 'Yes' ?
                <TouchableOpacity style={{ width: '32%' }} onPress={() => this.callMobileNumber()}>
                  <View style={[styles.addToCart, { backgroundColor: this.state.callIconColor || Config.CallIconColor }]}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>
                      {SecureFetch.getTranslationText('mbl-CallForPrice', 'Call for Price')}
                    </Text>
                  </View>
                </TouchableOpacity>
                :
                Global.data.company.enable_checkout == 'Yes' ?
                  quantity.value != 0 ?
                    <TouchableOpacity style={{ width: '32%' }} onPress={() => this.openInputSpinner()}>
                      <View style={[styles.addToCart, { backgroundColor: this.state.AddedIconColor || Config.CallIconColor }]}>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>
                          {this.state.addedText}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity style={{ width: '32%' }} disabled={true} >
                      <View style={[styles.addToCart, { backgroundColor: '#C0C0C0' }]}>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>
                          {SecureFetch.getTranslationText('mbl-OutOfStock', 'Out of Stock')}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  :
                  null
            }
          </View>
        </Card>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  count: state.count.count,
});

const ActionCreators = Object.assign(
  {},
  countActions,
);
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(ProductCategoriesTile));

const styles = StyleSheet.create({
  CategoryStyle: {
    paddingBottom: 3,
  },
  iconBackStyle: {
    justifyContent: 'center',
    marginLeft: '8%',
    width: '12%'
  },
  imageStyle: {
    alignItems: 'center',
    width: '41%',
    marginLeft: '0.5%',
    marginTop: '0.5%',
    marginRight: '0.5%'
  },
  thumbnailStyle: {
    height: 100,
    width: 100,
    resizeMode: 'contain'
  },
  containerStyle: {
    flex: 1,
    borderBottomWidth: 1,
    padding: 5,
    paddingBottom: '4%',
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    borderColor: '#ddd',
    position: 'relative',
  },
  headerContentStyle: {
    paddingRight: '2%',
    flexDirection: 'column',
  },
  prodNameStyle: {
    marginBottom: '2%',
    fontWeight: 'bold',
    fontSize: 18,
  },
  descriptionStyles: {
    fontSize: 16,
    flexWrap: 'wrap',
  },
  priceDescriptionStyles: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingRight: '2%',
    flexWrap: 'wrap',
  },
  callBtnstyles: {
    marginRight: '12%',
    marginBottom: '1%'
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
  row: {
    flex: 1,
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'center',
  },
  FirstInputWrap: {
    flex: 1,
    width: '90%',
    borderColor: "#cccccc",
    marginLeft: '5%',
    marginRight: '3%',
  },
  NameStyles: {
    paddingTop: '3%',
    paddingBottom: 7,
  },
  submitStyle: {
    marginTop: '20%',
    marginRight: '20%',
    marginLeft: '5%',
    marginBottom: '20%',
    color: Config.ModalSubmitColor,
    fontWeight: 'bold',
    fontSize: 20,
  },
  cancelStyle: {
    color: Config.ModalCancelColor,
    fontWeight: 'bold',
  },
  textStyle: {
    color: 'blue',
    fontSize: 16,
  },
  spinnerTextStyle: {
    color: '#FFFFFF',
  },
  moreTextStyles: {
    color: 'blue',
    textDecorationLine: 'underline'
  },
  cardLayoutStyles: {
    backgroundColor: Config.CardViewColor,
    borderRadius: 5,
    width: '96%',
    marginLeft: '2%',
    marginRight: '2%',
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
  onePickerItem: {
    height: 44,
    color: 'red'
  },
  iconContainer: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#cfd8dc',
  },
  singleIconStyles: {
    width: '17%',
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  hiddenAdd2CartStyles: {
    width: '25%',
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  addToCart: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '90%'
  },
  inputSpinnerStyles: {
    width: '95%',
    height: '15%',
    marginBottom: '15%',
    marginTop: '5%',
    borderWidth: 1,
    borderColor: 'black',
    alignContent: 'center',
    justifyContent: 'center'
  }
});