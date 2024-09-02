-- Revert engrenages:user_tables_creation from pg

BEGIN;

DROP TABLE "user", "role";

COMMIT;
