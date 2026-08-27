export const accessKeys = {
  all: ["access"] as const,
  available: () => [...accessKeys.all, "available"] as const,
};
