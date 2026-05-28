import {
  adminAc,
  defaultStatements,
} from "better-auth/plugins/organization/access";
import { createAccessControl } from "better-auth/plugins/access";

export const statement = {
  ...defaultStatements,
  team: [
    "create",
    "read",
    "read:team",
    "update",
    "update:team",
    "delete",
    "delete:team",
  ],
  order: [
    "create",
    "read",
    "read:team",
    "update",
    "update:team",
    "delete",
    "delete:team",
  ],
  invoice: ["read", "read:team"],
  packingSlip: ["read", "read:team"],
  product: ["create", "read", "update", "delete"],
  priceLevel: ["create", "read", "update", "delete"],
  taxRule: ["create", "read", "update", "delete"],
  warehouse: ["create", "read", "update", "delete"],
  user: ["create", "read", "update", "delete"],
  orderGuide: [
    "create",
    "read",
    "read:team",
    "update",
    "update:team",
    "delete",
    "delete:team",
  ],
} as const;

export const ac = createAccessControl(statement);

export const owner = ac.newRole({
  ...adminAc.statements,
  team: ["create", "read", "update", "delete"],
  order: ["read", "update", "delete"],
  invoice: ["read", "read:team"],
  product: ["create", "read", "update", "delete"],
  priceLevel: ["create", "read", "update", "delete"],
  taxRule: ["create", "read", "update", "delete"],
  warehouse: ["create", "read", "update", "delete"],
  user: ["create", "read", "update", "delete"],
  orderGuide: ["create", "read", "update", "delete"],
});

export const manager = ac.newRole({
  ...adminAc.statements,
  team: ["create", "read", "update"],
  order: ["read", "update"],
  invoice: ["read"],
  product: ["create", "read", "update"],
  priceLevel: ["create", "read", "update"],
  taxRule: ["create", "read", "update"],
  warehouse: ["create", "read", "update"],
  user: ["create", "read", "update"],
  orderGuide: ["create", "read", "update"],
});

export const member = ac.newRole({
  ...adminAc.statements,
  team: ["create", "read", "update"],
  order: ["read", "update"],
  invoice: ["read"],
  product: ["create", "read", "update"],
  priceLevel: ["create", "read", "update"],
  taxRule: ["create", "read", "update"],
  warehouse: ["create", "read", "update"],
  user: ["create", "read", "update"],
  orderGuide: ["create", "read", "update"],
});

export const sales = ac.newRole({
  ...adminAc.statements,
  team: ["create", "read:team", "update:team"],
  order: ["read:team", "update:team"],
  invoice: ["read:team"],
  product: ["read"],
  orderGuide: ["create", "read:team", "update:team"],
});

export const customer = ac.newRole({
  team: ["update:team", "update"],
  order: ["read:team", "update:team"],
  invoice: ["read:team"],
  product: ["read"],
  orderGuide: ["create", "read:team", "update:team"],
});
