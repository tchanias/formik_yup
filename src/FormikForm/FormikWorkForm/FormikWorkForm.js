import React, { useState, useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { WizardContext } from "../../WizardContext";

export default function FormikForm(props) {
  const wizard = useContext(WizardContext);
  const dev = wizard.devMode;
  const formName = wizard.steps[1];
  const [formState, setFormState] = useState({
    title: dev ? "Developer" : "",
    team: dev ? 10 : "",
    methodology: dev ? "Agile" : "",
    description: dev ? "description" : "",
  });

  const workSchema = yup.object().shape({
    title: yup
      .string()
      .min(2, "Job title value too Short!")
      .max(30, "Job title value too Long!")
      .required("Required"),
    team: yup
      .number()
      .min(2, "Team size value too Low!")
      .max(70, "Team size value too High!")
      .required("Required"),
    methodology: yup.string().required("Required"),
    description: yup.string(),
  });

  const handleFieldChange = async function (
    fieldValues,
    event,
    field,
    formikChange,
    isValid
  ) {
    event.persist();
    if (wizard.valid.includes(formName)) {
      wizard.setValid(false);
    }
    await formikChange(event);
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
      <div className={"form_heading"}>Enter your work details here</div>
      <Formik
        initialValues={{
          title: formState.title,
          team: formState.team,
          methodology: formState.methodology,
          description: formState.description,
        }}
        initialStatus={false}
        validationSchema={workSchema}
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
                <label htmlFor="title">Job Title</label>
                <Field
                  type="text"
                  name="title"
                  placeholder="Your Job Title"
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
                <label htmlFor="team">Team Size(employees)</label>
                <Field
                  type="number"
                  name="team"
                  placeholder="Your Team's size"
                  onChange={(event) =>
                    handleFieldChange(
                      props.values,
                      event,
                      "team",
                      props.handleChange,
                      props.isValid
                    )
                  }
                />
              </div>
              <ErrorMessage
                name="team"
                component="div"
                className="input-feedback"
              />
            </div>
            <div className="form_field">
              <div className="form_field_elements">
                <label htmlFor="methodology">Work Methodology</label>
                <Field
                  name="methodology"
                  as="select"
                  placeholder="Your Work Methodology"
                  onChange={(event) =>
                    handleFieldChange(
                      props.values,
                      event,
                      "methodology",
                      props.handleChange,
                      props.isValid
                    )
                  }
                >
                  <option value="None">N/A</option>
                  <option value="Agile">Agile</option>
                  <option value="Waterfall">Waterfall</option>
                  <option value="Kanban">Kanban</option>
                  <option value="Scrum">Scrum</option>
                </Field>
              </div>
              <ErrorMessage
                name="methodology"
                component="div"
                className="input-feedback"
              />
            </div>
            <div className="form_field">
              <div className="form_field_elements">
                <label htmlFor="description">Job description(optional)</label>
                <Field
                  name="description"
                  as="textarea"
                  placeholder="Your Job description"
                  onChange={(event) =>
                    handleFieldChange(
                      props.values,
                      event,
                      "description",
                      props.handleChange,
                      props.isValid
                    )
                  }
                />
              </div>
              <ErrorMessage
                name="description"
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
