-- Revert engrenages:product_tables_creation from pg

BEGIN;

DROP TABLE "product", "product_blockage_type";

COMMIT;
