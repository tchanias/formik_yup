import React from "react";
import { Machine, assign } from "xstate";
import { addToArray, filterOutStringFromArray } from "./helpers";
const contextValues = {
  step: 1,
};
export const WizardContext = React.createContext(contextValues);

export const wizardState = Machine({
  id: "formik",
  initial: "personal",
  context: {
    valid: [],
  },
  states: {
    personal: {
      on: {
        NEXT: "work",
        work: "work",
        company: "company",
        account: "account",
        VALID: {
          actions: assign({
            valid: (context) =>
              !context.valid.includes("personal")
                ? addToArray(context.valid, "personal")
                : context.valid,
          }),
        },
        INVALID: {
          actions: assign({
            valid: (context) =>
              context.valid.includes("personal")
                ? filterOutStringFromArray(context.valid, "personal")
                : context.valid,
          }),
        },
      },
    },
    work: {
      on: {
        PREV: "personal",
        NEXT: "company",
        personal: "personal",
        company: "company",
        account: "account",
        VALID: {
          actions: assign({
            valid: (context) =>
              !context.valid.includes("work")
                ? addToArray(context.valid, "work")
                : context.valid,
          }),
        },
        INVALID: {
          actions: assign({
            valid: (context) =>
              context.valid.includes("work")
                ? filterOutStringFromArray(context.valid, "work")
                : context.valid,
          }),
        },
      },
    },
    company: {
      on: {
        PREV: "work",
        NEXT: "account",
        personal: "personal",
        work: "work",
        account: "account",
        VALID: {
          actions: assign({
            valid: (context) =>
              !context.valid.includes("company")
                ? addToArray(context.valid, "company")
                : context.valid,
          }),
        },
        INVALID: {
          actions: assign({
            valid: (context) =>
              context.valid.includes("company")
                ? filterOutStringFromArray(context.valid, "company")
                : context.valid,
          }),
        },
      },
    },
    account: {
      on: {
        PREV: "company",
        personal: "personal",
        work: "work",
        company: "company",
        finish: "finish",
      },
    },
    finish: {
      type: "final",
    },
  },
});
