-- Migration: Multi-day / multi-week / multi-month booking spans and configurable pro concurrency capacity (1..N)

-- 1. ProProfile capacity & organization type
ALTER TABLE "public"."pro_profiles"
  ADD COLUMN IF NOT EXISTS "organizationType" TEXT NOT NULL DEFAULT 'INDIVIDUAL',
  ADD COLUMN IF NOT EXISTS "maxConcurrentProjects" INTEGER NOT NULL DEFAULT 1;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'pro_profiles_organization_type_check'
      AND conrelid = 'public.pro_profiles'::regclass
  ) THEN
    ALTER TABLE "public"."pro_profiles"
      ADD CONSTRAINT "pro_profiles_organization_type_check"
      CHECK ("organizationType" IN ('INDIVIDUAL', 'TEAM', 'PME'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'pro_profiles_max_concurrent_projects_check'
      AND conrelid = 'public.pro_profiles'::regclass
  ) THEN
    ALTER TABLE "public"."pro_profiles"
      ADD CONSTRAINT "pro_profiles_max_concurrent_projects_check"
      CHECK ("maxConcurrentProjects" BETWEEN 1 AND 50);
  END IF;
END $$;

-- 2. Service duration scale (MINUTES, HOURS, DAYS, WEEKS, MONTHS)
ALTER TABLE "public"."services"
  ADD COLUMN IF NOT EXISTS "durationUnit" TEXT NOT NULL DEFAULT 'MINUTES',
  ADD COLUMN IF NOT EXISTS "durationValue" INTEGER NOT NULL DEFAULT 60;

UPDATE "public"."services"
SET "durationValue" = GREATEST(15, COALESCE("duration", 60))
WHERE "durationUnit" = 'MINUTES' AND "durationValue" = 60 AND "duration" <> 60;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'services_duration_unit_check'
      AND conrelid = 'public.services'::regclass
  ) THEN
    ALTER TABLE "public"."services"
      ADD CONSTRAINT "services_duration_unit_check"
      CHECK ("durationUnit" IN ('MINUTES', 'HOURS', 'DAYS', 'WEEKS', 'MONTHS'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'services_duration_value_check'
      AND conrelid = 'public.services'::regclass
  ) THEN
    ALTER TABLE "public"."services"
      ADD CONSTRAINT "services_duration_value_check"
      CHECK ("durationValue" >= 1);
  END IF;
END $$;

-- 3. Booking span (endDate + duration scale)
ALTER TABLE "public"."bookings"
  ADD COLUMN IF NOT EXISTS "endDate" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "durationUnit" TEXT NOT NULL DEFAULT 'MINUTES',
  ADD COLUMN IF NOT EXISTS "durationValue" INTEGER NOT NULL DEFAULT 60;

UPDATE "public"."bookings" b
SET
  "endDate" = COALESCE(b."endDate", b."bookingDate"),
  "durationValue" = GREATEST(15, COALESCE(s."duration", 60))
FROM "public"."services" s
WHERE b."serviceId" = s."id" AND b."endDate" IS NULL;

UPDATE "public"."bookings"
SET "endDate" = COALESCE("endDate", "bookingDate", NOW())
WHERE "endDate" IS NULL;

ALTER TABLE "public"."bookings"
  ALTER COLUMN "endDate" SET NOT NULL,
  ALTER COLUMN "endDate" SET DEFAULT CURRENT_TIMESTAMP;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'bookings_duration_unit_check'
      AND conrelid = 'public.bookings'::regclass
  ) THEN
    ALTER TABLE "public"."bookings"
      ADD CONSTRAINT "bookings_duration_unit_check"
      CHECK ("durationUnit" IN ('MINUTES', 'HOURS', 'DAYS', 'WEEKS', 'MONTHS'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'bookings_duration_value_check'
      AND conrelid = 'public.bookings'::regclass
  ) THEN
    ALTER TABLE "public"."bookings"
      ADD CONSTRAINT "bookings_duration_value_check"
      CHECK ("durationValue" >= 1);
  END IF;
END $$;

-- Composite index for fast interval intersection queries (equality first, range last)
CREATE INDEX IF NOT EXISTS "bookings_proId_status_bookingDate_endDate_idx"
  ON "public"."bookings" ("proId", "status", "bookingDate", "endDate");

-- 4. Least-privilege PostgREST column grant for new non-sensitive catalog fields on pro_profiles
GRANT SELECT ("organizationType", "maxConcurrentProjects")
  ON TABLE public."pro_profiles" TO anon, authenticated;
