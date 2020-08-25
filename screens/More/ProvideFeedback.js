import React, { Component } from 'react';
import {
  Text, View, StyleSheet, TouchableOpacity, Image, TextInput, Button,
  AsyncStorage, ScrollView, BackHandler
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Config from '../../Config/Config';
import MoreScreen from '../More/MoreScreen';
import SecureFetch from '../SecureFetch';
import Global from '../Global';
import Icon from 'react-native-vector-icons/FontAwesome';
import Theme from '../Theme';

export default class HelloWorldApp extends Component {
  static navigationOptions = { header: null }
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      phone: '',
      feedbackSubject: '',
      feedbackContent: '',
      footerColor: '',
      footerTitleColor: '',
      buttonColor: '',
      backIconColor: ''
    };
    // AsyncStorage.getItem('Name').then(name => this.setState({ name }), () => { });
    // AsyncStorage.getItem('Phone').then(phone => this.setState({ phone }), () => { });
  }

  sendFeedback = () => {
    if (this.state.feedbackSubject != '' && this.state.feedbackContent != '') {
      SecureFetch.sendFeedBack(this.state.name
        , this.state.phone
        , this.state.feedbackSubject
        , this.state.feedbackContent);
      alert(SecureFetch.getTranslationText('mbl-FeedBakSuccessTxt', 'Feedback sent successfully'));
      this.props.navigation.goBack();
    } else {
      alert(SecureFetch.getTranslationText('mbl-FeedBackValidation',
        'Please fill the feedback'));
    }
  }

  handleNavigation() {
    this.props.navigation.goBack();
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.handleNavigation(); // works best when the goBack is async
      return true;
    });
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  render() {
    this.state.footerColor = Theme.setHeaderAndFooterColor('footer-color');
    this.state.footerTitleColor = Theme.setHeaderAndFooterColor('footer-titleColor');
    this.state.font = Theme.setFont();
    this.state.txtColor = Theme.setColorTheme('TxtColor');
    this.state.buttonColor = Theme.setColorTheme('ButtonColor');
    this.state.backIconColor = Theme.setColorTheme('BackIconColor');
    const Entities = require('html-entities').AllHtmlEntities;
    const entities = new Entities();

    return (
      <View style={styles.MainView}>

        <ScrollView keyboardShouldPersistTaps='always'>
          <View>
            <Text style={[styles.infoText, { fontSize: Global.TxtFontSize, color: this.state.txtColor, fontFamily: this.state.font }]}>
              {SecureFetch.getTranslationText('mbl-FeedbackTitle', 'Please provide your feedback')}</Text>

            <TextInput style={[styles.NameStyles, {
              borderBottomColor: '#00000',
              borderBottomWidth: 1,
              fontSize: Global.TxtFontSize,
              color: this.state.txtColor,
              fontFamily: this.state.font
            }]}
              //multiline={true}
              underlineColorAndroid='transparent'
              placeholder={SecureFetch.getTranslationText('mbl-NameTxt', 'Enter your Name')}
              onChangeText={(name) => this.setState({ name })} />

            <TextInput style={[styles.NameStyles, {
              borderBottomColor: '#00000',
              borderBottomWidth: 1,
              fontSize: Global.TxtFontSize,
              color: this.state.txtColor,
              fontFamily: this.state.font
            }]}
              keyboardType='numeric'
              maxLength={10}
              //multiline={true}
              underlineColorAndroid='transparent'
              placeholder={SecureFetch.getTranslationText('mbl-PhoneTxt', 'Enter your Mobile Number')}
              onChangeText={(phone) => this.setState({ phone })} />

            {/* <Text style={[styles.subStyles, { fontFamily: this.state.font, fontSize: Global.TxtFontSize, }]}>{SecureFetch.getTranslationText('mbl-Sub', 'subject')}</Text> */}

            <TextInput style={[styles.NameStyles, {
              borderBottomColor: '#00000',
              borderBottomWidth: 1,
              fontSize: Global.TxtFontSize,
              color: this.state.txtColor,
              fontFamily: this.state.font
            }]}
              multiline={true}
              underlineColorAndroid='transparent'
              placeholder={SecureFetch.getTranslationText('mbl-Sub', 'subject')}
              onChangeText={(feedbackSubject) => this.setState({ feedbackSubject })} />

            {/* <Text style={[styles.subStyles, { fontSize: Global.TxtFontSize, fontFamily: this.state.font }]}>{SecureFetch.getTranslationText('mbl-YourFeedbackTxt', 'Your Feedback')}</Text> */}

            <TextInput style={[styles.NameStyles, {
              borderBottomColor: '#00000',
              borderBottomWidth: 1,
              fontSize: Global.TxtFontSize,
              color: this.state.txtColor,
              fontFamily: this.state.font
            }]}
              multiline={true}
              underlineColorAndroid='transparent'
              placeholder={SecureFetch.getTranslationText('mbl-YourFeedbackTxt', 'Your Feedback')}
              onChangeText={(feedbackContent) => this.setState({ feedbackContent })} />
          </View>

          <View style={styles.row}>
            <Button title={SecureFetch.getTranslationText('mbl-Submit', 'Submit')}
              color={this.state.buttonColor} onPress={() => { this.sendFeedback() }} />
          </View>
        </ScrollView>

        <View style={[styles.viewStyles, { backgroundColor: this.state.footerColor }]}>
          <TouchableOpacity style={styles.iconBackStyle} onPress={() => this.handleNavigation()}>
            <Icon name='chevron-left' size={25} color={this.state.backIconColor} />
            <Text style={[styles.TextStyles, { fontSize: Global.TxtFontSize, fontFamily: this.state.font, color: this.state.footerTitleColor }]}>{SecureFetch.getTranslationText('mbl-ProvideFeedback', 'Provide Feedback')}</Text>
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
  NameStyles: {
    marginTop: '3%',
    marginRight: '7%',
    marginLeft: '7%',
    //fontSize: 22,
    paddingBottom: 7,
    color: Config.TxtColor,
    fontFamily: Config.Font
  },
  infoText: {
    //fontSize: 22,
    fontWeight: 'bold',
    marginLeft: '5%',
    marginRight: '5%',
    marginTop: '15%',
    color: Config.TitleTxtColor,
    fontFamily: Config.Font
  },
  subStyles: {
    //fontSize: 20,
    marginLeft: '7%',
    marginRight: '7%',
    marginTop: '5%',
    color: Config.TxtColor,
    fontFamily: Config.Font
  },
  submitStyle: {
    color: '#3498DB',
    fontWeight: 'bold',
    fontSize: 20,
  },
  row: {
    marginTop: '5%',
    marginBottom: '20%',
    marginRight: '40%',
    marginLeft: '7%',
  },
});