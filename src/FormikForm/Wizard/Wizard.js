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

  const finishMessage = function () {
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
  return (
    <WizardContext.Provider value={contextValues}>
      {contextValues.step.value !== "finish" ? <FormikStepper /> : null}
      {contextValues.step.value === "personal" ? <FormikPersonalForm /> : null}
      {contextValues.step.value === "work" ? <FormikWorkForm /> : null}
      {contextValues.step.value === "company" ? <FormikCompanyForm /> : null}
      {contextValues.step.value === "account" ? <FormikAccountForm /> : null}
      {contextValues.step.value === "finish" ? finishMessage() : null}
    </WizardContext.Provider>
  );
}
