import React, { useState, useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { WizardContext } from "../../WizardContext";

export default function FormikForm(props) {
  const wizard = useContext(WizardContext);
  const dev = wizard.devMode;
  const formName = wizard.steps[3];
  const [formState, setFormState] = useState({
    username: dev ? "johnW" : "",
    password: dev ? "!1Qqaaaa" : "",
    confirm: dev ? "!1Qqaaaa" : "",
  });

  const accountSchema = yup.object().shape({
    username: yup
      .string()
      .min(2, "Job title value too Short!")
      .max(30, "Job title value too Long!")
      .required("Required"),
    password: yup
      .string()
      .required("Required")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "Must Contain at least 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character!"
      ),
    confirm: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords do not match!")
      .required("Required"),
  });

  const handleFieldChange = async function (
    fieldValues,
    event,
    field,
    formikChange,
    isValid
  ) {
    event.persist();
    await formikChange(event);
    await setFormState({
      ...formState,
      [field]: event.target.value,
    });
  };

  const searchContextForIncompleteSteps = function () {
    let firstIncompleteStep = "";
    for (let i = 0; i < wizard.steps.length - 1; i++) {
      if (!wizard.valid.includes(wizard.steps[i])) {
        firstIncompleteStep = wizard.steps[1];
        break;
      }
    }
    return firstIncompleteStep;
  };

  return wizard.step.matches(formName) ? (
    <div className="form">
      <div className={"form_heading"}>Enter your account details here</div>
      <Formik
        initialValues={{
          username: formState.username,
          password: formState.password,
          confirm: formState.confirm,
        }}
        initialStatus={false}
        validationSchema={accountSchema}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            if (wizard.valid.length === wizard.steps.length - 1) {
              wizard.setStep("finish");
              alert("Thank you for signing up!");
            } else {
              let goToStep = searchContextForIncompleteSteps();
              if (goToStep) {
                wizard.setStep(goToStep);
              }
            }
            setSubmitting(false);
          }, 400);
        }}
      >
        {(props) => (
          <Form className={"form_container"}>
            <div className="form_field">
              <div className="form_field_elements">
                <label htmlFor="username">Username</label>
                <Field
                  type="text"
                  name="username"
                  placeholder="Your username"
                  onChangeCapture={(event) =>
                    handleFieldChange(
                      props.values,
                      event,
                      "username",
                      props.handleChange,
                      props.isValid
                    )
                  }
                />
              </div>
              <ErrorMessage
                name="username"
                component="div"
                className="input-feedback"
              />
            </div>
            <div className="form_field">
              <div className="form_field_elements">
                <label htmlFor="password">Password</label>
                <Field
                  type="password"
                  name="password"
                  placeholder="Your password"
                  onChangeCapture={(event) =>
                    handleFieldChange(
                      props.values,
                      event,
                      "password",
                      props.handleChange,
                      props.isValid
                    )
                  }
                />
              </div>
              <ErrorMessage
                name="password"
                component="div"
                className="input-feedback"
              />
            </div>
            <div className="form_field">
              <div className="form_field_elements">
                <label htmlFor="confirm">Confirm Password</label>
                <Field
                  type="password"
                  name="confirm"
                  placeholder="Password confirmation"
                  onChangeCapture={(event) =>
                    handleFieldChange(
                      props.values,
                      event,
                      "confirm",
                      props.handleChange,
                      props.isValid
                    )
                  }
                />
              </div>
              <ErrorMessage
                name="confirm"
                component="div"
                className="input-feedback"
              />
            </div>
            <div className={"form_buttons"}>
              <button
                type="button"
                className="outline"
                onClick={props.handleReset}
                disabled={!props.dirty || props.isSubmitting}
              >
                Reset
              </button>
              <button type="submit" disabled={props.isSubmitting}>
                Submit
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  ) : null;
}
