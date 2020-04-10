import React from "react";
// import PropTypes from "prop-types";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function FormikPhoneInput(props) {
  const phone = props.value;
  const name = props.name;
  const onChange = props.onChange;

  return (
    <PhoneInput
      country={"gr"}
      id="bootstrap-input11"
      dropdownClass={"phone-number-country"}
      inputClass={"phone-number-input"}
      // containerClass={
      //   validations.phone !== ""
      //     ? "error-field react-tel-input"
      //     : "react-tel-input"
      // }
      value={phone}
      autoFormat={false}
      // enableSearch={true}
      onChange={(value) => onChange({ target: { value: value, name: name } })}
    />
  );
}
