-- 00022_discovery_rls_fix.sql
-- Fixes RLS policies for discovery_interviews to use the new IAM functions (Sprint 21.3)

DROP POLICY IF EXISTS "Tenant isolation for interviews" ON discovery_interviews;
CREATE POLICY "Tenant isolation for interviews" ON discovery_interviews
    FOR ALL
    USING (
        is_active_member(organization_id) AND deleted_at IS NULL
    )
    WITH CHECK (
        is_active_member(organization_id)
    );

DROP POLICY IF EXISTS "Tenant isolation for interview answers" ON discovery_interview_answers;
CREATE POLICY "Tenant isolation for interview answers" ON discovery_interview_answers
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM discovery_interviews di
            WHERE di.id = discovery_interview_answers.interview_id
            AND is_active_member(di.organization_id)
            AND di.deleted_at IS NULL
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM discovery_interviews di
            WHERE di.id = discovery_interview_answers.interview_id
            AND is_active_member(di.organization_id)
        )
    );
