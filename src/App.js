import React from 'react';
import MapboxGL from '@mapbox/react-native-mapbox-gl';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Icon} from 'react-native-elements';
import SafeAreaView from 'react-native-safe-area-view';

import MapHeader from './components/common/MapHeader';
// Styles
import sheet from './styles/sheet';
import colors from './styles/colors';
// Utils
import {IS_ANDROID} from './utils';
import config from './utils/config';
// Examples

import GeoJSONSource from './components/GeoJSONSource';


const styles = StyleSheet.create({
  noPermissionsText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  exampleList: {
    flex: 1,
  },
  exampleListItemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  exampleListItem: {
    paddingVertical: 32,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.secondary.white,
  },
  exampleListLabel: {
    fontSize: 18,
  },
  exampleBackground: {
    flex: 1,
    backgroundColor: colors.primary.pinkFaint,
  },
});

MapboxGL.setAccessToken(config.get('accessToken'));

class ExampleItem {
  constructor(label, Component) {
    this.label = label;
    this.Component = Component;
  }
}

const Examples = [

  new ExampleItem('GeoJSON Source', GeoJSONSource),

];

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFetchingAndroidPermission: IS_ANDROID,
      isAndroidPermissionGranted: false,
      activeExample: 0,
    };

    this.renderItem = this.renderItem.bind(this);
    this.onCloseExample = this.onCloseExample.bind(this);
  }

  async componentWillMount() {
    if (IS_ANDROID) {
      const isGranted = await MapboxGL.requestAndroidLocationPermissions();
      this.setState({
        isAndroidPermissionGranted: isGranted,
        isFetchingAndroidPermission: false,
      });
    }
  }

  getActiveItem() {
    if (
      this.state.activeExample < 0 ||
      this.state.activeExample >= Examples.length
    ) {
      return null;
    }
    return Examples[this.state.activeExample];
  }

  onExamplePress(activeExamplePosition) {
    this.setState({activeExample: activeExamplePosition});
  }

  onCloseExample() {
    //this.setState({activeExample: -1});
  }

  renderItem({item, index}) {
    return (
      <View style={styles.exampleListItemBorder}>
        <TouchableOpacity onPress={() => this.onExamplePress(index)}>
          <View style={styles.exampleListItem}>
            <Text style={styles.exampleListLabel}>{item.label}</Text>
            <Icon name="keyboard-arrow-right" />
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  renderActiveExample() {
    const item = this.getActiveItem();

    const modalProps = {
      visible: !!item,
      transparent: true,
      animationType: 'slide',
      onRequestClose: this.onCloseExample,
    };

    return (
      <Modal {...modalProps}>
        <SafeAreaView
          style={[sheet.matchParent, {backgroundColor: 'colors.primary.blueLight'}]}
          forceInset={{top: 'always'}}
        >
          <View style={styles.exampleBackground}>
            {modalProps.visible ? (
              <item.Component
                key={item.label}
                label="SataKolkyt"
                onDismissExample={this.onCloseExample}
              />
            ) : null}
          </View>
        </SafeAreaView>
      </Modal>
    );
  }

  render() {
    if (IS_ANDROID && !this.state.isAndroidPermissionGranted) {
      if (this.state.isFetchingAndroidPermission) {
        return null;
      }
      return (
        <SafeAreaView
          style={[sheet.matchParent, {backgroundColor: colors.primary.blue}]}
          forceInset={{top: 'always'}}
        >
          <View style={sheet.matchParent}>
            <Text style={styles.noPermissionsText}>
              You need to accept location permissions in order to use this
              example applications
            </Text>
          </View>
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView
        style={[sheet.matchParent, {backgroundColor: colors.primary.blue}]}
        forceInset={{top: 'always'}}
      >
        <View style={sheet.matchParent}>



          {this.renderActiveExample()}
        </View>
      </SafeAreaView>
    );
  }
}

export default App;
