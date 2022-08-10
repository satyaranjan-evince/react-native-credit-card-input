import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactNative, {
  NativeModules,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TextInput,
  ViewPropTypes,
} from "react-native";

import CreditCard from "./CardView";
import CCInput from "./CCInput";
import { InjectedProps } from "./connectToState";
import defaultIcons from "./Icons";
import { Image } from "react-native";
import { Icon } from "react-native-elements";
import CountryPicker from 'react-native-country-picker-modal';
import { TouchableOpacity } from "react-native";

const s = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  countryPicker: {
    color: "black",
    padding: 10,
    justifyContent:'center',
    marginTop: 10,
    backgroundColor: "#f6f6f6",
    width: "100%",
    height : 55
  },
  form: {
    marginTop: 5,
    // marginLeft: -60,
    width: "100%"
  },
  inputContainer: {
    marginVertical: 10,
  },
  inputLabel: {
    fontWeight: "bold",
    color: "black"
  },
  input: {
    height: 40,
  },
  icon: {
    position: "absolute",
    top: 50,
    left: 10,
    width: 40,
    height: 30,
    resizeMode: "contain",
    zIndex: 2
  },
  errorMessage: {
    fontSize: 12,
    color: "red",
  }
});

const CVC_INPUT_WIDTH = Dimensions.get("window").width / 2 - 10;
const EXPIRY_INPUT_WIDTH = CVC_INPUT_WIDTH;
const CARD_NUMBER_INPUT_WIDTH_OFFSET = 40;
const CARD_NUMBER_INPUT_WIDTH = "100%";
const NAME_INPUT_WIDTH = CARD_NUMBER_INPUT_WIDTH;
const PREVIOUS_FIELD_OFFSET = 40;
const POSTAL_CODE_INPUT_WIDTH = 120;

/* eslint react/prop-types: 0 */ // https://github.com/yannickcr/eslint-plugin-react/issues/106
export default class CreditCardInput extends Component {
  static propTypes = {
    ...InjectedProps,
    labels: PropTypes.object,
    placeholders: PropTypes.object,

    labelStyle: Text.propTypes.style,
    inputStyle: Text.propTypes.style,
    inputContainerStyle: ViewPropTypes.style,

    validColor: PropTypes.string,
    invalidColor: PropTypes.string,
    placeholderColor: PropTypes.string,

    cardImageFront: PropTypes.number,
    cardImageBack: PropTypes.number,
    cardScale: PropTypes.number,
    cardFontFamily: PropTypes.string,
    cardBrandIcons: PropTypes.object,

    allowScroll: PropTypes.bool,

    additionalInputsProps: PropTypes.objectOf(PropTypes.shape(TextInput.propTypes)),
  };

  static defaultProps = {
    cardViewSize: {},
    labels: {
      name: "CARDHOLDER'S NAME",
      number: "Card Number",
      expiry: "Exp. Date",
      cvc: "CVV",
      postalCode: "Zip Code",
    },
    placeholders: {
      name: "Full Name",
      number: "1234 5678 1234 5678",
      expiry: "MM/YY",
      cvc: "123",
      postalCode: "34567",
    },
    inputContainerStyle: {
      borderBottomWidth: 0,
      borderBottomColor: "red",
    },
    validColor: "",
    invalidColor: "red",
    placeholderColor: "gray",
    allowScroll: false,
    additionalInputsProps: {},
  };

  state = {
    pickerVisible: false,
    dialCode: "",
    code: ""
  }
  componentDidMount = () => {
    this._focus(this.props.focused)
    if (this.props.dialCode !== undefined) {
      this.setState({ dialCode: this.props.dialCode })
    }

  };

  onCountrySelect = country => {
    this.setState({
      code: country.cca2, dialCode: country.cca2
    })
    this.props.onCountrySelect !== undefined ?
      this.props.onCountrySelect(country) : {}
  }


  componentWillReceiveProps = newProps => {
    if (this.props.focused !== newProps.focused) this._focus(newProps.focused);

    if (newProps.dialCode !== undefined) {
      this.setState({ dialCode: newProps.dialCode })
    }


  };

  _focus = field => {
    if (!field) return;

    const scrollResponder = this.refs.Form.getScrollResponder();
    const nodeHandle = ReactNative.findNodeHandle(this.refs[field]);

    NativeModules.UIManager.measureLayoutRelativeToParent(nodeHandle,
      e => { throw e; },
      x => {
        scrollResponder.scrollTo({ x: Math.max(x - PREVIOUS_FIELD_OFFSET, 0), animated: true });
        this.refs[field].focus();
      });
  }

  _inputProps = field => {
    const {
      inputStyle, labelStyle, validColor, invalidColor, placeholderColor,
      placeholders, labels, values, status,
      onFocus, onChange, onBecomeEmpty, onBecomeValid,
      additionalInputsProps,
    } = this.props;

    return {
      inputStyle: [s.input, inputStyle],
      labelStyle: [s.inputLabel, labelStyle],
      validColor, invalidColor, placeholderColor,
      ref: field, field,

      label: labels[field],
      placeholder: placeholders[field],
      value: values[field],
      status: status[field],

      onFocus, onChange, onBecomeEmpty, onBecomeValid,

      additionalInputProps: additionalInputsProps[field],
    };
  };

