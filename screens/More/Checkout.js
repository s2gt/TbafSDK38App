import React, { Component } from 'react';
import { Text, View, BackHandler, StyleSheet, TouchableOpacity, AsyncStorage } from 'react-native';
import Config from '../../Config/Config';
import { WebView } from 'react-native-webview';
import Theme from '../Theme';
import SecureFetch from '../SecureFetch';
import Global from '../Global';
import Prompt from 'react-native-prompt-crossplatform';
import Icon from 'react-native-vector-icons/FontAwesome';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { NavigationEvents } from 'react-navigation';
import Header from '../../components/Header';
import { connect } from 'react-redux';
import * as countActions from '../../actions/counts';
import { bindActionCreators } from 'redux';
import { Notifications } from 'expo';

class Checkout extends Component {
  static navigationOptions = { header: null }
  constructor(props) {
    super(props);
    this.state = {
      currentUrl: '',
      params: '',
      backgroundColor: '',
      titleColor: '',
      searchIconColor: '',
      font: '',
      footerColor: '',
      localBadgeCount: '',
      visiblePrompt: false,
      promptValue: '',
      CurrencyCode: '',
      languageCode: '',
      buyerId: '',
      url: '',
      utag: '',
      childID: '',
      childBasepath: ''
    }
    this.onPressInject = this.onPressInject.bind(this);
    this.handleRefresh();
  }

  async handleRefresh() {
    this.setState({ languageCode: await AsyncStorage.getItem('LanguageCode') });
    this.setState({ CurrencyCode: await AsyncStorage.getItem('CurrencyCode') });
    this.setState({ buyerId: await AsyncStorage.getItem('Bid') });
    this.setState({ utag: await AsyncStorage.getItem('utag') });
    this.setState({ childBasepath: await AsyncStorage.getItem('childBasepath') });
    this.getWebViewURL();
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
    if (this.state.currentUrl.includes('?target=cart')) {
      let { count, actions } = this.props;
      count = cartValue;
      actions.changeCount(count);
    } else if (this.state.currentUrl.includes('?target=checkout')) {
      if (JSON.parse(cartValue).method === 'login') {
        Global.LoginToken = 'login';
        var bUserName = JSON.parse(cartValue).params[0].value;
        var Bid = JSON.parse(cartValue).params[1].value;
        var bEmail = JSON.parse(cartValue).params[2].value;
        var status = JSON.parse(cartValue).params[3].value;
        var role = JSON.parse(cartValue).params[4].value;
        var utag = JSON.parse(cartValue).params[5].value;
        var membership = JSON.parse(cartValue).params[6].value;
        Global.Utag = utag;
        this.CusProfilDataAsyncStorage(Global.LoginToken, Bid, bUserName, bEmail, status, role, utag, membership);
      }
    }
  }

  CusProfilDataAsyncStorage(LoginToken, Bid, bUserName, bEmail, status, role, utag, membership) {
    Global.UserName = bUserName;
    Global.UserPhone = Bid;
    AsyncStorage.setItem('LoginToken', LoginToken);
    AsyncStorage.setItem('Bid', Bid);
    AsyncStorage.setItem('bUserName', bUserName);
    AsyncStorage.setItem('bEmail', bEmail);
    AsyncStorage.setItem('status', status);
    AsyncStorage.setItem('role', role);
    AsyncStorage.setItem('utag', utag);
    AsyncStorage.setItem('membership', membership);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    clearTimeout(this.timerHandle);
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    if (this.state.currentUrl.includes('?target=cart') ||
      this.state.currentUrl.includes('target=checkoutSuccess')) {
      this.props.navigation.goBack();
      this.setState({ url: '' });

      return true;
    } else {
      this.WEBVIEW_REF.goBack();

      return true;
    }
  }

  _onNavigationStateChange(webViewState) {
    const url = webViewState.url
    this.setState({ currentUrl: url });
    if (this.state.currentUrl.includes('target=checkoutSuccess')) {
      let { count, actions } = this.props;
      count = 0;
      actions.changeCount(count);
    }
  }

  openSearchPrompt() {
    this.setState({ visiblePrompt: true });
  }

  searchNavigation(value) {
    Global.SearchSourceNavKey = 'Checkout';
    this.props.navigation.navigate('Search',
      { sourcePage: 'Checkout', data: value })
  }

