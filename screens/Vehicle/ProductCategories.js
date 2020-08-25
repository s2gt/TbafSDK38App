import React, { Component } from 'react';
import {
  FlatList, StyleSheet, View, Dimensions, Text, BackHandler,
  TouchableOpacity, ScrollView
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import ProductCategoriesTile from './ProductCategoriesTile';
import SubCategory from './SubCategory';
import BannerCarousel from '../../components/BannerCarousel';
import Config from '../../Config/Config';
import Global from '../Global';
import OnlineCheckerToast from '../OflineSection/OnlineCheckerToast';
import Icon from 'react-native-vector-icons/FontAwesome';
import Prompt from 'react-native-prompt-crossplatform';
import SecureFetch from '../SecureFetch';
import { Button, Left, Body, Title, Right } from 'native-base';
import Theme from '../Theme';
import Checkout from '../More/Checkout';
import { Badge } from 'react-native-elements';
import Header from '../../components/Header';
import { NavigationEvents } from 'react-navigation';
import ChildCategory from '../More/ChildCategory';

const ITEM_WIDTH = Dimensions.get('window').width

export default class ProductCategories extends React.Component {
  static navigationOptions = { header: null }
  constructor(props) {
    super(props);
    this.state = {
      result: '',
      mresult: [],
      refreshing: true,
      deviceName: '',
      netInfo: null,
      visiblePrompt: false,
      backgroundColor: '',
      titleColor: '',
      searchIconColor: '',
      font: '',
      promptValue: '',
    };
    Global.CategoryName = [];
    Global.Categories = [];
    this.fetchCategories = this.fetchCategories.bind(this);
    this.getCategories = this.getCategories.bind(this);
    this.getMobileBlocks();
  }

  getMobileBlocks() {
    let mresult = [];
    if (Global.data["mobile-blocks"].length != 0) {
      let categories = '';
      for (let prop in Global.data["mobile-blocks"]) {
        if (Object.prototype.hasOwnProperty.call(Global.data["mobile-blocks"], prop)) {
          let spage = prop;
          console.log("spage " + spage)
          mresult.push(Global.data["mobile-blocks"][spage])
        }
        mresult.map(obj => obj.page == "Mobile Home" ? categories = obj.categories : '');
        this.state.mresult = categories.split(',');
      }
    }
  }

  fetchCategories() {
    this.getCategories()
      .then(result => this.setState({ result, refreshing: false }, () => {
      }))
      .catch(() => this.setState({ refreshing: false }));
  }

  async getCategories() {
    Global.CategoryName = [];
    Global.Categories = [];
    let result = [];
    var cateCount = 0;

    if (this.state.mresult.length > 0) {
      for (var i = 0; i < this.state.mresult.length; i++) {
        for (let j = 0; j < Global.data.categories.length; j++) {
          if (this.state.mresult[i] == Global.data.categories[j].categoryId && Global.data.categories[j].categoryId != Config.LocationRemoveId) {
            result[cateCount] = Global.data.categories[j];
            cateCount++;
          }
        }
      }
    } else {
      for (var i = 0; i < Global.data.categories.length; i++) {
        if (Global.data.categories[i].parent == 1 && Global.data.categories[i].categoryId != Config.LocationRemoveId) {
          result[cateCount] = Global.data.categories[i];
          cateCount++;
        }
      }
    }

    return result;
  }

  handleRefresh() {
    this.setState(
      { refreshing: true },
      () => this.fetchCategories()
    )
  }

  handleNavigation(item, index) {
    Global.FlatListIndex = index;
    Global.CategoryName = [];
    Global.Categories = [];
    Global.ProductCategoriesData = item;
    Global.Categories.push(item);
    Global.CategoryName.push(item.name);
    this.props.navigation.navigate('SubCategory', { sourcePage: 'Products', data: item.categoryId });
  }

  componentDidMount() {
    NetInfo.fetch().then(isConnected => {
      this.setState({ netInfo: isConnected });
    });
    NetInfo.addEventListener(state => { this.handleConnectivityChange(state.isConnected) });
    this.handleRefresh();
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

    this.willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      () => {
        this.handleRefresh();
      }
    );
  }

  componentWillUnmount() {
    this.willFocusSubscription.remove();
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

  openSearchPrompt() {
    this.setState({ visiblePrompt: true });
  }

  searchNavigation(value) {
    Global.SearchSourceNavKey = 'ProductCategories';
    this.props.navigation.navigate('Search',
      { sourcePage: 'ProductCategories', data: value })
  }

  openLanguagePage() {
    if (Global.NetworkInfo == true) {
      this.props.navigation.navigate('Language', { sourcePage: 'ProductCategories' });
    } else {
      alert(SecureFetch.getTranslationText('mbl-OfflineTxt', 'You are offline, Please connect to internet'));
    }
  }

  getItemLayout = (data, index) => (
    { length: 160, offset: 160 * index, index }
  );

  openCartPage() {
    this.props.navigation.navigate('Checkout', { sourcePage: 'ProductCategories' });
  }
  reloadMethods() {
    SecureFetch.getBannerImagesTop();
  }

  render() {
    const Entities = require('html-entities').AllHtmlEntities;
    const entities = new Entities();
    this.state.backgroundColor = Theme.setHeaderAndFooterColor('header-backgroundColor');
    this.state.titleColor = Theme.setHeaderAndFooterColor('header-titleColor');
    this.state.searchIconColor = Theme.setColorTheme('SearchIconColor');
    this.state.font = Theme.setFont();

    return (
      <View style={styles.MainView}>

        <NavigationEvents
          onDidFocus={this.reloadMethods()}
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
        <View style={styles.headerShadowStyles}>
          <Header
            openSearchPrompt={() => this.openSearchPrompt()}
            openLanguagePage={() => this.openLanguagePage()}
            openCartPage={() => this.openCartPage()}
            openDrawer={() => this.openDrawer()}
            navigation={this.props.navigation}
          />
        </View>

        {/* <View style={styles.headerShadowStyles}>
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
            <Right>
              <Button transparent onPress={() => this.openSearchPrompt()}>
                <Icon name="search" size={22} color={this.state.searchIconColor} />
              </Button>
              <Button transparent onPress={() => this.openLanguagePage()}>
                <Icon name="language" size={22} color={this.state.searchIconColor} />
              </Button>
              {
                Global.data.company.enable_checkout == 'Yes' ? <View>
                  <Button transparent onPress={() => this.openCartPage()}>
                    <Icon name="shopping-cart" size={22} color={this.state.searchIconColor} />
                  </Button>
                  <Badge
                    value={Global.BadgeCount}
                    containerStyle={{ position: 'absolute', top: 0, right: 0 }} />
                </View> : null
              }
            </Right>
          </Header>
        </View> */}

        <ScrollView>
          {
            Global.data.company.apptheme == 'ECOMMERCE' ?
              <BannerCarousel bannerImgs={SecureFetch.getBannerImagesTop()} /> :
              null
          }
          <FlatList
            style={styles.CategoryViewStyle}
            numColumns={2}
            data={this.state.result}
            renderItem={({ item, index }) => {
              return (
                <View>
                  <TouchableOpacity onPress={() => this.handleNavigation(item, index)}>
                    <ProductCategoriesTile itemWidth={(ITEM_WIDTH - 20) / 2} result={item} />
                  </TouchableOpacity>
                </View>
              )
            }}
            getItemLayout={this.getItemLayout}
            refreshing={this.state.refreshing}
            onRefresh={this.handleRefresh.bind(this)}
            keyExtractor={item => item.categoryId}
          />
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
    flexDirection: 'column',
    bottom: '0%'
  },
  CategoryViewStyle: {
    marginTop: '1%',
  },
  toastStyles: {
    flexDirection: 'row',
    position: 'absolute',
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
});