import { createAccessControl } from "better-auth/plugins/access";
import {
  defaultStatements,
  adminAc,
} from "better-auth/plugins/organization/access";

export const statement = {
  ...defaultStatements,
  product: ["create", "view", "update", "delete"],
  priceLevel: ["create", "view", "update", "delete"],
  applications: ["create", "view", "update", "delete"],
  order: ["create", "view", "update", "cancel", "invoice"],
  admin: ["view"],
} as const;

export const ac = createAccessControl(statement);

// organization roles
export const owner = ac.newRole({
  ...adminAc.statements,
  team: ["create", "update", "delete"],
  member: ["create", "update", "delete"],
  admin: ["view"],
  order: ["invoice"],
});

export const manager = ac.newRole({
  ...adminAc.statements,
  admin: ["view"],
});

export const member = ac.newRole({
  ...adminAc.statements,
});

export const sales = ac.newRole({
  ...adminAc.statements,
  admin: ["view"],
});

export const customer = ac.newRole({
  team: ["create"],
});

export const access = {
  admin: [
    "team:create",
    "team:read",
    "team:update",
    "team:delete",
    "teamMember:create",
    "teamMember:update",
    "teamMember:delete",
    "teamMember:read",
  ],
  manager: ["team:read", "team:update", "team:delete"],
  member: ["team:read:own"],
  sales: ["team:read"],
  customer: ["teamMember:create", "teamMember:read"],
} as const;

export type Role = keyof typeof access;
export type Permission = (typeof access)[keyof typeof access][number];

export function hasPermission(role: Role, permission: Permission) {
  return access[role].includes(permission as never);
}
