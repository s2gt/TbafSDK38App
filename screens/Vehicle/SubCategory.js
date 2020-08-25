import React, { Component } from 'react';
import {
  FlatList, BackHandler, StyleSheet, View, Dimensions,
  Text, TouchableOpacity, Image
} from 'react-native';
import SubCategoryTiles from './SubCategoryTiles';
import Config from '../../Config/Config';
import Theme from '../Theme';
import ProductCategories from './ProductCategories';
import Products from './Products';
import OnlineCheckerToast from '../OflineSection/OnlineCheckerToast';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Global from '../Global';
import Icon from 'react-native-vector-icons/FontAwesome';
import Prompt from 'react-native-prompt-crossplatform';
import SecureFetch from '../SecureFetch';
import { Button, Left, Body, Title, Right } from 'native-base';
import Checkout from '../More/Checkout';
import { Badge } from 'react-native-elements';
import { NavigationEvents } from 'react-navigation';
import Header from '../../components/Header';

const ITEM_WIDTH = Dimensions.get('window').width

export default class SubCategory extends React.Component {
  static navigationOptions = { header: null }
  constructor(props) {
    super(props);
    this.state = {
      Data: '',
      refreshing: true,
      deviceName: '',
      categoryId: '',
      parentId: '',
      sourcePage: '',
      CatName: '',
      backgroundColor: '',
      titleColor: '',
      footerColor: '',
      footerTitleColor: '',
      font: '',
      backIconColor: '',
      searchIconColor: '',
      visiblePrompt: false,
      promptValue: '',
    };
    this.fetchSubCategories = this.fetchSubCategories.bind(this);
    this.getSubCategories = this.getSubCategories.bind(this);
    this.handleSubCategory = this.handleSubCategory.bind(this);
  }

