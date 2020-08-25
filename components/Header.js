import React, { Component } from 'react';
import { StyleSheet, View, Text, SafeAreaView, AsyncStorage } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Global from '../screens/Global';
import PropTypes from 'prop-types';
import Config from '../Config/Config';
import Theme from '../screens/Theme';
import { Header, Button, Left, Body, Title, Right } from 'native-base';
import ShoppingCartIcon from '../containers/ShoppingCartIcon';
import Services from '../screens/Services/Services';

export default class HeaderComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      backgroundColor: '',
      titleColor: '',
      promptVisible: false,
      font: '',
      searchIconColor: '',
      langIconColor: '',
      localBadgeCount: '',
      buyerId: ''
    };
    this.callData();
  }

  async callData() {
    this.setState({ buyerId: await AsyncStorage.getItem('Bid') });
  }

  render() {
    const { openLanguagePage, openSearchPrompt, openCartPage, pageName } = this.props;
    const Entities = require('html-entities').AllHtmlEntities;
    const entities = new Entities();
    this.state.backgroundColor = Theme.setHeaderAndFooterColor('header-backgroundColor');
    this.state.titleColor = Theme.setHeaderAndFooterColor('header-titleColor');
    this.state.searchIconColor = Theme.setColorTheme('SearchIconColor');
    this.state.langIconColor = Theme.setColorTheme('LangIconColor');
    this.state.font = Theme.setFont();

    return (
      <SafeAreaView style={styles.headerShadowStyles}>
        {
          Global.ServicesState == true ?
            <Services
              buyerId={this.state.buyerId}
              bpath={Config.Basepath}
            />
            :
            null
        }
        <Header style={{ backgroundColor: this.state.backgroundColor, height: 65, paddingTop: 10 }}>
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
            {
              pageName == 'checkout' || pageName == 'Search' ?
                null :
                <View style={{ flexDirection: 'row' }}>
                  <Button transparent onPress={() => openSearchPrompt()}>
                    <Icon name="search" size={22} color={this.state.searchIconColor} />
                  </Button>
                  <Button transparent onPress={() => openLanguagePage()}>
                    <Icon name="language" size={22} color={this.state.searchIconColor} />
                  </Button>
                </View>
            }
            {
              Global.data.company.enable_checkout == 'Yes' ?
                <ShoppingCartIcon color={this.state.searchIconColor} />
                : null
            }
          </Right>
        </Header>
      </SafeAreaView>
    );
  }
}

HeaderComponent.propTypes = {
  openSearchPrompt: PropTypes.func.isRequired,
  openLanguagePage: PropTypes.func.isRequired,
  openCartPage: PropTypes.func.isRequired,
  openDrawer: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  headerTitleStyles: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    flexWrap: 'wrap-reverse'
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