  openLanguagePage() {
    if (Global.NetworkInfo == true) {
      this.props.navigation.navigate('Language', { sourcePage: 'Checkout' });
    } else {
      alert(SecureFetch.getTranslationText('mbl-OfflineTxt', 'You are offline, Please connect to internet'));
    }
  }

  mySetInitialState() {
    this.setState({ localBadgeCount: Global.BadgeCount })
  }

  async getWebViewURL() {
    let utag;
    if (await AsyncStorage.getItem('utag')) {
      utag = await AsyncStorage.getItem('utag');
    }
    var bPath;
    if (this.state.buyerId == null || Global.LoginToken == '') {
      this.state.buyerId = '';
    } else {
      this.state.buyerId = this.state.buyerId.replace('+', '');
    }
    if (this.state.childBasepath) {
      bPath = this.state.childBasepath.includes('https://') ? this.state.childBasepath : 'https://' + this.state.childBasepath;
    } else {
      bPath = Config.Basepath;
    }
    ts = SecureFetch.getUtc();
    let value = await Notifications.getExpoPushTokenAsync();
    var subStringToken = value.substring(17).replace(/[[\]]/g, '');
    url = 'bid=' + this.state.buyerId + '&language=' + this.state.languageCode + '&ts=' + ts + '&currency_code=' + this.state.CurrencyCode + "&tkn=" + subStringToken;
    var encodeURL = encodeURIComponent(url);
    qslc = SecureFetch.getQslc(encodeURL + utag);
    var finalURL = bPath + '?target=cart&appview=2' + '&' + url + "&qslc=" + qslc;
    console.log('checkout URL ' + finalURL);
    Global.ViewCart = finalURL;
    this.setState({ url: finalURL });

    // return finalURL;
  }

  render() {
    this.state.sourcePage = this.props.navigation.getParam('sourcePage');
    const Entities = require('html-entities').AllHtmlEntities;
    const entities = new Entities();
    this.state.backgroundColor = Theme.setHeaderAndFooterColor('header-backgroundColor');
    this.state.titleColor = Theme.setHeaderAndFooterColor('header-titleColor');
    this.state.searchIconColor = Theme.setColorTheme('SearchIconColor');
    this.state.font = Theme.setFont();
    this.state.footerColor = Theme.setHeaderAndFooterColor('footer-color');
    this.state.footerTitleColor = Theme.setHeaderAndFooterColor('footer-titleColor');

    return (
      <View style={styles.MainView}>
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

        <Header
          openDrawer={() => this.openDrawer()}
          navigation={this.props.navigation}
          pageName={'checkout'}
        />

        <WebView
          cacheEnabled={false}
          style={{ marginBottom: '10%' }}
          source={{ uri: this.state.url }}
          ref={ref => (this.WEBVIEW_REF = ref)}
          onNavigationStateChange={this._onNavigationStateChange.bind(this)}
          javaScriptEnabledAndroid={true}
          onMessage={event => { this.onChangeCart(event.nativeEvent.data); }}
          onLoadEnd={e => { this.onPressInject() }}
          cacheMode={"LOAD_NO_CACHE"}
        />

        <NavigationEvents
          onDidFocus={this.mySetInitialState.bind(this)}
        />

        <View style={[styles.viewStyles, { backgroundColor: this.state.footerColor }]}>
          <TouchableOpacity style={styles.iconBackStyle} onPress={() => this.handleBackPress()}>
            <Icon name='chevron-left' size={25} color={this.state.backIconColor} />
            <Text style={[styles.TextStyles, { fontSize: Global.TxtFontSize, fontFamily: this.state.font, color: this.state.footerTitleColor }]}>{SecureFetch.getTranslationText('mbl-Back', 'Back')}</Text>
          </TouchableOpacity>
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

export default connect(mapStateToProps, mapDispatchToProps)(Checkout)

const styles = StyleSheet.create({
  MainView: {
    flex: 1,
    flexDirection: 'column',
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
  viewStyles: {
    position: 'absolute',
    justifyContent: 'center',
    bottom: 0,
    height: hp('7%'),
    flexDirection: 'row',
  },
  TextStyles: {
    fontWeight: 'bold',
    marginLeft: '4%',
  },
  iconBackStyle: {
    justifyContent: 'flex-start',
    marginLeft: '8%',
    marginTop: '3%',
    width: '100%',
    flexDirection: 'row'
  },
})