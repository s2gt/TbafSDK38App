import React, { Component } from 'react';
import { AsyncStorage, View } from 'react-native';
import { WebView } from 'react-native-webview';
import Config from '../../Config/Config';
import Global from '../Global';
import SecureFetch from '../SecureFetch';
import { connect } from 'react-redux';
import * as countActions from '../../actions/counts';
import { bindActionCreators } from 'redux';

class Services extends Component {
  constructor(props) {
    super(props);
    this.state = {
      localBadgeCount: '',
      childBasepath: ''
    }
    this.handleRefresh();
  }

  async handleRefresh() {
    this.setState({ childBasepath: await AsyncStorage.getItem('childBasepath') });
  }

  onChangeCart(cartValue) {
    let { count, actions } = this.props;
    count = cartValue;
    Global.ServicesState = false;
    actions.changeCount(count);
  }

  getWebViewURL(buyerId) {
    var bPath;
    if (buyerId == null) {
      buyerId = '';
    } else {
      buyerId = buyerId.replace('+', '');
    }

    if (this.state.childBasepath != '') {
      bPath = this.state.childBasepath.includes('https://') ? this.state.childBasepath : 'https://' + this.state.childBasepath
    } else {
      bPath = Config.Basepath;
    }
    ts = SecureFetch.getUtc();
    url = 'bid=' + buyerId + '&language=' + this.state.languageCode + '&ts=' + ts + '&currency_code=' + this.state.CurrencyCode;
    var encodeURL = encodeURIComponent(url);
    qslc = SecureFetch.getQslc(encodeURL);
    var finalURL = bPath + '?target=cart&appview=2' + '&' + url + "&qslc=" + qslc;
    console.log('services ' + finalURL);
    Global.ServicesState = false;

    return finalURL;
  }

  render() {
    const { buyerId, bpath } = this.props;

    return (
      <WebView
        style={{ height: 0, width: 0 }}
        source={{ uri: this.getWebViewURL(this.props.buyerId) }}
        ref={ref => (this.WEBVIEW_REF = ref)}
      />
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

export default connect(mapStateToProps, mapDispatchToProps)(Services)
