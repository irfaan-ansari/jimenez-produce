import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";

const statement = {
  ...defaultStatements,
  product: ["create", "view", "update", "delete"],
  order: ["create", "view", "update", "cancel"],
} as const;

export const ac = createAccessControl(statement);

export const admin = ac.newRole({
  ...adminAc.statements,
});

export const customer = ac.newRole({
  product: ["view"],
  order: ["create", "view", "cancel"],
});
