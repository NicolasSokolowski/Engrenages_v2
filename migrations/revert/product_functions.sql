-- Revert engrenages:product_functions from pg

BEGIN;

DROP FUNCTION create_product(json);
DROP FUNCTION update_product(json);
DROP FUNCTION delete_product(INT);

DROP FUNCTION create_product_blockage_type(json);
DROP FUNCTION update_product_blockage_type(json);
DROP FUNCTION delete_product_blockage_type(INT);

COMMIT;
