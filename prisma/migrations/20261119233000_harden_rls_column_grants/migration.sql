-- Defense-in-depth: revoke all table privileges on private/auth/PII tables from anon & authenticated.
-- Server-side Prisma (postgres role) retains full access.
REVOKE ALL ON TABLE public."users" FROM anon, authenticated;
REVOKE ALL ON TABLE public."sessions" FROM anon, authenticated;
REVOKE ALL ON TABLE public."accounts" FROM anon, authenticated;
REVOKE ALL ON TABLE public."verifications" FROM anon, authenticated;
REVOKE ALL ON TABLE public."bookings" FROM anon, authenticated;
REVOKE ALL ON TABLE public."subscriptions" FROM anon, authenticated;
REVOKE ALL ON TABLE public."unavailability_periods" FROM anon, authenticated;
REVOKE ALL ON TABLE public."reviews" FROM anon, authenticated;

DROP POLICY IF EXISTS "public_read_moderated_reviews" ON public."reviews";

-- Restrict public."pro_profiles" PostgREST/Realtime reads to safe catalog columns ONLY.
-- Blocks anonymous access to kycDocumentUrl, kycStatus, address, phoneNumber, whatsappNumber, and userId.
REVOKE ALL ON TABLE public."pro_profiles" FROM anon, authenticated;
GRANT SELECT (
  id,
  headline,
  bio,
  "yearsOfExperience",
  "cityId",
  commune,
  "availabilityStatus",
  "isVerified",
  rating,
  "reviewsCount",
  "completedTasks",
  "portfolioImages",
  languages,
  "createdAt",
  "updatedAt"
) ON public."pro_profiles" TO anon, authenticated;

-- Restrict catalog tables strictly to read-only SELECT for anon & authenticated
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON TABLE public."categories" FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON TABLE public."cities" FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON TABLE public."services" FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON TABLE public."time_slots" FROM anon, authenticated;
