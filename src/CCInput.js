import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ViewPropTypes,
} from "react-native";

const s = StyleSheet.create({
  baseInputStyle: {
    color: "black",
    borderWidth: 2,
    marginTop: 10,
    backgroundColor: "#f6f6f6",
    height : 55

  },
});

export default class CCInput extends Component {
  static propTypes = {
    field: PropTypes.string.isRequired,
    label: PropTypes.string,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    keyboardType: PropTypes.string,

    status: PropTypes.oneOf(["valid", "invalid", "incomplete"]),

    containerStyle: ViewPropTypes.style,
    inputStyle: Text.propTypes.style,
    labelStyle: Text.propTypes.style,
    validColor: PropTypes.string,
    invalidColor: PropTypes.string,
    placeholderColor: PropTypes.string,

    onFocus: PropTypes.func,
    onChange: PropTypes.func,
    onBecomeEmpty: PropTypes.func,
    onBecomeValid: PropTypes.func,
    additionalInputProps: PropTypes.shape(TextInput.propTypes),
  };

  static defaultProps = {
    label: "",
    value: "",
    status: "incomplete",
    containerStyle: {},
    inputStyle: {},
    labelStyle: {},
    onFocus: () => { },
    onChange: () => { },
    onBecomeEmpty: () => { },
    onBecomeValid: () => { },
    additionalInputProps: {},
  };

  state = {
    isActive: false
  }

  componentWillReceiveProps = newProps => {
    const { status, value, onBecomeEmpty, onBecomeValid, field } = this.props;
    const { status: newStatus, value: newValue } = newProps;

    if (value !== "" && newValue === "") onBecomeEmpty(field);
    if (status !== "valid" && newStatus === "valid") onBecomeValid(field);
  };

  focus = () => this.refs.input.focus();

  _onFocus = () => {
    this.setState({ isActive: true })
    this.props.onFocus(this.props.field)
  };

  _onBlur = () => {
    this.setState({ isActive: false })
  };

  _onChange = value => this.props.onChange(this.props.field, value);

  render() {
    const { label, value, placeholder, status, keyboardType,
      containerStyle, inputStyle, labelStyle,
      validColor, invalidColor, placeholderColor,
      editable,
      additionalInputProps } = this.props;
    return (
      <TouchableOpacity onPress={this.focus}
        activeOpacity={0.99}>
        <View style={[containerStyle]}>
          {!!label && <Text style={[labelStyle]}>{label}</Text>}

          <TextInput ref="input"
            {...additionalInputProps}
            keyboardType={keyboardType}
            autoCapitalise="words"
            editable={editable}
            autoCorrect={false}
            style={[
              s.baseInputStyle,
              inputStyle,
              ((validColor && status === "valid") ? { color: validColor } :
                (invalidColor && status === "invalid") ? { color: invalidColor } :
                  {}),
              { borderColor: this.state.isActive ? "black" : "transparent" }
            ]}
            underlineColorAndroid={"transparent"}
            placeholderTextColor={placeholderColor}
            placeholder={placeholder}
            value={(editable == false ? "•••• " : "") + value}
            onFocus={this._onFocus}
            onBlur={this._onBlur}
            onChangeText={this._onChange} />
        </View>
      </TouchableOpacity>
    );
  }
}
