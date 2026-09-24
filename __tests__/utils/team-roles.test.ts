import { describe, it, expect } from "vitest";
import { TEAM_ROLES, TEAM_ROLE_LABELS } from "@/lib/team-roles";

describe("Team Roles definitions", () => {
  it("includes Investigador and Colaborador externo in TEAM_ROLES", () => {
    expect(TEAM_ROLES).toContain("Investigador");
    expect(TEAM_ROLES).toContain("Colaborador externo");
    expect(TEAM_ROLES).toContain("Jefe de Laboratorio");
    expect(TEAM_ROLES).toContain("Profesor");
    expect(TEAM_ROLES).toContain("Alumno");
  });

  it("provides matching human-readable labels for all roles", () => {
    for (const role of TEAM_ROLES) {
      expect(TEAM_ROLE_LABELS[role]).toBeDefined();
      expect(TEAM_ROLE_LABELS[role].length).toBeGreaterThan(0);
    }

    expect(TEAM_ROLE_LABELS["Investigador"]).toBe("Investigadores");
    expect(TEAM_ROLE_LABELS["Colaborador externo"]).toBe("Colaboradores Externos");
    expect(TEAM_ROLE_LABELS["Profesor"]).toBe("Profesores");
    expect(TEAM_ROLE_LABELS["Alumno"]).toBe("Alumnos");
    expect(TEAM_ROLE_LABELS["Jefe de Laboratorio"]).toBe("Jefe de Laboratorio");
  });
});
