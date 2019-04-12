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
import axios from 'axios'
/**/
const url = config.get("url");
const sports = [
  {
    label: "Avoin",
    value: "open"
  },
  {
    label: "Oman porukan talkoot",
    value: "private"
  }
];
const layerStyles = MapboxGL.StyleSheet.create({
  background: {
    backgroundPattern: gridPattern
  },
  smileyFace: {
    fillColor: "rgba(0,0,0 ,0.0)",
    lineColor: "green"
  }
});
const layerStyles2 = MapboxGL.StyleSheet.create({
  background: {
    backgroundPattern: gridPattern
  },
  smileyFace: {
    fillColor: "rgba(0,0,0 ,0)",
    lineColor: "red"
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
    fetch("http://192.168.50.68:8089/api/map/shores/reserved")
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        const enhancedData = responseJson.data.map(d => ({
  ...d,
  properties: { ...d.properties, key: d._key }
}))
        var data = {
          type: "FeatureCollection",
          features: enhancedData
        };
        this.setState(
          {
            json2: data
          },
          function() {}
        );
      })
      .catch(error => {
        console.error(error);
      });
    return fetch("http://192.168.50.68:8089/api/map/shores")
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        const enhancedData = responseJson.data.map(d => ({
  ...d,
  properties: { ...d.properties, key: d._key }
}))
        var data = {
          type: "FeatureCollection",
          features: enhancedData
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
  handleSubmit(e){
    var data = [];
    var reservation = {};
    reservation.startdate = this.state.date
    reservation.starttime = this.state.selectedHours + ':' + this.state.selectedMinutes
    reservation.enddate = this.state.date2
    reservation.endtime = this.state.selectedHours2 + ':' + this.state.selectedMinutes2
    reservation.type = this.state.type
    reservation.organizer = this.state.organizer
    reservation.name = this.state.name
    reservation.selected = this.state.feature.properties
    reservation.phonenumbery = this.state.phonenumbery
    reservation.email = this.state.email
    axios({
        method: 'POST',
        url: 'http://192.168.50.68:8089/api/map/reserve',

        data: reservation
      }).then(response => {


          }).catch(error => {
            console.error(error);
          });
      
    this.setState({ visible: false })
    console.log(e)
  }

  constructor(props) {
    super(props);
    this.inputRefs = {
      startdate: null,
      starttime: null,
      enddate: null,
      endtime: null,
      type: null,
      organizer: null,
      name:null,
      phonenumbery:null,
      email:null
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

      //initial Minutes
    };
  }
  getJson() {
    return this.state.json;
  }

  render() {
    console.log(MapboxGL.StyleURL)
    const { selectedHours, selectedMinutes } = this.state;
    return (
      <Page {...this.props}>
        <MapboxGL.MapView
          zoomLevel={11}
          centerCoordinate={[24.9476669, 60.1535843]}
          onSetCameraComplete={this.onUpdateZoomLevel}
          ref={ref => (this.map = ref)}
          style={sheet.matchParent}
        >
          <MapboxGL.ShapeSource
            onPress={this.onSourceLayerPress.bind(this)}
            id="smileyFaceSource"
            shape={this.state.json}
          >
            <MapboxGL.LineLayer
              id="smileyFaceFill"
              style={layerStyles.smileyFace}
            />
          </MapboxGL.ShapeSource>
          <MapboxGL.ShapeSource
            onPress={this.onSourceLayerPress.bind(this)}
            id="smileyFaceSource2"
            shape={this.state.json2}
          >
            <MapboxGL.LineLayer
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
                minDate="2019-01-01"
                maxDate="2019-06-01"
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
                minDate="2019-01-01"
                maxDate="2019-06-01"
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
                  this.setState({ date2: date });
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
                    selectedHours2: hours,
                    selectedMinutes2: minutes
                  })
                }
              />
              <Text> Onko kyseessä? </Text>
              <RNPickerSelect
                items={sports}
                onValueChange={value => {
                  this.setState({
                    type: value
                  });
                }}
                value={this.state.favSport0}
                ref={el => {
                  this.inputRefs.favSport0 = el;
                }}
              />
              <Text>Järjestävä taho</Text>
              <TextInput
              onChangeText={(organizer) => this.setState({organizer})}

                style={{
                  borderBottomColor: "red",
                  borderBottomWidth: 2,
                  marginBottom: 30
                }}
              />
              <Text>Yhteyshenkilö: Nimi</Text>

              <TextInput
              onChangeText={(name) => this.setState({name})}

                style={{
                  borderBottomColor: "red",
                  borderBottomWidth: 2,
                  marginBottom: 30
                }}
              />
              <Text>puhelin</Text>
              <TextInput
              onChangeText={(phonenumbery) => this.setState({phonenumbery})}

                style={{
                  borderBottomColor: "red",
                  borderBottomWidth: 2,
                  marginBottom: 30
                }}
              />
              <Text>sähköposti</Text>
              <TextInput
              onChangeText={(email) => this.setState({email})}

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
                  onPress={() => this.handleSubmit()}
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
