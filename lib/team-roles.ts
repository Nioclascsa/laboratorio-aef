/** Canonical role hierarchy – order matters */
export const TEAM_ROLES = [
  "Jefe de Laboratorio",
  "Investigador",
  "Profesor",
  "Colaborador externo",
  "Alumno",
] as const;

export type TeamRole = (typeof TEAM_ROLES)[number];

export const TEAM_ROLE_LABELS: Record<string, string> = {
  "Jefe de Laboratorio": "Jefe de Laboratorio",
  "Investigador": "Investigadores",
  "Profesor": "Profesores",
  "Colaborador externo": "Colaboradores Externos",
  "Alumno": "Alumnos",
};
