import React, { Component } from 'react';
import {
  View, Text, FlatList, BackHandler, StyleSheet, Image,
  TouchableOpacity, AsyncStorage, ScrollView
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Config from '../../Config/Config';
import ProductTile from '../Vehicle/ProductTile';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Global from '../Global';
import OnlineCheckerToast from '../OflineSection/OnlineCheckerToast';
import SearchDescription from '../Search/SearchDescription';
import SecureFetch from '../SecureFetch';
import ProductCategories from '../../screens/Vehicle/ProductCategories';
import Prompt from 'react-native-prompt-crossplatform';
import Spinner from 'react-native-loading-spinner-overlay';
import { NavigationEvents } from 'react-navigation';
import Header from '../../components/Header';
import Icon from 'react-native-vector-icons/FontAwesome';
import Theme from '../Theme';
import Checkout from '../More/Checkout';
import BannerCarousel from '../../components/BannerCarousel';
import ChildCategory from '../More/ChildCategory';

export default class AllProduct extends React.Component {
  static navigationOptions = { header: null }
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      result: [],
      refreshing: false,
      deviceName: '',
      sourcePage: '',
      parentId: '',
      searchStatus: false,
      netInfo: null,
      searchKey: '',
      footerColor: '',
      backgroundColor: '',
      titleColor: '',
      footerTitleColor: '',
      spinnerLoading: true,
      titleColor: '',
      searchIconColor: '',
      font: '',
      visiblePrompt: false,
      promptValue: '',
      availableText: ''
    };
    this.arrayholder = [];
    this.fetchProducts = this.fetchProducts.bind(this);
    this.getProducts = this.getProducts.bind(this);
  }

  componentDidMount() {
    setTimeout(() => { this.setState({ spinnerLoading: false }) }, 2000);
    NetInfo.fetch().then(isConnected => {
      this.setState({ netInfo: isConnected });
    });
    NetInfo.addEventListener(state => { this.handleConnectivityChange(state.isConnected) });
    this.handleRefresh();
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton = () => {
    this.props.navigation.navigate('ChildCategory');
    return true;
  }

  handleConnectivityChange = (isConnected) => {
    this.setState({ netInfo: isConnected });
    Global.NetworkInfo = isConnected;
    this.handleRefresh();
  }

  async handleRefresh() {
    await SecureFetch.getItem('favouriteProducts');
    await SecureFetch.getCartProducts();
    this.setState({ refreshing: true }, () => this.fetchProducts())
  }

  fetchProducts() {
    this.getProducts()
      .then(result => this.setState({ result, refreshing: false }), () => {
        if (this.state.result.length == 0) {
          this.setState({ spinnerLoading: false, availableText: SecureFetch.getTranslationText('mbl-ProductsAvailability', 'No products available') })
        }
      })
      .catch(() => this.setState({ refreshing: false }));
  }

  async getProducts() {
    let result = [];
    result = Global.data.products;

    return result;
  }

  handleNavigation(item, index) {
    Global.FlatListIndex = index;
    Global.SearchProduct = 'AllProduct';
    Global.SearchSourceNavKey = 'AllProduct';
    this.props.navigation.navigate('SearchDescription', {
      sourcePage: 'AllProduct', data: item, wishlisted: Global.favouriteProducts.includes(item.productId)
    });
  }

  searchBarRefresh() {
    if (this.state.searchKey == '') {
      this.handleRefresh();
    } else {
      this.state.refreshing = false;
    }
  }

  searchNavigation(value) {
    Global.SearchSourceNavKey = 'AllProduct';
    this.props.navigation.navigate('Search',
      { sourcePage: 'AllProduct', data: value })
  }

  openSearchPrompt() {
    this.setState({ visiblePrompt: true });
  }

  openLanguagePage() {
    if (Global.NetworkInfo == true) {
      this.props.navigation.navigate('Language', { sourcePage: 'AllProduct' });
    } else {
      alert(SecureFetch.getTranslationText('mbl-OfflineTxt', 'You are offline, Please connect to internet'));
    }
  }

  openCartPage() {
    this.props.navigation.navigate('Checkout', { sourcePage: 'AllProduct' });
  }

  render() {
    const Entities = require('html-entities').AllHtmlEntities;
    const entities = new Entities();
    this.state.titleColor = Theme.setHeaderAndFooterColor('header-titleColor');
    this.state.searchIconColor = Theme.setColorTheme('SearchIconColor');
    this.state.font = Theme.setFont();
    this.state.backgroundColor = Theme.setHeaderAndFooterColor('header-backgroundColor');

    return (
      <View style={styles.MainView}>

        <Spinner
          visible={this.state.spinnerLoading}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle} />

        <NavigationEvents
          onWillFocus={() => this.handleRefresh()}
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

        <Header
          openSearchPrompt={() => this.openSearchPrompt()}
          openLanguagePage={() => this.openLanguagePage()}
          openCartPage={() => this.openCartPage()}
          openDrawer={() => this.openDrawer()}
          navigation={this.props.navigation}
        />

        <ScrollView>
          {
            Global.data.company.apptheme == 'ECOMMERCE' ?
              <BannerCarousel bannerImgs={SecureFetch.getBannerImagesTop()} /> :
              null
          }
          {
            this.state.result != '' ?
              <FlatList
                style={styles.flatListStyles}
                data={this.state.result}
                renderItem={({ item, index }) => {
                  return (
                    <View>
                      <TouchableOpacity onPress={() => this.handleNavigation(item, index)}>
                        <ProductTile result={item} />
                      </TouchableOpacity>
                    </View>
                  )
                }}
                refreshing={this.state.refreshing}
                onRefresh={this.searchBarRefresh.bind(this)}
              /> :
              <View>
                <Text style={{ color: 'gray', fontSize: 21, textAlign: 'center', marginTop: '10%' }} >
                  {this.state.availableText}
                </Text>
              </View>
          }
        </ScrollView>

        <View>
          {Global.NetworkInfo ? <Text style={styles.toastStyles} /> : <OnlineCheckerToast />}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  MainView: {
    flex: 1,
  },
  TitleStyles: {
    justifyContent: 'center',
    width: '80%'
  },
  flatListStyles: {
    flex: 1,
  },
  spinnerTextStyle: {
    color: '#FFFFFF',
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