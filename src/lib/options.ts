import type { FindingItem, Step1Data } from "./schemas";

export const inspectionTypeLabels: Record<Step1Data["inspectionType"], string> = {
  routine: "روتین",
  emergency: "اضطراری",
  follow_up: "پیگیری",
};

export const severityLabels: Record<FindingItem["severity"], string> = {
  low: "کم",
  medium: "متوسط",
  high: "بالا",
};
