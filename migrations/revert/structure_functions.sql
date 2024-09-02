-- Revert engrenages:structure_functions from pg

BEGIN;

DROP TRIGGER trigger_update_location ON location;
DROP FUNCTION update_location_field();

DROP FUNCTION create_location(json);
DROP FUNCTION update_location(json);
DROP FUNCTION delete_location(INT);

DROP FUNCTION create_location_blockage_type(json);
DROP FUNCTION update_location_blockage_type(json);
DROP FUNCTION delete_location_blockage_type(INT);

DROP FUNCTION create_location_type(json);
DROP FUNCTION update_location_type(json);
DROP FUNCTION delete_location_type(INT);

COMMIT;
