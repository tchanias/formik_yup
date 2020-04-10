import React from "react";

export default function FormikContext(props) {
  const state = props.getState;
  const displayContextValues = props.displayContextValues;
  return (
    <div
      className={
        displayContextValues ? "context-values" : "no-display context-values"
      }
    >
      <div className="text">{JSON.stringify(state())}</div>
    </div>
  );
}
