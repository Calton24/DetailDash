-- Temporary policy for MVP: Allow test detailer to manage their services
-- TODO: Remove this policy once Supabase Auth is wired up
-- Real RLS will use auth.uid() → profiles → detailers

CREATE POLICY "Dev: Test detailer can manage services"
  ON services FOR ALL
  USING (
    detailer_id = '10000000-0000-0000-0000-000000000001'
  );
