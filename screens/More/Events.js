import React, { Component } from 'react';
import {
  Text, View, StyleSheet, TouchableOpacity, BackHandler, FlatList
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Config from '../../Config/Config';
import MoreScreen from '../More/MoreScreen';
import SecureFetch from '../SecureFetch';
import Global from '../Global';
import Icon from 'react-native-vector-icons/FontAwesome';
import Theme from '../Theme';
import EventTile from './EventTile';
import EventDescription from './EventDescription';
import { Badge } from 'react-native-elements';
import StarEvents from '../More/StarEvents';
import { Header, Button, Left, Body, Title, Right } from 'native-base';

export default class Events extends Component {
  static navigationOptions = { header: null }
  constructor(props) {
    super(props);
    this.state = {
      backgroundColor: '',
      titleColor: '',
      footerColor: '',
      footerTitleColor: '',
      txtColor: '',
      font: '',
      loading: false,
      result: [],
      refreshing: true,
      backIconColor: '',
    };
  }

  handleBackNavigation() {
    this.props.navigation.goBack();
  }

  componentDidMount() {
    NetInfo.addEventListener(state => { this.handleConnectivityChange(state.isConnected) });
    this.handleRefresh();
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.handleBackNavigation(); // works best when the goBack is async
      return true;
    });
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  handleConnectivityChange = (isConnected) => {
    this.setState({ netInfo: isConnected });
    Global.NetworkInfo = isConnected;
    this.handleRefresh();
  }

  handleRefresh() {
    Global.StarredEvents.forEach((asyncEvnts) => Global.EnabledEvents.forEach((originalEvnts) => {
      if (originalEvnts.id === asyncEvnts.id) {
        if (asyncEvnts.starred === 'true') {
          originalEvnts.starred = 'true';
        }
      }
    }));
    this.setState({ refreshing: true }, () => {
      this.setState({ result: Global.EnabledEvents, refreshing: false })
    })
  }

  handleNavigation(item, index) {
    Global.EventFlatListIndex = index;
    this.props.navigation.navigate('EventDescription', {
      sourcePage: 'Events', data: item,
      onNavigateBack: this.handleRefresh.bind(this)
    });
  }

  getItemLayout = (data, index) => {
    return { length: 200, offset: 200 * index, index };
  }

  openStarredEvents = () => {
    var starredEvents = Global.EnabledEvents.filter(function (event) {
      return event.starred == 'true';
    });

    if (starredEvents.length > 0) {
      this.props.navigation.navigate('StarEvents', {
        onNavigateBack: this.handleRefresh.bind(this)
      });
    } else {
      alert('No Events has been added to favourites');
    }
  }


  render() {
    this.state.backgroundColor = Theme.setHeaderAndFooterColor('header-backgroundColor');
    this.state.titleColor = Theme.setHeaderAndFooterColor('header-titleColor');
    this.state.footerColor = Theme.setHeaderAndFooterColor('footer-color');
    this.state.footerTitleColor = Theme.setHeaderAndFooterColor('footer-titleColor');
    this.state.font = Theme.setFont();
    this.state.txtColor = Theme.setColorTheme('TxtColor');
    this.state.backIconColor = Theme.setColorTheme('BackIconColor');
    this.state.searchIconColor = Theme.setColorTheme('SearchIconColor');
    const Entities = require('html-entities').AllHtmlEntities;
    const entities = new Entities();

    return (
      <View style={styles.MainView}>
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
            <Right>
              <Button transparent onPress={() => this.openStarredEvents()}>
                <Icon name="star" size={22} color={this.state.searchIconColor} style={styles.iconstyles} />
              </Button>
            </Right>
          </Header>
        </View>

        <FlatList
          style={styles.flatListStyles}
          data={this.state.result}
          renderItem={({ item, index }) => {
            return (
              <View>
                <TouchableOpacity onPress={() => this.handleNavigation(item, index)}>
                  <EventTile result={item} />
                </TouchableOpacity>
              </View>
            )
          }}
          initialScrollIndex={Global.EventFlatListIndex}
          refreshing={this.state.refreshing}
          onRefresh={this.handleRefresh.bind(this)}
          getItemLayout={(data, index) => (
            { length: 200, offset: 200 * index, index }
          )}
          keyExtractor={item => item.id}
        />

        <View style={[styles.viewStyles, { backgroundColor: this.state.footerColor }]}>
          <TouchableOpacity style={styles.iconBackStyle} onPress={() => this.handleBackNavigation()}>
            <Icon name='chevron-left' size={25} color={this.state.backIconColor} />
            <Text style={[styles.TextStyles, { fontSize: Global.TxtFontSize, color: this.state.footerTitleColor }]}>{SecureFetch.getTranslationText('mbl-Events', 'Events')}</Text>
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
    //fontSize: 17,
    fontWeight: 'bold',
    marginLeft: '4%',
  },
  row: {
    marginTop: '5%',
    marginBottom: '20%',
    marginRight: '40%',
    marginLeft: '7%',
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
  flatListStyles: {
    flex: 1,
    marginBottom: '12%'
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
});