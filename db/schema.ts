import { relations } from "drizzle-orm";
import type { AdapterAccountType } from "next-auth/adapters";
import { uuid, boolean, timestamp, pgTable, text, primaryKey, integer, pgEnum, numeric, jsonb } from "drizzle-orm/pg-core";

export const Semester = pgEnum('Semester', ['SPRING', 'FALL']);
export const Gender = pgEnum('Gender', ['MALE', 'FEMALE', 'OTHER']);
export const Role = pgEnum('Role', ['STUDENT', 'LECTURER ', 'PERSONAL', 'MANAGER', 'DEVELOPER']);
export const twoFactorAuthService = pgEnum('TwoFactorAuthService', ['GOOGLE', 'OTHER']);
export const arrivalType = pgEnum('ArrivalType', ['YKS - ÖSYM', 'TRANSFER', 'INTERNATIONAL', 'SPECIAL_TALENT', 'GRADUATE', 'DOUBLE_MAJOR', 'MINOR', 'ERASMUS', 'FARABI', 'MEVLANA', 'OTHER']);
export const Degree = pgEnum('Degree', ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'PREP']);
export const DepartmentLanguage = pgEnum('DepartmentLanguage', ['TR', 'EN', 'TR_EN']);
export const userStatus = pgEnum('UserStatus', ['ACTIVE', 'GRADUATED', 'SUSPENDED', 'REGISTERED', 'DISMISSED', 'LEAVE_OF_ABSENCE', 'PENDING_APPROVAL', 'COURSE_SELECTION', 'DECEASED', 'CANCELLED', 'OTHER']);
export const paymentStatus = pgEnum('PaymentStatus', ['PENDING_PAYMENT', 'PENDING_APPROVAL', 'PENDING_DOCUMENTS', 'COMPLETED', 'FAILED', 'OTHER']);
export const GrantType = pgEnum('GrantType', ['SCHOLARSHIP', 'NEED_BASED', 'FULL_WAIVER', 'PARTIAL_WAIVER', 'SPORTS', 'DISABILITY', 'GOVERNMENT', 'PRIVATE', 'ERASMUS', 'INSTITUTIONAL', 'OTHER']);