  render() {
    const {
      cardImageFront, cardImageBack, inputContainerStyle,
      values: { number, expiry, cvc, name, type }, focused,
      allowScroll, requiresName, requiresCVC, requiresPostalCode, requiresCountry, isReadOnly,
      cardScale, cardFontFamily, cardBrandIcons,
    } = this.props;
    const Icons = { ...defaultIcons };
    return (
      <View style={s.container}>
        {/* <CreditCard focused={focused}
          brand={type}
          scale={cardScale}
          fontFamily={cardFontFamily}
          imageFront={cardImageFront}
          imageBack={cardImageBack}
          customIcons={cardBrandIcons}
          name={requiresName ? name : " "}
          number={number}
          expiry={expiry}
          cvc={cvc} /> */}

        <ScrollView ref="Form"
          // horizontal

          keyboardShouldPersistTaps="always"
          scrollEnabled={allowScroll}
          showsHorizontalScrollIndicator={false}
          style={s.form}>
          <Image style={[s.icon]}
            source={Icons[type] || Icons['placeholder']} />
          {isReadOnly ?
            // <Text
            // // keyboardType="numeric"
            // inputStyle={{ paddingLeft: 60 }}
            // style={[s.inputContainer, inputContainerStyle, { width: CARD_NUMBER_INPUT_WIDTH }]}
            // >TEST</Text>
            <CCInput {...this._inputProps("number")}
              editable={false}
              invalidColor="black"
              keyboardType="numeric"
              inputStyle={{ paddingLeft: 60 }}
              containerStyle={[s.inputContainer, inputContainerStyle, { width: CARD_NUMBER_INPUT_WIDTH }]} />
            :
            <CCInput {...this._inputProps("number")}
              keyboardType="numeric"
              inputStyle={{ paddingLeft: 60 }}
              containerStyle={[s.inputContainer, inputContainerStyle, { width: CARD_NUMBER_INPUT_WIDTH }]} />
          }
          {this.props.isCardError ?
            <Text style={s.errorMessage}>{this.props.errorMessage}</Text> : null}
          <View style={{ flexDirection: 'row' }}>

            <CCInput {...this._inputProps("expiry")}
              keyboardType="numeric"
              inputStyle={{ paddingLeft: 10 }}
              containerStyle={[s.inputContainer, inputContainerStyle, { width: (isReadOnly ? Dimensions.get("window").width - 20 : EXPIRY_INPUT_WIDTH - 10)  }]} />


            {requiresCVC &&
              <CCInput {...this._inputProps("cvc")}
                keyboardType="numeric"
                inputStyle={{ paddingLeft: 10 }}
                containerStyle={[s.inputContainer, inputContainerStyle, { width: CVC_INPUT_WIDTH - 10, marginLeft: 20 }]} />}
          </View>
          <View style={{ flexDirection: 'row' }}>
            {this.props.isExpiryError ?
              <Text style={s.errorMessage}>{this.props.errorMessage}</Text> : null}
            {this.props.isCVCError ?
              <Text style={[s.errorMessage, { marginLeft: EXPIRY_INPUT_WIDTH + 20 }]}>{this.props.errorMessage}</Text> : null}
          </View>
          {requiresCountry &&
            <>
              <Text style={[s.inputLabel, { marginTop: 5 }]}>{"Country"}</Text>
              <CountryPicker
                countryCodes={this.props.countryData !== undefined && this.props.countryData[0] !== undefined ? this.props.countryData.map(data => data.iso) : []}
                withFilter
                withCountryNameButton
                withAlphaFilter={false}
                withCallingCode={false}
                withEmoji

                visible={this.state.pickerVisible}
                onClose={() => this.setState({ pickerVisible: false })}
                countryCode={this.state.dialCode}
                preferredCountries={this.props.countryData !== undefined && this.props.countryData[0] !== undefined ? [this.props.countryData.map(data => data.iso)[0]] : []}
                onSelect={this.onCountrySelect}
                containerButtonStyle={s.countryPicker}

              // renderFlagButton={() => {
              //   return <TouchableOpacity
              //     disabled={this.props.editableBox !== undefined &&
              //       this.props.editableBox === false
              //       ? true
              //       : false}
              //     onPress={() => { this.setState({ pickerVisible: true }) }}>
              //     <Text
              //       style={[s.countryPicker,this.props.codeTextStyle,]}
              //     >{this.state.dialCode.includes("+") ? this.props.dialCode : ("+" + this.state.dialCode)}</Text>
              //   </TouchableOpacity>
              // }}

              />
              <Icon onPress={() => { this.setState({ pickerVisible: true }) }} name="arrow-drop-down" color={"#999999"} size={30} containerStyle={{ alignSelf: "flex-end", marginTop: -42.5, marginBottom: 15, zIndex: 1, marginRight: 10 }} />
            </>}
          {this.props.isCountryError ?
            <Text style={s.errorMessage}>{this.props.errorMessage}</Text> : null}
          {requiresName &&
            <CCInput {...this._inputProps("name")}
              containerStyle={[s.inputContainer, inputContainerStyle, { width: NAME_INPUT_WIDTH }]} />}
          {requiresPostalCode &&
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {/* <Icon name="location-on" size={24} color={"gray"} containerStyle={{ marginRight: -25 }} /> */}
              <CCInput {...this._inputProps("postalCode")}
                keyboardType="numeric"
                inputStyle={{ paddingLeft: 10 }}
                containerStyle={[s.inputContainer, inputContainerStyle, { width: POSTAL_CODE_INPUT_WIDTH }]} />
            </View>
          }
          {this.props.isPostalError ?
            <Text style={s.errorMessage}>{this.props.errorMessage}</Text> : null}
        </ScrollView>
      </View >
    );
  }
}
