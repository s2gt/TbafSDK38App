import React, { Component } from 'react';
import {
  View, Text, FlatList, ActivityIndicator, StyleSheet,
  Image, TouchableOpacity, AsyncStorage, BackHandler
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { NavigationEvents } from 'react-navigation';
import { SearchBar } from 'react-native-elements';
import Config from '../../Config/Config';
import Theme from '../Theme';
import SubCategory from './SubCategory';
import HomeScreen from '../Home/HomeScreen';
import ProductTile from './ProductTile';
import Description from './Description';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import Global from '../Global';
import OnlineCheckerToast from '../OflineSection/OnlineCheckerToast';
import Prompt from 'react-native-prompt-crossplatform';
import SecureFetch from '../SecureFetch';
import Spinner from 'react-native-loading-spinner-overlay';
import Header from '../../components/Header';
import Checkout from '../More/Checkout';
import ProductCategories from './ProductCategories';

export default class Product extends React.Component {
  static navigationOptions = { header: null }
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      result: [],
      refreshing: true,
      deviceName: '',
      sourcePage: '',
      parentId: '',
      searchStatus: false,
      netInfo: null,
      productStatus: false,
      backgroundColor: '',
      titleColor: '',
      footerColor: '',
      footerTitleColor: '',
      spinnerLoading: true,
      footerColor: '',
      footerTitleColor: '',
      backIconColor: '',
      font: '',
      txtColor: '',
      searchIconColor: '',
      visiblePrompt: false,
      promptValue: '',
      cateId: '',
      Category_Name: '',
      availableText: '',
      wishlistText: ''
    };
    this.fetchProducts = this.fetchProducts.bind(this);
    this.getProducts = this.getProducts.bind(this);
    this.handleRefresh();
    this.arrayholder = [];
    this.state.sourcePage = this.props.navigation.getParam('sourcePage');
  }

  componentDidMount() {
    this.state.Category_Name = Global.ProductData.name;
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    setTimeout(() => { this.setState({ spinnerLoading: false }) }, 2000);
    // SecureFetch.getItem('favouriteProducts');
    if (this.state.sourcePage == 'SubCategory') {
      this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        this.handleBackNavigation(); // works best when the goBack is async

        return true;
      });
    }
    NetInfo.fetch().then(isConnected => {
      this.setState({ netInfo: isConnected });
    });
    NetInfo.addEventListener(state => { this.handleConnectivityChange(state.isConnected) });
    const { params } = this.props.navigation.state;
    if (params != null && params.sourcePage == 'SubCategory') {
      this.setState({ parentId: Global.Product_PrentId }, () => {
        this.handleRefresh();
      })
    } else {
      this.handleRefresh();
    }
  }

  componentDidUpdate() {
    if (this.state.Category_Name != Global.ProductData.name) {
      this.state.Category_Name = Global.ProductData.name;
      this.handleRefresh();
    }
    if (Global.Wishlist_Load != '') {
      Global.Wishlist_Load = '';
      this.handleRefresh();
    }
  }

  handleConnectivityChange = (isConnected) => {
    this.setState({ netInfo: isConnected });
    Global.NetworkInfo = isConnected;
    this.handleRefresh();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    if (this.state.sourcePage == 'SubCategory') {
      this.backHandler.remove();
    }
  }

  handleBackPress = () => {
    //this.props.navigation.navigate('HomeScreen');
    this.props.navigation.goBack();
  }

  async handleRefresh() {
    await SecureFetch.getItem('favouriteProducts');
    await SecureFetch.getCartProducts();
    this.setState({ refreshing: true }, () => this.fetchProducts())
  }

  fetchProducts() {
    this.getProducts()
      .then(result => this.setState({ result, refreshing: false }, () => {
        if (this.state.result.length == 0) {
          this.setState({ spinnerLoading: false, availableText: SecureFetch.getTranslationText('mbl-ProductsAvailability', 'No products available') })
        }
      }))
      .catch(() => this.setState({ refreshing: false }));
  }

  async getProducts() {
    let result = [];
    const params = Global.ProductData;
    if (this.state.sourcePage == 'SubCategory') {
      var j = 0;
      for (var i = 0; i < (Global.data.products).length; i++) {
        if (Global.ProductData.categoryId == Global.data.products[i].categoryId) {
          this.arrayholder[j] = Global.data.products[i];
          result[j] = Global.data.products[i];
          j++;
          this.state.productStatus = true;
        }
      }
      Global.SearchProduct = 'Products';
      Global.SearchSourceNavKey = 'SubCategory';
    } else {
      var n = 0;
      for (var i = 0; i < (Global.data.products).length; i++) {
        for (var j = 0; j < (Global.favouriteProducts).length; j++) {
          if (Global.favouriteProducts[j] == Global.data.products[i].productId) {
            this.arrayholder[n] = Global.data.products[i];
            result[n] = Global.data.products[i];
            n++;
          }
        }
      }

      Global.SearchProduct = 'Wishlist';
      Global.SearchSourceNavKey = 'Wishlist';
      if (n == 0) {
        this.setState({ spinnerLoading: false, wishlistText: SecureFetch.getTranslationText('mbl-ProductsWishlistAvailability', 'You have not added any product to your wishlist. Please add and come back to see your products added here. ') })
      }
    }
    return result;
  }

  searchFilterFunction = (text) => {
    const newData = this.arrayholder.filter(item => {
      const itemData = `${item.meta_keywords.toUpperCase()} ${item.meta_keywords.toUpperCase()} ${item.meta_keywords.toUpperCase()}`;
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      result: newData,
    });
  };

  handleNavigation(item, index) {
    //Global.FlatListIndex = index;
    if (this.state.sourcePage == 'SubCategory') {
      this.props.navigation.navigate('Description', {
        sourcePage: 'Products', data: item
        , wishlisted: Global.favouriteProducts.includes(item.productId)
      });
    } else {
      this.props.navigation.navigate('Description', {
        sourcePage: 'Products', data: item
        , wishlisted: Global.favouriteProducts.includes(item.productId)
      });
    }
  }

  handleBackNavigation() {
    if (this.state.sourcePage == 'SubCategory') {
      var categoriesLength = Global.Categories.length;
      if (categoriesLength == 0) {
        this.props.navigation.navigate('ProductCategories');
      } else {
        let categoryId = Global.Categories[categoriesLength - 1].categoryId;
        Global.Categories.splice(-1, 1);
        Global.CategoryName.splice(-1, 1);
        this.props.navigation.navigate('SubCategory', { sourcePage: 'Products', data: categoryId });
      }
    }
    else {
      this.props.navigation.navigate('HomeScreen');
    }
  }

  showSearchbar = () => {
    if (this.state.searchStatus == true) {
      this.setState({ searchStatus: false })
    } else {
      this.setState({ searchStatus: true })
    }
  }

  openSearchPrompt() {
    this.setState({ visiblePrompt: true });
  }

  searchNavigation(value) {
    if (this.state.sourcePage == 'SubCategory') {
      Global.SearchSourceNavKey = 'ProductCategories';
      Global.CategoryName = [];
    }
    this.props.navigation.navigate('Search',
      { sourcePage: 'SubCategory', data: value })
  }

  openLanguagePage() {
    if (Global.NetworkInfo == true) {
      this.state.sourcePage == 'SubCategory' ?
        this.props.navigation.navigate('Language', { sourcePage: 'ProductCategories' }) :
        this.props.navigation.navigate('Language', { sourcePage: 'Products' });
    } else {
      alert(SecureFetch.getTranslationText('mbl-OfflineTxt', 'You are offline, Please connect to internet'));
    }
  }

  getItemLayout = (data, index) => (
    { length: 160, offset: 160 * index, index }
  );

  openCartPage() {
    this.state.sourcePage == 'SubCategory' ?
      this.props.navigation.navigate('Checkout', { sourcePage: 'ProductCategories' }) :
      this.props.navigation.navigate('Checkout', { sourcePage: 'Products' });
  }

  render() {
    this.state.footerColor = Theme.setHeaderAndFooterColor('footer-color');
    this.state.footerTitleColor = Theme.setHeaderAndFooterColor('footer-titleColor');
    this.state.backIconColor = Theme.setColorTheme('BackIconColor');
    this.state.font = Theme.setFont();
    this.state.txtColor = Theme.setColorTheme('TxtColor');
    const Entities = require('html-entities').AllHtmlEntities;
    const entities = new Entities();
    this.state.sourcePage = this.props.navigation.getParam('sourcePage');
    this.state.titleColor = Theme.setHeaderAndFooterColor('header-titleColor');
    this.state.backgroundColor = Theme.setHeaderAndFooterColor('header-backgroundColor');
    this.state.searchIconColor = Theme.setColorTheme('SearchIconColor');

    const ProductsWishlistAvailability = () => {
      return (
        <View style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Text style={{ color: this.state.txtColor, fontSize: Global.TxtFontSize, textAlign: 'center', fontFamily: this.state.font }} >
            {this.state.wishlistText}
          </Text>
        </View>
      );
    }

    const ProductsAvailability = () => {
      return (
        <View style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Text style={{ color: this.state.txtColor, fontSize: Global.TxtFontSize, textAlign: 'center', fontFamily: this.state.font }} >
            {this.state.availableText}
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.MainView}>

        <Spinner
          visible={this.state.spinnerLoading}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle} />

        <NavigationEvents
          onDidFocus={() => this.handleRefresh()}
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

        {
          this.state.productStatus || this.state.result.length > 0 ?
            null : this.state.sourcePage == 'SubCategory' ? <ProductsAvailability /> : <ProductsWishlistAvailability />
        }
        {this.state.searchStatus ?
          <SearchBar
            placeholder="Type Here..."
            lightTheme
            value
            onChangeText={text => this.searchFilterFunction(text)}
            autoCorrect={false} /> : null}
        {
          this.state.sourcePage == 'SubCategory' ?
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
              onRefresh={this.handleRefresh.bind(this)}
              keyExtractor={item => item.name}
            /> :
            <FlatList
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
              onRefresh={this.handleRefresh.bind(this)}
            />
        }
        <View>
          {Global.NetworkInfo ? <Text style={styles.toastStyles} /> : <OnlineCheckerToast />}
        </View>
        {
          this.state.sourcePage == 'SubCategory' ?
            <View>
              <View style={[styles.viewStyles, { backgroundColor: this.state.footerColor }]}>
                <TouchableOpacity style={styles.iconBackStyle} onPress={() => this.handleBackNavigation()}>
                  <Icon name='chevron-left' size={25} color={this.state.backIconColor} />
                  <Text style={[styles.TextStyles, { fontFamily: this.state.font, color: this.state.footerTitleColor, fontFamily: this.state.font }]}>{Global.ProductData.name}</Text>
                </TouchableOpacity>
              </View>
            </View> : <View></View>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  MainView: {
    flex: 1,
    flexDirection: 'column',
    bottom: '0%'
  },
  iconBackStyle: {
    justifyContent: 'flex-start',
    marginLeft: '8%',
    marginTop: '3%',
    width: '100%',
    flexDirection: 'row'
  },
  TitleStyles: {
    justifyContent: 'center',
    width: '80%'
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
  SubView: {
    alignSelf: 'baseline',
    flexDirection: "row",
    justifyContent: 'center',
    marginBottom: '2%',
  },
  searchIconStyles: {
    marginTop: '65%',
  },
  flatListStyles: {
    flex: 1,
    marginBottom: '12%'
  },
  offlineContainer: {
    backgroundColor: '#757575',
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '70%',
    marginLeft: '15%',
    marginRight: '15%',
    position: 'absolute',
    bottom: '0%',
    borderRadius: 10
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
