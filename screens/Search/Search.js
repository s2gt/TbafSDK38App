import * as React from 'react';
import { Text, View, StyleSheet, FlatList, BackHandler, TouchableOpacity, AsyncStorage, TextInput } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { SearchBar, Input } from 'react-native-elements';
import Global from '../Global';
import AllSearchTile from './AllSearchTile';
import Config from '../../Config/Config';
import Theme from '../Theme';
import ProductTile from '../Vehicle/ProductTile';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import OnlineCheckerToast from '../OflineSection/OnlineCheckerToast';
import SearchDescription from '../Search/SearchDescription';
import Products from '../Vehicle/Products';
import SecureFetch from '../SecureFetch';
import Spinner from 'react-native-loading-spinner-overlay';
import Icon from 'react-native-vector-icons/FontAwesome';
import StaticPageDescription from '../More/StaticPageDescription';
import OthersSearchDescription from './OthersSearchDescription';
import Header from '../../components/Header';
import Checkout from '../More/Checkout';
import { Badge } from 'react-native-elements';

export default class Search extends React.Component {
  static navigationOptions = { header: null, };
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      search: '',
      option: 'products',
      searchText: '',
      allJson: [],
      result: [],
      tabAllColorChange: '#bdbdbd',
      tabProductsColorChange: '#bdbdbd',
      tabOthersColorChange: '#bdbdbd',
      tabDefaultColor: '#bdbdbd',
      sourcePage: '',
      tabNavigation: 'products',
      searchKey: '',
      spinnerLoading: true,
      netInfo: null,
      searchStatus: false,
      searchIconColor: ''
    };

    this.arrayholder = [];
    this.state.sourcePage = this.props.navigation.getParam('sourcePage');
    const { params } = this.props.navigation.state;
    if (params.tabOption != null) {
      this.state.tabNavigation = params.tabOption;
    }
  }

  componentDidUpdate() {
    if (Global.textSearch != '') {
      if (this.state.search != Global.textSearch) {
        this.state.search = Global.textSearch;
        this.SearchFilterFunction(this.state.search);
        Global.textSearch = '';
      }
    }
  }

  componentDidMount() {
    this.setState({ isLoading: false });

    setInterval(() => { this.setState({ spinnerLoading: false }) }, 2000);
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.handleBackNavigation(); // works best when the goBack is async
      return true;
    });

    NetInfo.fetch().then(isConnected => {
      this.setState({ netInfo: isConnected });
    });
    NetInfo.addEventListener(state => { this.handleConnectivityChange(state.isConnected) });
    const { params } = this.props.navigation.state;
    this.setState({ search: params.data }, () => {
      this.handleRefresh();
      this.setState({ searchStatus: true }, () => {
      })
    })
    this.handleTabOption(this.state.tabNavigation);
  }

  async handleRefresh() {
    await SecureFetch.getCartProducts();
    this.state.allJson = [];
    let sresult = [];
    for (var prop in Global.data.static_pages) {
      if (Object.prototype.hasOwnProperty.call(Global.data.static_pages, prop)) {
        var spage = prop;
        sresult.push(Global.data.static_pages[spage])
        this.state.result = sresult;
      }
    }

    for (let j = 0; j < this.state.result.length; j++) {
      this.state.allJson.push(this.state.result[j]);
    }

    for (let i = 0; i < Global.data.products.length; i++) {
      this.state.allJson.push(Global.data.products[i]);
    }

    for (let k = 0; k < Global.EnabledEvents.length; k++) {
      this.state.allJson.push(Global.EnabledEvents[k]);
      this.state.result.push(Global.EnabledEvents[k]);
    }
  }

  handleConnectivityChange = (isConnected) => {
    this.setState({ netInfo: isConnected });
    Global.NetworkInfo = isConnected;
    this.handleRefresh();
  }

  componentWillUnmount() {
    AsyncStorage.setItem('favouriteProducts', JSON.stringify(Global.favouriteProducts));
    this.backHandler.remove();
  }

  SearchFilterFunction(text) {
    let newData = '';
    this.setState({ search: text });
    Global.SearchText[0] = text;
    Global.SearchKey = text;
    if (this.state.option == 'products') {
      newData = this.arrayholder.filter(item => {
        const itemData = `${item.meta_keywords.toUpperCase()} 
                          ${item.name.toUpperCase()}
                          ${item.model.value.toUpperCase()}
                          ${item.description.toUpperCase()}`;
        const textData = text.toUpperCase();
        this.state.isLoading = true;

        return itemData.indexOf(textData) > -1;
      });
    } else {
      newData = this.arrayholder.filter(function (item) {
        const itemData = `${item.name.toUpperCase()}`;
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
    }

    this.setState({
      dataSource: newData,
      search: text,
    });
  }

  ListViewItemSeparator = () => {
    return (
      <View style={{ height: 1, width: '90%', backgroundColor: '#080808', }} />
    );
  };

  async handleTabOption(opt) {
    this.setState({ option: opt });
    if (opt == 'all') {
      this.state.tabAllColorChange = '#e0e0e0';
      this.state.tabOthersColorChange = this.state.tabDefaultColor;
      this.state.tabProductsColorChange = this.state.tabDefaultColor;
    } else if (opt == 'others') {
      this.state.tabOthersColorChange = '#e0e0e0';
      this.state.tabAllColorChange = this.state.tabDefaultColor;
      this.state.tabProductsColorChange = this.state.tabDefaultColor;
    } else {
      this.state.tabProductsColorChange = '#e0e0e0';
      this.state.tabOthersColorChange = this.state.tabDefaultColor;
      this.state.tabAllColorChange = this.state.tabDefaultColor;
    }

    await this.setState({
      isLoading: false,
      dataSource: opt == 'all' ?
        this.state.allJson :
        opt == 'products' ?
          Global.data.products :
          opt == 'others' ?
            this.state.result : null,
    },
      function () {
        this.arrayholder = opt == 'all' ?
          this.state.allJson :
          opt == 'products' ?
            Global.data.products :
            opt == 'others' ?
              this.state.result : null
      }
    );

    if (this.state.search != '') {
      this.SearchFilterFunction(this.state.search);
    }
  };

  handleBackNavigation() {
    Global.textSearch = '';
    this.clearSearchBar()
    Global.SearchKey = '';
    Global.SearchText = [];
    if (Global.SearchSourceNavKey == 'Wishlist') {
      this.props.navigation.navigate('Products', { sourcePage: 'Search' });
    } else {
      this.props.navigation.navigate(Global.SearchSourceNavKey, { sourcePage: 'Search' });
    }
  }

  handleNavigation(item, index) {
    Global.SearchProduct = 'Search';
    this.props.navigation.navigate('SearchDescription', {
      sourcePage: 'Search'
      , parentPage: this.state.sourcePage, data: item, tabOption: this.state.option
    });
  }

  handleOtherNavigation(item, index) {
    if (item.productId != null) {
      Global.SearchProduct = 'Search';
      this.props.navigation.navigate('SearchDescription', {
        sourcePage: 'Search'
        , parentPage: this.state.sourcePage, data: item, tabOption: this.state.option
      });
    } else {
      Global.SearchProduct = 'Search';
      this.props.navigation.navigate('OthersSearchDescription', {
        sourcePage: 'Search'
        , parentPage: this.state.sourcePage, data: item, tabOption: this.state.option
      });
    }
  }

  openCartPage() {
    this.props.navigation.navigate('Checkout', { sourcePage: 'Search' });
  }

  openLanguagePage() {
    if (Global.NetworkInfo == true) {
      this.props.navigation.navigate('Language', { sourcePage: 'Search' });
    } else {
      alert(SecureFetch.getTranslationText('mbl-OfflineTxt', 'You are offline, Please connect to internet'));
    }
  }

  clearSearchBar() {
    this.textInput.clear();
    this.SearchFilterFunction('')
  }

  render() {
    this.state.backgroundColor = Theme.setHeaderAndFooterColor('header-backgroundColor');
    this.state.titleColor = Theme.setHeaderAndFooterColor('header-titleColor');
    this.state.footerColor = Theme.setHeaderAndFooterColor('footer-color');
    this.state.footerTitleColor = Theme.setHeaderAndFooterColor('footer-titleColor');
    this.state.font = Theme.setFont();
    this.state.backIconColor = Theme.setColorTheme('BackIconColor');
    this.state.searchIconColor = Theme.setColorTheme('SearchIconColor');
    const Entities = require('html-entities').AllHtmlEntities;
    const entities = new Entities();

    return (
      <View style={styles.MainView}>

        <Spinner
          visible={this.state.spinnerLoading}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle} />

        <Header
          openSearchPrompt={() => this.openSearchPrompt()}
          openLanguagePage={() => this.openLanguagePage()}
          openCartPage={() => this.openCartPage()}
          openDrawer={() => this.openDrawer()}
          navigation={this.props.navigation}
          pageName={'Search'}
        />

        <View style={styles.searchContainerStyles}>
          <View style={{ width: '89%' }}>
            <TextInput
              ref={ref => { this.textInput = ref; }}
              placeholder="Search here for products"
              clearButtonMode="always"
              onChangeText={text => this.SearchFilterFunction(text)}
              onContentSizeChange={text => this.SearchFilterFunction(this.state.search)}
              value={this.state.search}
              style={styles.searchTextBoxStyles}
            />
          </View>
          <TouchableOpacity style={styles.removeIconStyles} onPress={() => this.clearSearchBar()} underlayColor='transparent'>
            <View>
              <Icon name="remove" size={20} color="#9e9e9e" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', width: '100%', height: '7%' }}>
          <TouchableOpacity onPress={() => this.handleTabOption('all')}
            style={{ width: '33.33%', backgroundColor: this.state.tabAllColorChange, alignItems: 'center', justifyContent: 'center' }}>
            <Text> All </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.handleTabOption('products')}
            style={{ width: '33.33%', backgroundColor: this.state.tabProductsColorChange, alignItems: 'center', justifyContent: 'center' }}>
            <Text> {SecureFetch.getMenuItems('products.html', 'mbl-Products')} </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.handleTabOption('others')}
            style={{ width: '33.33%', backgroundColor: this.state.tabOthersColorChange, alignItems: 'center', justifyContent: 'center' }}>
            <Text> Others </Text>
          </TouchableOpacity>
        </View>

        {
          this.state.dataSource != '' ?
            <FlatList
              style={styles.flatListStyles}
              data={this.state.dataSource}
              renderItem={({ item, index }) => {
                return (
                  <View>
                    {
                      this.state.option == 'products' ?
                        <TouchableOpacity onPress={() => this.handleNavigation(item, index)}>
                          <ProductTile result={item} />
                        </TouchableOpacity>
                        :
                        <TouchableOpacity onPress={() => this.handleOtherNavigation(item, index)}>
                          <AllSearchTile result={item} />
                        </TouchableOpacity>
                    }
                  </View>
                )
              }}
              enableEmptySections={true}
            /> :
            <View style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Text style={{ color: 'gray', fontSize: 21, justifyContent: "center", alignItems: "center" }} >
                {SecureFetch.getTranslationText('mbl-NoResultsFound', 'No results found')}
              </Text>
            </View>
        }

        <View>
          {Global.NetworkInfo ? <Text style={styles.toastStyles} /> : <OnlineCheckerToast />}
        </View>

        {
          this.state.sourcePage != null ?
            <View style={[styles.viewStyles, { backgroundColor: this.state.footerColor }]}>
              <TouchableOpacity style={styles.iconBackStyle} onPress={() => this.handleBackNavigation()}>
                <Icon name='chevron-left' size={25} color={this.state.backIconColor} />
                <Text style={[styles.TextStyles, { fontSize: Global.TxtFontSize, color: this.state.footerTitleColor, fontFamily: this.state.font }]}>{SecureFetch.getTranslationText('mbl-Back', 'Back')}</Text>
              </TouchableOpacity>
            </View>
            : <View></View>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  MainView: {
    flex: 1,
  },
  searchViewStyles: {
    height: '85%'
  },
  iconBackStyle: {
    justifyContent: 'flex-start',
    marginLeft: '8%',
    marginTop: '4%',
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
    height: hp('8%'),
    flexDirection: 'row',
  },
  TextStyles: {
    fontWeight: 'bold',
    marginLeft: '4%',
  },
  SubView: {
    alignSelf: 'baseline',
    width: '100%',
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'center',
  },
  flatListStyles: {
    flex: 1,
    marginBottom: '10%'
  },
  spinnerTextStyle: {
    color: '#FFFFFF',
  },
  searchContainerStyles: {
    flexDirection: 'row',
    width: '98%',
    borderWidth: 1,
    borderRadius: 2,
    marginLeft: '1%',
    marginRight: '1%'
  },
  searchTextBoxStyles: {
    backgroundColor: 'white',
    height: 40,
    paddingLeft: '3%'
  },
  removeIconStyles: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '9%'
  }
});