import React, { Component } from 'react';
import { Text, View, Button, StyleSheet, TextInput, ScrollView } from 'react-native';
import LanguageScreen from '../../screens/Home/LanguageScreen';
import Config from '../../Config/Config';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SecureFetch from '../SecureFetch';
import Global from '../Global';
import Geolocation from '../More/Geolocation';

export default class HelloWorldApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      basePath: '',
      cid: '',
      footerColor: '',
      headerBgColor: '',
      headerTitleColor: '',
      footerTitleColor: '',
      responseStatus: '',
      langData: ''
    }
  }

  handleNavigation() {
    if (this.state.cid != '') {
      Config.Cid = this.state.cid;
    }
    if (this.state.basePath != '') {
      Config.Basepath = this.state.basePath;
    }
    if (this.state.footerColor != '') {
      Config.FooterColor = this.state.footerColor;
    }
    if (this.state.headerBgColor != '') {
      Config.HeaderBackgroundColor = this.state.headerBgColor;
    }
    if (this.state.headerTitleColor != '') {
      Config.HeaderTitleColor = this.state.headerTitleColor;
    }
    if (this.state.footerTitleColor != '') {
      Config.FooterTitleColor = this.state.footerTitleColor;
    }
    this.getLangJsonData();
  }

  async getLangJsonData() {
    const response = await SecureFetch.getLanguageJSON('GetAppInfo?', Config.Cid, Config.Basepath);
    var result;
    this.state.responseStatus = response.status;
    if (response.status == 200) {
      result = await response.json()
      this.setState({ langData: result }, () => {
        Global.Language = this.state.langData;
      })
      // this.props.navigation.navigate('LanguageScreen');
      this.props.navigation.navigate('Geolocation');
    } else {
      alert('Something went wrong, please try again later');
    }
  }

  render() {
    return (
      <View style={styles.mainView}>
        <ScrollView>
          <View style={styles.FirstInputWrap}>

            <TextInput style={[styles.NameStyles, {
              //borderBottomColor: '#00000',
              borderBottomWidth: 1
            }]}
              underlineColorAndroid='transparent'
              placeholder={Config.Basepath}
              placeholderTextColor={Config.TxtColor}
              onChangeText={(basePath) => this.setState({ basePath })}
            />
            <Text style={styles.nameTagStyles}>Api Basepath</Text>

            <TextInput style={[styles.NameStyles, {
              //borderBottomColor: '#00000',
              borderBottomWidth: 1
            }]}
              underlineColorAndroid='transparent'
              placeholder={Config.Cid}
              placeholderTextColor={Config.TxtColor}
              onChangeText={(cid) => this.setState({ cid })}
            />
            <Text style={styles.nameTagStyles}>Company Id</Text>

            <TextInput style={[styles.NameStyles, {
              //borderBottomColor: '#00000',
              borderBottomWidth: 1
            }]}
              underlineColorAndroid='transparent'
              placeholder={Config.FooterColor}
              placeholderTextColor={Config.TxtColor}
              onChangeText={(footerColor) => this.setState({ footerColor })}
            />
            <Text style={styles.nameTagStyles}>Footer Color</Text>

            <TextInput style={[styles.NameStyles, {
              //borderBottomColor: '#00000',
              borderBottomWidth: 1
            }]}
              underlineColorAndroid='transparent'
              placeholder={Config.HeaderBackgroundColor}
              placeholderTextColor={Config.TxtColor}
              onChangeText={(headerBgColor) => this.setState({ headerBgColor })}
            />
            <Text style={styles.nameTagStyles}>Header Background Color</Text>

            <TextInput style={[styles.NameStyles, {
              //borderBottomColor: '#00000',
              borderBottomWidth: 1
            }]}
              underlineColorAndroid='transparent'
              placeholder={Config.HeaderTitleColor}
              placeholderTextColor={Config.TxtColor}
              onChangeText={(headerTitleColor) => this.setState({ headerTitleColor })}
            />
            <Text style={styles.nameTagStyles}>Header Title Color</Text>

            <TextInput style={[styles.NameStyles, {
              //borderBottomColor: '#00000',
              borderBottomWidth: 1
            }]}
              underlineColorAndroid='transparent'
              placeholder={Config.FooterTitleColor}
              placeholderTextColor={Config.TxtColor}
              onChangeText={(footerTitleColor) => this.setState({ footerTitleColor })}
            />
            <Text style={styles.nameTagStyles}>Footer Title Color</Text>

            <Button title='Submit' color={Config.ButtonColor} onPress={() => { this.handleNavigation() }} />

            <Text style={styles.nameTagStyles}>V 1.4.0.1</Text>

          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    marginTop: '10%'
  },
  FirstInputWrap: {
    flex: 1,
    width: '90%',
    marginLeft: '5%',
    marginRight: '3%',
  },
  NameStyles: {
    marginTop: '3%',
    height: 48,
    fontSize: 22,
    paddingBottom: 7,
    color: Config.TxtColor,
  },
  nameTagStyles: {
    fontSize: 13,
    color: Config.TxtColor,
    marginBottom: '1%'
  },
});