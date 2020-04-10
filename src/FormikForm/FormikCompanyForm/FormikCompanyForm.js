import React, { useState, useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { WizardContext } from "../../WizardContext";

export default function FormikForm(props) {
  const wizard = useContext(WizardContext);
  const dev = wizard.devMode;
  const formName = wizard.steps[2];

  const [formState, setFormState] = useState({
    title: dev ? "Render Simple" : "",
    field: dev ? "Technology" : "",
    otherText: dev ? "Other" : "",
    volume: dev ? "50" : "",
    budget: dev ? "10000000" : "",
    website: dev ? "https://ff.ff" : "",
  });

  const companySchema = yup.object().shape({
    title: yup
      .string()
      .min(2, "Job title value too Short!")
      .max(30, "Job title value too Long!")
      .required("Required"),
    field: yup.string().required("Required"),
    otherText: yup.string().when("field", {
      is: "Other",
      then: yup.string().required(),
    }),
    volume: yup.string().required("Required"),
    budget: yup
      .number()
      .when("volume", {
        is: (val) => parseInt(val) > 50 && parseInt(val) <= 100,
        then: yup
          .number()
          .min(
            5000000,
            `The company's yearly budget cannot be less than 5.000.000€`
          ),
      })
      .when("volume", {
        is: (val) => parseInt(val) > 100,
        then: yup
          .number()
          .min(
            10000000,
            `The company's yearly budget cannot be less than 10.000.000€`
          ),
      }),
    website: yup.string().url(),
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
    if (wizard.valid.includes(formName)) {
      wizard.setValid(false);
    }
    await setFormState({
      ...formState,
      [field]: event.target.value,
    });
  };

  const findNextIncompleteStep = function () {
    let nextIncompleteStep = "";
    let currentStepPassed = false;
    for (let i = 0; i < wizard.steps.length; i++) {
      if (formName === wizard.steps[i] && !currentStepPassed) {
        currentStepPassed = true;
        continue;
      } else if (currentStepPassed && !wizard.valid.includes(wizard.steps[i])) {
        nextIncompleteStep = wizard.steps[i];
        break;
      } else {
        continue;
      }
    }
    return nextIncompleteStep;
  };

  return wizard.step.matches(formName) ? (
    <div className="form">
      <div className="step-completed">
        {wizard.valid.includes(wizard.step.value)
          ? "Step Completed!"
          : "Step not completed yet!"}
      </div>
      <div className={"form_heading"}>Enter your company details here</div>
      <Formik
        initialValues={{
          title: formState.title,
          field: formState.field,
          otherText: formState.otherText,
          volume: formState.volume,
          budget: formState.budget,
          website: formState.website,
        }}
        initialStatus={false}
        validationSchema={companySchema}
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
                <label htmlFor="title">Company Title</label>
                <Field
                  type="text"
                  name="title"
                  placeholder="Your Company's Title"
                  onChangeCapture={(event) =>
                    handleFieldChange(
                      props.values,
                      event,
                      "title",
                      props.handleChange,
                      props.isValid
                    )
                  }
                />
              </div>
              <ErrorMessage
                name="title"
                component="div"
                className="input-feedback"
              />
            </div>
            <div className="form_field">
              <div className="form_field_elements">
                <label htmlFor="field">Field</label>
                <Field
                  name="field"
                  as="select"
                  placeholder="Your Company's field of activity"
                  onChange={(event) =>
                    handleFieldChange(
                      props.values,
                      event,
                      "field",
                      props.handleChange,
                      props.isValid
                    )
                  }
                >
                  <option value="Tourism">Tourism</option>
                  <option value="Technology">Science and Technology</option>
                  <option value="Economy">Economy</option>
                  <option value="Education">Education</option>
                  <option value="Health">Health</option>
                  <option value="Entertainment">
                    Sports and Entertainment
                  </option>
                  <option value="Other">Other*</option>
                </Field>
              </div>
              <ErrorMessage
                name="field"
                component="div"
                className="input-feedback"
              />
            </div>

            <div
              className="form_secondary"
              style={formState.field !== "Other" ? { display: "none" } : {}}
            >
              <div className="form_field">
                <div className="form_field_elements">
                  <label htmlFor="otherText">Field of activity</label>
                  <Field
                    type="text"
                    name="otherText"
                    placeholder="Your Company's field of activity"
                    onChangeCapture={(event) =>
                      handleFieldChange(
                        props.values,
                        event,
                        "otherText",
                        props.handleChange,
                        props.isValid
                      )
                    }
                  />
                </div>
                <ErrorMessage
                  name="otherText"
                  component="div"
                  className="input-feedback"
                />
              </div>
            </div>

            <div className="form_field">
              <div className="form_field_elements">
                <label htmlFor="volume">
                  Company's Volume(no. of employees)
                </label>
                <Field
                  name="volume"
                  as="select"
                  placeholder="Your Company's Volume"
                  onChange={(event) =>
                    handleFieldChange(
                      props.values,
                      event,
                      "volume",
                      props.handleChange,
                      props.isValid
                    )
                  }
                >
                  <option value="10">0-10</option>
                  <option value="30">10-30</option>
                  <option value="50">30-50</option>
                  <option value="100">50-100*</option>
                  <option value="101">100+*</option>
                </Field>
              </div>
              <ErrorMessage
                name="volume"
                component="div"
                className="input-feedback"
              />
            </div>
            <div
              className="form_secondary"
              style={
                !formState.volume || parseInt(formState.volume) <= 50
                  ? { display: "none" }
                  : {}
              }
            >
              <div className="form_field">
                <div className="form_field_elements">
                  <label htmlFor="budget">Company's budget</label>
                  <Field
                    type="number"
                    name="budget"
                    placeholder="Your Company's yearly budget"
                    onChangeCapture={(event) =>
                      handleFieldChange(
                        props.values,
                        event,
                        "budget",
                        props.handleChange,
                        props.isValid
                      )
                    }
                  />
                </div>
                <ErrorMessage
                  name="budget"
                  component="div"
                  className="input-feedback"
                />
              </div>
            </div>
            <div className="form_field">
              <div className="form_field_elements">
                <label htmlFor="website">Website (url)</label>
                <Field
                  name="website"
                  placeholder="Your Company's website"
                  onChange={(event) =>
                    handleFieldChange(
                      props.values,
                      event,
                      "website",
                      props.handleChange,
                      props.isValid
                    )
                  }
                />
              </div>
              <ErrorMessage
                name="website"
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
