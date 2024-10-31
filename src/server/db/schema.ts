import { sql } from "drizzle-orm";
import {
  boolean,
  timestamp,
  pgTableCreator,
  text,
  primaryKey,
  integer,
  serial,
  varchar,
  numeric,
  index,
  uuid,
  pgEnum,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import type { AdapterAccount } from "next-auth/adapters";
import { env } from "~/env";

export const pgTable = pgTableCreator((name) => `aurora_${name}`);
export const pgTableNoPrefix = pgTableCreator((name) => `${name}`);

const connectionString = env.POSTGRES_URL;
const pool = postgres(connectionString, { max: 1 });
export const db = drizzle(pool);

export const userRoleEnum = pgEnum("user_role", ["ADMIN", "USER"]);

export const users = pgTableNoPrefix("user", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  password: text("password"),
  role: userRoleEnum("role").default("USER"),
});

export const accounts = pgTableNoPrefix(
  "account",
  {
    userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const items = pgTable(
  "item",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    url: varchar("url", { length: 1024 }).notNull(),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    description: text("description").notNull(),
    userId: uuid("userId").references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
    userIdIndex: index("user_id_idx").on(example.userId),
  }),
);

export const user_data = pgTable("user_data", {
  userId: uuid("userId")
    .references(() => users.id, { onDelete: "cascade" })
    .primaryKey(),
  country: text("country"),
  state: text("state"),
  city: text("city"),
  postcode: text("postcode"),
  street: text("street"),
  housenumber: text("housenumber"),
  apartmentnumber: text("apartmentnumber"),
  phoneNumber: text("phoneNumber"),
});

// every user has their own unique cart
export const cart = pgTable("cart", {
  id: serial("id").primaryKey(),
  userId: uuid("userId").references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

//cart item connects user thru cart with item thru items
export const cartItems = pgTable("cart_item", {
  id: serial("id").primaryKey(),
  cartId: integer("cartId").references(() => cart.id, { onDelete: "cascade" }),
  itemId: integer("itemId").references(() => items.id, { onDelete: "cascade" }),
  addedAt: timestamp("added_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const authenticators = pgTable("authenticator", {
  credentialID: uuid("credentialID").notNull().unique(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  providerAccountId: text("providerAccountId").notNull(),
  credentialPublicKey: text("credentialPublicKey").notNull(),
  counter: integer("counter").notNull(),
  credentialDeviceType: text("credentialDeviceType").notNull(),
  credentialBackedUp: boolean("credentialBackedUp").notNull(),
  transports: text("transports"),
});

export const verificationToken = pgTable(
  "verificationToken",
  {
    id: uuid("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    email: text("email").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { withTimezone: true }).notNull(),
  },
  (table) => {
    return {
      emailTokenUniqueIdx: uniqueIndex("email_token_unique").on(
        table.email,
        table.token,
      ),
    };
  },
);