export const user = pgTable("user", {
  id: uuid().primaryKey().defaultRandom().notNull().unique(),
  email: text("email").unique().notNull(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  surname: text("surname").notNull(),
  birthday: timestamp("birthday").notNull(),
  gender: Gender().notNull(),
  identityNumber: text("identityNumber").notNull().unique(),
  role: Role().notNull(),
  nationalityId: uuid("nationality_id").references(() => nationality.id),
  status: userStatus().notNull()
});

export const twoFactorAuthentication = pgTable("TwoFactorAuthentication", {
  id: uuid().primaryKey().defaultRandom().notNull().unique(),
  userId: uuid("user_id").notNull().references(() => user.id),
  secretKey: text("secret_key").notNull(),
  publicKey: text("public_key"),
  service: twoFactorAuthService().notNull()
});
 
export const avatar = pgTable("Avatar", {
  id: uuid().primaryKey().defaultRandom().notNull().unique(),
  userId: uuid("user_id").notNull().references(() => user.id),
  bucketId: text("bucket_id").notNull(),
  bucketRegion: text("bucket_region")
});

export const userDetails = pgTable("UserDetails", {
  id: uuid().primaryKey().defaultRandom().notNull().unique(),
  userId: uuid("user_id").notNull().references(() => user.id),
  address: text(),
  phoneNumber: text("phone_number")
});

export const academicInfo = pgTable("AcademicInfo", {
  id: uuid().primaryKey().defaultRandom().notNull().unique(),
  userId: uuid("user_id").notNull().references(() => user.id),
  unitId: uuid("unit_id").notNull().references(() => unit.id),
  departmentId: uuid("department_id").notNull().references(() => department.id),
  instructorId: uuid("instructor_id").references(() => user.id),
  arrivalType: arrivalType().notNull(),
  degree: Degree().notNull(),
  semester: Semester().notNull(),
  paymentStatus: paymentStatus().notNull(),
  grant: GrantType().notNull()
});

export const nationality = pgTable("Nationality", {
  id: uuid().primaryKey().defaultRandom().notNull().unique(),
  name: text().notNull(),
  abbreviation: text().notNull(),
  code: text().notNull()
});

export const grant = pgTable("Grant", {
  id: uuid().primaryKey().defaultRandom().notNull().unique(),
  userId: uuid("user_id").notNull().references(() => user.id),
  type: GrantType("type").notNull(),
  name: text("name").notNull(),               
  provider: text("provider"),                        
  amount: numeric("amount"),
  currency: text("currency").default("TRY"), 
  startDate: timestamp("start_date", { mode: "date" }),
  endDate: timestamp("end_date", { mode: "date" }),
  isLifeTime: boolean("is_life_time").default(false),
  isActive: boolean("is_active").default(true)
});

export const unit = pgTable("unit", {
  id: uuid().primaryKey().defaultRandom().notNull().unique(),
  unitName: text("unit_name").notNull(),
  isFaculty: boolean("is_faculty").notNull(),
  isDepartment: boolean("is_department").default(false),
  isActive: boolean("is_active").default(true),
});

export const department = pgTable("department", {
  id: uuid().primaryKey().defaultRandom().notNull().unique(),
  unitId: uuid("unit_id").notNull().references(() => unit.id),
  departmentName: text("department_name").notNull(),
  language: DepartmentLanguage().default('TR'),
  isActive: boolean("is_active").default(true),
});

export const period = pgTable("period", {
  id: uuid().primaryKey().defaultRandom().notNull().unique(),
  period: jsonb("period").default({ S: false, YS: null, YE: null }).notNull(),
  semester: Semester().notNull()
});

export const accounts = pgTable("account", {
  userId: uuid("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
  type: text("type").$type<AdapterAccountType>().notNull(),
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
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
)
 
export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: uuid("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})
 
export const verificationTokens = pgTable("verificationToken", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ]
)
 
export const authenticators = pgTable("authenticator", {
  credentialID: text("credentialID").notNull().unique(),
  userId: uuid("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
  providerAccountId: text("providerAccountId").notNull(),
  credentialPublicKey: text("credentialPublicKey").notNull(),
  counter: integer("counter").notNull(),
  credentialDeviceType: text("credentialDeviceType").notNull(),
  credentialBackedUp: boolean("credentialBackedUp").notNull(),
  transports: text("transports"),
  },
  (authenticator) => [
    {
      compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID],
      }),
    },
  ]
)

export const userToPeriod = pgTable('user_to_period', {
  periodId: uuid('period_id').notNull().references(() => period.id),
  userId: uuid('user_id').notNull().references(() => user.id)
  },
  (t) => [ primaryKey({ columns: [t.userId, t.periodId] }) ]
);

export const departmentToUser = pgTable('department_to_user', {
  departmentId: uuid('department_id').notNull().references(() => department.id),
  userId: uuid('user_id').notNull().references(() => user.id)
  },
  (t) => [ primaryKey({ columns: [t.userId, t.departmentId] }) ]
);

export const userRelations = relations(user, ({ one, many }) => ({
  twoFactorAuthentication: one(twoFactorAuthentication),
  avatar: one(avatar),
  userDetails: one(userDetails),
  academicInfo: one(academicInfo, { fields: [user.id], references: [academicInfo.userId], relationName: 'user' }),
  //instructorsInfo: many(academicInfo, { relationName: 'instructor' }),
  grant: one(grant),
  periods: many(userToPeriod),
  departments: many(departmentToUser),
  nationality: one(nationality, { fields: [user.nationalityId], references: [nationality.id] })
}));

export const twoFactorAuthenticationRelations = relations(twoFactorAuthentication, ({ one }) => ({
  user: one(user, { fields: [twoFactorAuthentication.userId], references: [user.id] })
}));

export const avatarRelations = relations(avatar, ({ one }) => ({
  user: one(user, { fields: [avatar.userId], references: [user.id] })
}));

export const userDetailsRelations = relations(userDetails, ({ one }) => ({
  user: one(user, { fields: [userDetails.userId], references: [user.id] })
}));

export const nationalityRelations = relations(nationality, ({ many }) => ({
  users: many(user)
}));

export const academicInfoRelations = relations(academicInfo, ({ one }) => ({
  user: one(user, { fields: [academicInfo.userId], references: [user.id], relationName: 'user' }),
  unit: one(unit, { fields: [academicInfo.unitId], references: [unit.id] }),
  department: one(department, { fields: [academicInfo.departmentId], references: [department.id] }),
  instructor: one(user, { fields: [academicInfo.instructorId], references: [user.id], relationName: 'instructor' })
}));

export const grantRelations = relations(grant, ({ one }) => ({
  user: one(user, { fields: [grant.userId], references: [user.id] })
}));

export const unitRelations = relations(unit, ({ many }) => ({
  department: many(department),
}));

export const departmentRelations = relations(department, ({ one, many }) => ({
  unit: one(unit, { fields: [department.unitId], references: [unit.id] }),
  users: many(departmentToUser),
}));

export const periodRelations = relations(period, ({ many }) => ({
  users: many(userToPeriod),
}));

export const userToPeriodRelations = relations(userToPeriod, ({ one }) => ({
  user: one(user, { fields: [userToPeriod.userId], references: [user.id] }),
  period: one(period, { fields: [userToPeriod.periodId], references: [period.id] })
}));

export const departmentToUserRelations = relations(departmentToUser, ({ one }) => ({
  user: one(user, { fields: [departmentToUser.userId], references: [user.id] }),
  department: one(department, { fields: [departmentToUser.departmentId], references: [department.id] })
}));