  componentDidMount = () => {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.handleBackNavigation(); // works best when the goBack is async

      return true;
    });
  }

  handleSubCategory() {
    this.state.sourcePage = this.props.navigation.getParam('sourcePage');
    if (this.state.sourcePage == 'Products') {
      const { params } = this.props.navigation.state;
      this.state.categoryId = params.data;
    } else {
      this.state.categoryId = Global.ProductCategoriesData.categoryId;
    }

    Global.ProductData = '';
    this.handleRefresh();
  }

  fetchSubCategories() {
    this.getSubCategories()
      .then(Data => this.setState({ Data, refreshing: false }, () => {
      }))
      .catch(() => this.setState({ refreshing: false }));
  }

  async getSubCategories() {
    let category = [];
    let rv = false;
    var cateCount = 0;

    for (var i = 0; i < Global.data.categories.length; i++) {
      if (Global.data.categories[i].parent == this.state.categoryId && Global.data.categories[i].categoryId != Config.LocationRemoveId) {
        category[cateCount] = Global.data.categories[i];
        cateCount++;
        rv = true;
      }
    }

    if (rv == false) {
      Global.Categories.splice(-1, 1);
      Global.Product_PrentId = this.state.parentId;

      this.props.navigation.navigate('Products', {
        sourcePage: 'SubCategory', data: Global.ProductData, cateId: this.state.categoryId,
        parent: this.state.parentId
      })
    }

    return category;
  }

  handleRefresh() {
    this.setState(
      { refreshing: true },
      () => this.fetchSubCategories()
    )
  }

  get_ParentCategory_Data(item) {
    let totalMessages = Global.data.categories.length;
    for (let i = 0; i < totalMessages; i++) {
      if (Global.data.categories[i].categoryId == item.parent) {
        Global.CategoryName.splice(0, 0, Global.data.categories[i].name);
        Global.Categories.splice(0, 0, Global.data.categories[i]);
        this.get_ParentCategory_Data(Global.data.categories[i]);
      }
    }
  }

  handleNavigation(item, index) {
    Global.CategoryName = [];
    Global.Categories = [];
    this.get_ParentCategory_Data(item);
    Global.FlatListIndex = index;
    Global.Categories.push(item);
    this.setState({ categoryId: item.categoryId }, () => {
      Global.ProductData = item;
      this.state.parentId = item.parent;
      Global.CategoryName.push(item.name);
      this.handleRefresh();
    })
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  handleBackNavigation() {
    var categoriesLength = Global.Categories.length;

    if (categoriesLength > 0) {
      if (this.state.categoryId == Global.Categories[categoriesLength - 1].categoryId) {
        Global.Categories.splice(-1, 1);
        Global.CategoryName.splice(-1, 1);
        this.state.CatName = Global.CategoryName;
        categoriesLength = Global.Categories.length;
      }
    }
    if (categoriesLength > 0) {
      this.setState({ categoryId: Global.Categories[categoriesLength - 1].categoryId }, () => {
        Global.Categories.splice(-1, 1);
        Global.CategoryName.splice(-1, 1);
        this.state.CatName = Global.CategoryName;
        this.state.Data = '';
        this.handleRefresh();
      })
    }
    else {
      Global.CategoryName = [];
      Global.Categories = [];
      this.props.navigation.navigate('ProductCategories');
    }
  }

  openCartPage() {
    this.props.navigation.navigate('Checkout', { sourcePage: 'SubCategory' });
  }

  openSearchPrompt() {
    this.setState({ visiblePrompt: true });
  }

  searchNavigation(value) {
    Global.SearchSourceNavKey = 'ProductCategories';
    Global.CategoryName = [];
    this.props.navigation.navigate('Search',
      { sourcePage: 'SubCategory', data: value })
  }

  openLanguagePage() {
    if (Global.NetworkInfo == true) {
      this.props.navigation.navigate('Language', { sourcePage: 'ProductCategories' });;
    } else {
      alert(SecureFetch.getTranslationText('mbl-OfflineTxt', 'You are offline, Please connect to internet'));
    }
  }

  getItemLayout = (data, index) => (
    { length: 160, offset: 160 * index, index }
  );

  render() {
    this.state.footerColor = Theme.setHeaderAndFooterColor('footer-color');
    this.state.footerTitleColor = Theme.setHeaderAndFooterColor('footer-titleColor');
    this.state.backIconColor = Theme.setColorTheme('BackIconColor');
    this.state.font = Theme.setFont();
    this.state.searchIconColor = Theme.setColorTheme('SearchIconColor');
    const Entities = require('html-entities').AllHtmlEntities;
    const entities = new Entities();
    this.state.backgroundColor = Theme.setHeaderAndFooterColor('header-backgroundColor');
    this.state.titleColor = Theme.setHeaderAndFooterColor('header-titleColor');
    var categoryNameLength = Global.CategoryName.length;
    this.state.CatName = Global.CategoryName[categoryNameLength - 1];
    return (
      <View style={styles.MainView}>

        <NavigationEvents
          //onWillFocus={() => this.handleRefresh()}
          onDidFocus={() => this.handleSubCategory()}
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

        <FlatList
          style={styles.CategoryViewStyle}
          numColumns={2}
          data={this.state.Data}
          refreshing={this.state.refreshing}
          onRefresh={this.handleRefresh.bind(this)}
          renderItem={({ item, index }) => {
            return (
              <View>
                <TouchableOpacity onPress={() => this.handleNavigation(item, index)}>
                  <SubCategoryTiles itemWidth={(ITEM_WIDTH - 20) / 2} result={item} />
                </TouchableOpacity>
              </View>
            )
          }}
          keyExtractor={item => item.name}
        />

        <View style={[styles.viewStyles, { backgroundColor: this.state.footerColor }]}>
          <TouchableOpacity style={styles.iconBackStyle} onPress={() => this.handleBackNavigation()}>
            <Icon name='chevron-left' size={25} color={this.state.backIconColor} />
            <Text style={[styles.TextStyles, { color: this.state.footerTitleColor, fontFamily: this.state.font }]}>
              {this.state.CatName == null ? Global.ProductCategoriesData.name : this.state.CatName}
            </Text>
          </TouchableOpacity>
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
    marginBottom: '10%'
  },
  toastStyles: {
    flexDirection: 'row',
    position: 'absolute',
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
    height: hp('8%'),
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  TextStyles: {
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: '4%',
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