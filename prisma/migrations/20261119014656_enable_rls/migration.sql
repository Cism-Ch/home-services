-- Enable Supabase Row Level Security (RLS) on all 13 public application tables.
-- Note: FORCE ROW LEVEL SECURITY is intentionally omitted so server-side Prisma/Better-Auth
-- connections (postgres role) retain full server access while blocking PostgREST anon leaks.

ALTER TABLE public."users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."sessions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."accounts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."verifications" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."pro_profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."categories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."cities" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."services" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."time_slots" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."unavailability_periods" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."bookings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."reviews" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."subscriptions" ENABLE ROW LEVEL SECURITY;

-- Public read-only policies for marketplace catalog tables via PostgREST / Supabase Realtime
CREATE POLICY "public_read_categories"
  ON public."categories"
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "public_read_cities"
  ON public."cities"
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "public_read_pro_profiles"
  ON public."pro_profiles"
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "public_read_active_services"
  ON public."services"
  FOR SELECT
  TO anon, authenticated
  USING ("isActive" = true);

CREATE POLICY "public_read_available_time_slots"
  ON public."time_slots"
  FOR SELECT
  TO anon, authenticated
  USING ("isAvailable" = true);

CREATE POLICY "public_read_moderated_reviews"
  ON public."reviews"
  FOR SELECT
  TO anon, authenticated
  USING ("isModerated" = true AND "isReported" = false);
