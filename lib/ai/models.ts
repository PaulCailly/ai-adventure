// Define your models here.

export interface Model {
  id: string;
  label: string;
  apiIdentifier: string;
  description: string;
}

export const models: Array<Model> = [
  {
    id: "gpt-4.1-2025-04-14-mini",
    label: "GPT 4o mini",
    apiIdentifier: "gpt-4.1-2025-04-14-mini",
    description: "Small model for fast, lightweight tasks",
  },
  {
    id: "gpt-4.1-2025-04-14",
    label: "GPT 4o",
    apiIdentifier: "gpt-4.1-2025-04-14",
    description: "For complex, multi-step tasks",
  },
] as const;

export const DEFAULT_MODEL_NAME: string = "gpt-4.1-2025-04-14";
