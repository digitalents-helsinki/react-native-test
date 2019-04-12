import React from "react";
import MapboxGL from "@mapbox/react-native-mapbox-gl";
import { Overlay } from "react-native-elements";
import {
  Text,
  TextInput,
  View,
  Button,
  ScrollView,
  TouchableHighlight
} from "react-native";
import { Input } from "react-native-elements";
import DatePicker from "react-native-datepicker";
import sheet from "../styles/sheet";
import gridPattern from "../assets/grid_pattern.png";
import smileyFaceGeoJSON from "../assets/smiley_face.json";
import reservedJSON from "../assets/reserved.json";
import config from "../utils/config";

import TimePicker from "react-native-simple-time-picker";
import DateTimePicker from "react-native-modal-datetime-picker";
import Page from "./common/Page";
import BaseExamplePropTypes from "./common/BaseExamplePropTypes";
import RNPickerSelect from "react-native-picker-select";
/**/
const url = config.get("url");
const sports = [
  {
    label: "Football",
    value: "football"
  },
  {
    label: "Baseball",
    value: "baseball"
  },
  {
    label: "Hockey",
    value: "hockey"
  }
];
const layerStyles = MapboxGL.StyleSheet.create({
  background: {
    backgroundPattern: gridPattern
  },
  smileyFace: {
    fillColor: "rgba(0,0,0 ,0)",
    fillOutlineColor: "white"
  }
});
const layerStyles2 = MapboxGL.StyleSheet.create({
  background: {
    backgroundPattern: gridPattern
  },
  smileyFace: {
    fillColor: "rgba(0,0,0 ,0)",
    fillOutlineColor: "red"
  },
  route: {
    lineColor: "white",
    lineWidth: 3,
    lineOpacity: 0.84
  }
});

