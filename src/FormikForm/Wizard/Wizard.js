import React from "react";
import FormikForm from "../FormikForm";
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
    devMode: true,
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
    setContextValues({
      ...contextValues,
      step: current,
      valid: current.context.valid,
    });
  }, [current]);

  return (
    <WizardContext.Provider value={contextValues}>
      <FormikStepper />
      <FormikForm />
      <FormikWorkForm />
      <FormikCompanyForm />
      <FormikAccountForm />
    </WizardContext.Provider>
  );
}
