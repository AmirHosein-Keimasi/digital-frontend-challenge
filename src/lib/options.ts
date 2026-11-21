import type { Step1Data } from "./schemas";

export const inspectionTypeLabels: Record<Step1Data["inspectionType"], string> = {
  routine: "روتین",
  emergency: "اضطراری",
  follow_up: "پیگیری",
};