class GeoJSONSource extends React.Component {
  static propTypes = {
    ...BaseExamplePropTypes
  };
  onSourceLayerPress(e) {
    const feature = e.nativeEvent.payload;
    this.setState({ visible: true, feature: feature });
  }
  componentDidMount() {
    return fetch("http://" + url + ":8089/api/map/shores")
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        var data = {
          type: "FeatureCollection",
          features: responseJson.data
        };
        this.setState(
          {
            json: data
          },
          function() {}
        );
      })
      .catch(error => {
        console.error(error);
      });
  }

  constructor(props) {
    super(props);
    this.inputRefs = {
      firstTextInput: null,
      favSport0: null,
      favSport1: null,
      lastTextInput: null
    };
    this.state = {
      visible: false,
      json: {},
      feature: [],
      date: "2019-01-01",
      selectedHours: 0,
      //initial Hours
      selectedMinutes: 0,
      numbers: [
        {
          label: "1",
          value: 1,
          color: "orange"
        },
        {
          label: "2",
          value: 2,
          color: "green"
        }
      ],
      favSport0: undefined,
      favSport1: undefined,
      favSport2: undefined,
      favSport3: undefined,
      favSport4: "baseball",
      favNumber: undefined
      //initial Minutes
    };
  }
  getJson() {
    return this.state.json;
  }

  render() {
    const { selectedHours, selectedMinutes } = this.state;
    return (
      <Page {...this.props}>
        <MapboxGL.MapView
          zoomLevel={2}
          centerCoordinate={[-35.15165038, 40.6235728]}
          onSetCameraComplete={this.onUpdateZoomLevel}
          ref={ref => (this.map = ref)}
          style={sheet.matchParent}
          styleURL={MapboxGL.StyleURL.Dark}
        >
          <MapboxGL.VectorSource>
            <MapboxGL.BackgroundLayer
              id="background"
              style={layerStyles.background}
            />
          </MapboxGL.VectorSource>
          <MapboxGL.ShapeSource
            onPress={this.onSourceLayerPress.bind(this)}
            id="smileyFaceSource"
            shape={this.state.json}
          >
            <MapboxGL.FillLayer
              id="smileyFaceFill"
              style={layerStyles.smileyFace}
            />
          </MapboxGL.ShapeSource>
          <MapboxGL.ShapeSource
            onPress={this.onSourceLayerPress.bind(this)}
            id="smileyFaceSource2"
            shape={reservedJSON}
          >
            <MapboxGL.FillLayer
              id="smileyFaceFill2"
              style={layerStyles2.smileyFace}
            />
          </MapboxGL.ShapeSource>
        </MapboxGL.MapView>
        <Overlay
          isVisible={this.state.visible}
          windowBackgroundColor="rgba(255, 255, 255, .5)"
          overlayBackgroundColor="white"
          width="auto"
          height="auto"
          onBackdropPress={() => this.setState({ visible: false })}
        >
          <>
            <ScrollView>
              <Text>Aloituspäivä</Text>
              <DatePicker
                style={{ width: 200 }}
                date={this.state.date}
                mode="date"
                placeholder="select date"
                format="YYYY-MM-DD"
                minDate="2016-05-01"
                maxDate="2016-06-01"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                  dateIcon: {
                    position: "absolute",
                    left: 0,
                    top: 4,
                    marginLeft: 0
                  },
                  dateInput: {
                    marginLeft: 36
                  }
                  // ... You can check the source to find the other keys.
                }}
                onDateChange={date => {
                  this.setState({ date: date });
                }}
              />
              <Text>Aloitusaika </Text>

              <TimePicker
                selectedHours={selectedHours}
                //initial Hourse value
                selectedMinutes={selectedMinutes}
                //initial Minutes value
                onChange={(hours, minutes) =>
                  this.setState({
                    selectedHours: hours,
                    selectedMinutes: minutes
                  })
                }
              />
              <Text>Loppumispäivä</Text>
              <DatePicker
                style={{ width: 200 }}
                date={this.state.date}
                mode="date"
                placeholder="select date"
                format="YYYY-MM-DD"
                minDate="2016-05-01"
                maxDate="2016-06-01"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                  dateIcon: {
                    position: "absolute",
                    left: 0,
                    top: 4,
                    marginLeft: 0
                  },
                  dateInput: {
                    marginLeft: 36
                  }
                  // ... You can check the source to find the other keys.
                }}
                onDateChange={date => {
                  this.setState({ date: date });
                }}
              />
              <Text>Loppumisaika</Text>

              <TimePicker
                selectedHours={selectedHours}
                //initial Hourse value
                selectedMinutes={selectedMinutes}
                //initial Minutes value
                onChange={(hours, minutes) =>
                  this.setState({
                    selectedHours: hours,
                    selectedMinutes: minutes
                  })
                }
              />
              <Text> Onko kyseessä? </Text>
              <RNPickerSelect
                items={sports}
                onValueChange={value => {
                  this.setState({
                    favSport0: value
                  });
                }}
                value={this.state.favSport0}
                ref={el => {
                  this.inputRefs.favSport0 = el;
                }}
              />
              <Text>Järjestävä taho</Text>
              <TextInput
                style={{
                  borderBottomColor: "red",
                  borderBottomWidth: 2,
                  marginBottom: 30
                }}
              />
              <Text>Yhteyshenkilö: Nimi</Text>

              <TextInput
                style={{
                  borderBottomColor: "red",
                  borderBottomWidth: 2,
                  marginBottom: 30
                }}
              />
              <Text>puhelin</Text>
              <TextInput
                style={{
                  borderBottomColor: "red",
                  borderBottomWidth: 2,
                  marginBottom: 30
                }}
              />
              <Text>sähköposti</Text>
              <TextInput
                style={{
                  borderBottomColor: "red",
                  borderBottomWidth: 2,
                  marginBottom: 30
                }}
              />
              <TouchableHighlight
                style={{
                  height: 40,
                  width: 160,
                  borderRadius: 10,
                  backgroundColor: "yellow",
                  marginLeft: 50,
                  marginRight: 50,
                  marginTop: 20
                }}
              >
                <Button
                  style={{
                    marginBottom: 30
                  }}
                  onPress={() => console.log(null)}
                  title="OK"
                  color="#841584"
                  accessibilityLabel="Learn more about this purple button"
                />
              </TouchableHighlight>

              <TouchableHighlight
                style={{
                  height: 40,
                  width: 160,
                  borderRadius: 10,
                  backgroundColor: "yellow",
                  marginLeft: 50,
                  marginRight: 50,
                  marginTop: 20
                }}
              >
                <Button
                  onPress={() => this.setState({ visible: false })}
                  title="Sulje"
                  color="#841584"
                  accessibilityLabel="Learn more about this purple button"
                />
              </TouchableHighlight>
            </ScrollView>
          </>
        </Overlay>
      </Page>
    );
  }
}

export default GeoJSONSource;
