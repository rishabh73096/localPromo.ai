import { IconCircleCheck as CircleCheck, IconCircleX as CircleX, IconInfoCircle as Info, IconAlertTriangle as TriangleAlert, type Icon as TablerIcon } from "@tabler/icons-react";

// Status icons shared by the toast (and any future alert).
export type AlertTone = "success" | "error" | "warning" | "info";

export const ALERT_MARKS: Record<AlertTone, TablerIcon> = {
  success: CircleCheck,
  error: CircleX,
  warning: TriangleAlert,
  info: Info,
};
