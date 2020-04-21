import React from "react";
import FormikPersonalForm from "../FormikPersonalForm/FormikPersonalForm";
import { WizardContext } from "../../WizardContext";
import FormikStepper from "../FormikStepper/FormikStepper";
import FormikWorkForm from "../FormikWorkForm/FormikWorkForm";
import FormikCompanyForm from "../FormikCompanyForm/FormikCompanyForm";
import FormikAccountForm from "../FormikAccountForm/FormikAccountForm";
import { useMachine } from "@xstate/react";
import { wizardState } from "../../WizardContext";

export default function Wizard() {
  const [current, send] = useMachine(wizardState);

  const [contextValues, setContextValues] = React.useState({
    step: current,
    steps: ["personal", "work", "company", "account"],
    valid: current.context.valid,
    devMode: false,
    setStep: (direction) => {
      send(direction);
    },
    setValid: (status, ff) => {
      if (status) {
        send("VALID");
      } else {
        send("INVALID");
      }
    },
  });

  React.useEffect(() => {
    console.log("current: ", current);
    setContextValues({
      ...contextValues,
      step: current,
      valid: current.context.valid,
    });
  }, [current]);

  const FinishMessage = function () {
    return (
      <div className={"finish"}>
        <div className={"finish_message"}>Thank you for signing up!</div>
        <div
          className={"finish_refresh"}
          onClick={() => window.location.reload()}
        >
          Refresh
        </div>
      </div>
    );
  };

  const FormToggle = function ({ children }) {
    return React.Children.map(children, (child, index) => {
      if (
        child.props.check === "stepper" &&
        contextValues.step.value !== "finish"
      ) {
        return React.cloneElement(child);
      } else if (child.props.check === contextValues.step.value) {
        return React.cloneElement(child);
      }
    });
  };
  return (
    <WizardContext.Provider value={contextValues}>
      <FormToggle>
        <FormikStepper check={"stepper"} />
        <FormikPersonalForm check={"personal"} />
        <FormikWorkForm check={"work"} />
        <FormikCompanyForm check={"company"} />
        <FormikAccountForm check={"account"} />
        <FinishMessage check={"finish"} />
      </FormToggle>
    </WizardContext.Provider>
  );
}
