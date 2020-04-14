import React, { useState, useEffect, useContext } from "react";
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  //  useFormikContext
} from "formik";
import * as yup from "yup";
// import FormikContext from "./FormikContext/FormikContext";
import FormikPhoneInput from "../PhoneInput/FormikPhoneInput";
import { findNumbers } from "libphonenumber-js";
import { WizardContext } from "../../WizardContext";
import { ReactComponent as Tick } from "../../assets/tick.svg";
import { ReactComponent as Cancel } from "../../assets/delete.svg";

export default function FormikPersonalForm(props) {
  const wizard = useContext(WizardContext);
  const dev = wizard.devMode;
  const formName = wizard.steps[0];
  const [stateValid, setStateValid] = useState(false);
  // const [displayContextValues, setDisplayContextValues] = useState(false);
  const [formState, setFormState] = useState({
    name: dev ? "John" : "",
    lastName: dev ? "Wilson" : "",
    email: dev ? "jwill@gmail.com" : "",
    phone: dev ? "+306955651040" : "",
    afm: dev ? "123456789" : "",
    amka: dev ? "12345678901" : "",
  });
  useEffect(() => {
    Promise.resolve(SignupSchema.isValid(formState))
      .then((res) => {
        if (res && numberExists(formState.phone)) {
          setStateValid(res);
        } else {
          setStateValid(false);
        }
        return res;
      })
      .catch((error) => {
        setStateValid(false);
      });
  }, [formState]);

  const SignupSchema = yup.object().shape({
    name: yup
      .string()
      .min(2, "Name value too Short!")
      .max(70, "Name value too Long!")
      .required("Required"),
    lastName: yup
      .string()
      .min(2, "Last name value too Short!")
      .max(70, "Last name value too Long!")
      .required("Required"),
    email: yup.string().email("Invalid email").required("Required"),
    phone: yup
      .string()
      .min(10, "Phone value too Short!")
      .max(16, "Phone value too Long!")
      .required(),
  });

  const secondaryInfoSchema = yup.object().shape({
    afm: yup
      .number()
      .test(
        "len",
        "AFM should be 9-digits long",
        (val) => val && val.toString().length === 9
      )
      .required(),
    amka: yup
      .number()
      .test(
        "len",
        "AMKA should be 11-digits long",
        (val) => val && val.toString().length === 11
      )
      .required(),
  });

  const schema = stateValid
    ? SignupSchema.concat(secondaryInfoSchema)
    : SignupSchema;

  const handleFieldChange = async function (
    fieldValues,
    event,
    field,
    formikChange,
    isValid
  ) {
    if (field !== "phone") {
      event.persist();
    }
    if (wizard.valid.includes(formName)) {
      await wizard.setValid(false);
    }
    await formikChange(event);
    await setFormState({
      ...formState,
      [field]: event.target.value,
    });
  };

  const numberExists = function (num) {
    let found = findNumbers(
      num ? (num.includes("+") ? num : "+" + num) : "",
      "",
      {
        v2: true,
      }
    );
    return found && found.length > 0;
  };

  // const findNextIncompleteStep = function () {
  //   let nextIncompleteStep = "";
  //   let currentStepPassed = false;
  //   for (let i = 0; i < wizard.steps.length; i++) {
  //     if (formName === wizard.steps[i] && !currentStepPassed) {
  //       currentStepPassed = true;
  //       continue;
  //     } else if (currentStepPassed && !wizard.valid.includes(wizard.steps[i])) {
  //       nextIncompleteStep = wizard.steps[i];
  //       break;
  //     } else {
  //       continue;
  //     }
  //   }
  //   return nextIncompleteStep;
  // };

  const findNextIncompleteStep = function () {
    let currentStepPassed = false;
    let nextIncompleteStep = wizard.steps.find((form) => {
      if (currentStepPassed && !wizard.valid.includes(form)) {
        return form;
      }
      if ((formName === form) & !currentStepPassed) {
        currentStepPassed = true;
      }
    });
    return nextIncompleteStep;
  };

  return (
    <div className="form">
      <div className="step-completed">
        {wizard.valid.includes(wizard.step.value) ? <Tick /> : <Cancel />}
      </div>
      <div className={"form_heading"}>Enter your personal details here</div>
      <Formik
        initialValues={{
          email: formState.email,
          name: formState.name,
          lastName: formState.lastName,
          phone: formState.phone,
          afm: formState.afm,
          amka: formState.amka,
        }}
        initialStatus={false}
        validationSchema={schema}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(async () => {
            await wizard.setValid(true);
            let goToStep = findNextIncompleteStep();
            if (goToStep) {
              await wizard.setStep(goToStep);
            }
            setSubmitting(false);
          }, 400);
        }}
      >
        {(props) => (
          <Form className={"form_container"}>
            <div className="form_field">
              <div className="form_field_elements">
                <label htmlFor="name">Name</label>
                <Field
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  onChangeCapture={(event) =>
                    handleFieldChange(
                      props.values,
                      event,
                      "name",
                      props.handleChange,
                      props.isValid
                    )
                  }
                />
              </div>
              <ErrorMessage
                name="name"
                component="div"
                className="input-feedback"
              />
            </div>
            <div className="form_field">
              <div className="form_field_elements">
                <label htmlFor="lastName">Last Name</label>
                <Field
                  type="text"
                  name="lastName"
                  placeholder="Your Last name"
                  onChange={(event) =>
                    handleFieldChange(
                      props.values,
                      event,
                      "lastName",
                      props.handleChange,
                      props.isValid
                    )
                  }
                />
              </div>
              <ErrorMessage
                name="lastName"
                component="div"
                className="input-feedback"
              />
            </div>
            <div className="form_field">
              <div className="form_field_elements">
                <label htmlFor="email">Email</label>
                <Field
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  onChange={(event) =>
                    handleFieldChange(
                      props.values,
                      event,
                      "email",
                      props.handleChange,
                      props.isValid
                    )
                  }
                />
              </div>
              <ErrorMessage
                name="email"
                component="div"
                className="input-feedback"
              />
            </div>
            <div className="form_field">
              <div className="form_field_elements">
                <label htmlFor="phone">Phone</label>
                <FormikPhoneInput
                  value={props.values.phone}
                  name={"phone"}
                  onChange={(event) =>
                    handleFieldChange(
                      props.values,
                      event,
                      "phone",
                      props.handleChange,
                      props.isValid
                    )
                  }
                />
              </div>
              <ErrorMessage
                name="phone"
                component="div"
                className="input-feedback"
              />
            </div>

            {stateValid ? (
              <div className="form_secondary">
                <div className="form_field">
                  <div className="form_field_elements">
                    <label htmlFor="email">AFM</label>
                    <Field
                      type="number"
                      name="afm"
                      placeholder="Your AFM number"
                      onChange={(event) =>
                        handleFieldChange(
                          props.values,
                          event,
                          "afm",
                          props.handleChange,
                          props.isValid
                        )
                      }
                    />
                  </div>
                  <ErrorMessage
                    name="afm"
                    component="div"
                    className="input-feedback"
                  />
                </div>
                <div className="form_field">
                  <div className="form_field_elements">
                    <label htmlFor="email">AMKA</label>
                    <Field
                      type="number"
                      name="amka"
                      placeholder="Your AMKA number"
                      onChange={(event) =>
                        handleFieldChange(
                          props.values,
                          event,
                          "amka",
                          props.handleChange,
                          props.isValid
                        )
                      }
                    />
                  </div>
                  <ErrorMessage
                    name="amka"
                    component="div"
                    className="input-feedback"
                  />
                </div>
              </div>
            ) : null}

            <div className={"form_buttons"}>
              {/* <button
                type="button"
                className="outline"
                onClick={() => setDisplayContextValues(!displayContextValues)}
              >
                Toggle Context
              </button> */}
              {/* <button
                type="button"
                className="outline"
                onClick={props.handleReset}
              >
                Reset
              </button> */}
              <button type="submit" disabled={props.isSubmitting}>
                Submit
              </button>
            </div>
            {/* <FormikContext
              getState={useFormikContext}
              displayContextValues={displayContextValues}
            />
            <div
              className={
                !displayContextValues
                  ? "context-values"
                  : "no-display context-values"
              }
            >
              <div className={"text"}>
                {!displayContextValues ? JSON.stringify(wizard) : null}
              </div>
            </div> */}
          </Form>
        )}
      </Formik>
    </div>
  );
}
