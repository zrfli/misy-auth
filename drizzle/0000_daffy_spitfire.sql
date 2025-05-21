CREATE TYPE "public"."Degree" AS ENUM('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'PREP');--> statement-breakpoint
CREATE TYPE "public"."DepartmentLanguage" AS ENUM('TR', 'EN', 'TR_EN');--> statement-breakpoint
CREATE TYPE "public"."Gender" AS ENUM('MALE', 'FEMALE', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."GrantType" AS ENUM('SCHOLARSHIP', 'NEED_BASED', 'FULL_WAIVER', 'PARTIAL_WAIVER', 'SPORTS', 'DISABILITY', 'GOVERNMENT', 'PRIVATE', 'ERASMUS', 'INSTITUTIONAL', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."Role" AS ENUM('STUDENT', 'LECTURER ', 'PERSONAL', 'MANAGER', 'DEVELOPER');--> statement-breakpoint
CREATE TYPE "public"."Semester" AS ENUM('SPRING', 'FALL');--> statement-breakpoint
CREATE TYPE "public"."ArrivalType" AS ENUM('YKS - ÖSYM', 'TRANSFER', 'INTERNATIONAL', 'SPECIAL_TALENT', 'GRADUATE', 'DOUBLE_MAJOR', 'MINOR', 'ERASMUS', 'FARABI', 'MEVLANA', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."PaymentStatus" AS ENUM('PENDING_PAYMENT', 'PENDING_APPROVAL', 'PENDING_DOCUMENTS', 'COMPLETED', 'FAILED', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."TwoFactorAuthService" AS ENUM('GOOGLE', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."UserStatus" AS ENUM('ACTIVE', 'GRADUATED', 'SUSPENDED', 'REGISTERED', 'DISMISSED', 'LEAVE_OF_ABSENCE', 'PENDING_APPROVAL', 'COURSE_SELECTION', 'DECEASED', 'CANCELLED', 'OTHER');--> statement-breakpoint
CREATE TABLE "AcademicInfo" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"unit_id" uuid NOT NULL,
	"department_id" uuid NOT NULL,
	"instructor_id" uuid,
	"arrivalType" "ArrivalType" NOT NULL,
	"degree" "Degree" NOT NULL,
	"semester" "Semester" NOT NULL,
	"paymentStatus" "PaymentStatus" NOT NULL,
	"grant" "GrantType" NOT NULL,
	CONSTRAINT "AcademicInfo_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "account" (
	"userId" uuid NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text
);
--> statement-breakpoint
CREATE TABLE "authenticator" (
	"credentialID" text NOT NULL,
	"userId" uuid NOT NULL,
	"providerAccountId" text NOT NULL,
	"credentialPublicKey" text NOT NULL,
	"counter" integer NOT NULL,
	"credentialDeviceType" text NOT NULL,
	"credentialBackedUp" boolean NOT NULL,
	"transports" text,
	CONSTRAINT "authenticator_credentialID_unique" UNIQUE("credentialID")
);
--> statement-breakpoint
CREATE TABLE "Avatar" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"bucket_id" text NOT NULL,
	"bucket_region" text,
	CONSTRAINT "Avatar_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "department" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"unit_id" uuid NOT NULL,
	"department_name" text NOT NULL,
	"language" "DepartmentLanguage" DEFAULT 'TR',
	"is_active" boolean DEFAULT true,
	CONSTRAINT "department_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "department_to_user" (
	"department_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	CONSTRAINT "department_to_user_user_id_department_id_pk" PRIMARY KEY("user_id","department_id")
);
--> statement-breakpoint
CREATE TABLE "Grant" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "GrantType" NOT NULL,
	"name" text NOT NULL,
	"provider" text,
	"amount" numeric,
	"currency" text DEFAULT 'TRY',
	"start_date" timestamp,
	"end_date" timestamp,
	"is_life_time" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	CONSTRAINT "Grant_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "Nationality" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"abbreviation" text NOT NULL,
	"code" text NOT NULL,
	CONSTRAINT "Nationality_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "period" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"period" jsonb DEFAULT '{"S":false,"YS":null,"YE":null}'::jsonb NOT NULL,
	"semester" "Semester" NOT NULL,
	CONSTRAINT "period_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "TwoFactorAuthentication" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"secret_key" text NOT NULL,
	"public_key" text,
	"service" "TwoFactorAuthService" NOT NULL,
	CONSTRAINT "TwoFactorAuthentication_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "unit" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"unit_name" text NOT NULL,
	"is_faculty" boolean NOT NULL,
	"is_department" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	CONSTRAINT "unit_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"name" text NOT NULL,
	"surname" text NOT NULL,
	"birthday" timestamp NOT NULL,
	"gender" "Gender" NOT NULL,
	"identityNumber" text NOT NULL,
	"role" "Role" NOT NULL,
	"nationality_id" uuid,
	"status" "UserStatus" NOT NULL,
	CONSTRAINT "user_id_unique" UNIQUE("id"),
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_username_unique" UNIQUE("username"),
	CONSTRAINT "user_identityNumber_unique" UNIQUE("identityNumber")
);
--> statement-breakpoint
CREATE TABLE "UserDetails" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"address" text,
	"phone_number" text,
	CONSTRAINT "UserDetails_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "user_to_period" (
	"period_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	CONSTRAINT "user_to_period_user_id_period_id_pk" PRIMARY KEY("user_id","period_id")
);
--> statement-breakpoint
CREATE TABLE "verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "AcademicInfo" ADD CONSTRAINT "AcademicInfo_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "AcademicInfo" ADD CONSTRAINT "AcademicInfo_unit_id_unit_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."unit"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "AcademicInfo" ADD CONSTRAINT "AcademicInfo_department_id_department_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."department"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "AcademicInfo" ADD CONSTRAINT "AcademicInfo_instructor_id_user_id_fk" FOREIGN KEY ("instructor_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "authenticator" ADD CONSTRAINT "authenticator_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Avatar" ADD CONSTRAINT "Avatar_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "department" ADD CONSTRAINT "department_unit_id_unit_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."unit"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "department_to_user" ADD CONSTRAINT "department_to_user_department_id_department_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."department"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "department_to_user" ADD CONSTRAINT "department_to_user_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Grant" ADD CONSTRAINT "Grant_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "TwoFactorAuthentication" ADD CONSTRAINT "TwoFactorAuthentication_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_nationality_id_Nationality_id_fk" FOREIGN KEY ("nationality_id") REFERENCES "public"."Nationality"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "UserDetails" ADD CONSTRAINT "UserDetails_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_to_period" ADD CONSTRAINT "user_to_period_period_id_period_id_fk" FOREIGN KEY ("period_id") REFERENCES "public"."period"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_to_period" ADD CONSTRAINT "user_to_period_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;