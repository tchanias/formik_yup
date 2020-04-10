import React from "react";
import { WizardContext } from "../../WizardContext";

export default function FormikStepper() {
  const wizard = React.useContext(WizardContext);
  return (
    <div className={"stepper"}>
      <div
        className={
          wizard.step.matches("personal")
            ? "stepper_prev no-visibility no-text-select"
            : "stepper_prev no-text-select"
        }
        onClick={() => {
          if (!wizard.step.matches("personal")) {
            wizard.setStep("PREV");
          }
        }}
      >
        Prev
      </div>
      <div className={"stepper_text"}>
        Step {wizard.steps.indexOf(wizard.step.value) + 1} of{" "}
        {wizard.steps.length}
      </div>
      <div
        className={
          wizard.step.value === wizard.steps[wizard.steps.length - 1]
            ? "stepper_next no-visibility no-text-select"
            : "stepper_next no-text-select"
        }
        onClick={() => {
          if (!wizard.step.matches("step4")) {
            wizard.setStep("NEXT");
          }
        }}
      >
        Next
      </div>
    </div>
  );
}
