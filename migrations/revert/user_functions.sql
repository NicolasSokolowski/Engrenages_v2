-- Revert engrenages:user_functions from pg

BEGIN;

DROP FUNCTION create_role(json);
DROP FUNCTION update_role(json);
DROP FUNCTION delete_role(INT);
DROP FUNCTION create_user(json);
DROP FUNCTION update_user(json);
DROP FUNCTION delete_user(INT);

COMMIT;
