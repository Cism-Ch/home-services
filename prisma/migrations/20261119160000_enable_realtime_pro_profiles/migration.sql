-- Enable Supabase Realtime postgres_changes on public.pro_profiles (public read-only catalog table).
-- Private tables such as bookings intentionally stay excluded from anon Realtime to protect PII.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime')
     AND NOT EXISTS (
       SELECT 1
       FROM pg_publication_tables
       WHERE pubname = 'supabase_realtime'
         AND schemaname = 'public'
         AND tablename = 'pro_profiles'
     ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public."pro_profiles";
  END IF;
END $$;
