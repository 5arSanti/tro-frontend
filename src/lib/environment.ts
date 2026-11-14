const ENVIRONMENT_LABELS: Record<string, string> = {
  development: "Desarrollo",
  production: "Producción",
  staging: "Pruebas",
  testing: "Testing",
  local: "Local",
  "---": "---",
};

export function formatEnvironment(env: string): string {
  return ENVIRONMENT_LABELS[env.toLowerCase()] ?? env;
}
