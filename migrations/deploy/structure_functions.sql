-- Deploy engrenages:structure_functions to pg

BEGIN;

CREATE FUNCTION create_location_type(json) RETURNS TABLE (
  id INT,
  name VARCHAR(5),
  description VARCHAR(100),
  length DECIMAL,
  width DECIMAL,
  height DECIMAL
) AS $$

  INSERT INTO "location_type"
  (
    "name",
    "description",
    "length",
    "width",
    "height"
  ) VALUES (
    ($1->>'name')::VARCHAR(5),
    ($1->>'description')::VARCHAR(100),
    ($1->>'length')::DECIMAL,
    ($1->>'width')::DECIMAL,
    ($1->>'height')::DECIMAL
  )
  RETURNING id, name, description, length, width, height

$$ LANGUAGE SQL STRICT;

CREATE FUNCTION update_location_type(json) RETURNS TABLE (
    id INT,
    name VARCHAR(5),
    description VARCHAR(100),
    length DECIMAL,
    width DECIMAL,
    height DECIMAL,
    updated_at TIMESTAMPTZ
) AS $$

  UPDATE "location_type" SET (
    "name",
    "description",
    "length",
    "width",
    "height",
    "updated_at"
  ) = (
    COALESCE(($1->>'name')::VARCHAR(5), "name"),
    COALESCE(($1->>'description')::VARCHAR(100), "description"),
    COALESCE(($1->>'length')::DECIMAL, "length"),
    COALESCE(($1->>'width')::DECIMAL, "width"),
    COALESCE(($1->>'height')::DECIMAL, "height"),
    NOW()
  )
  WHERE "id" = ($1->>'id')::INT
  RETURNING id, name, description, length, width, height, "updated_at"

$$ LANGUAGE SQL STRICT;

CREATE FUNCTION delete_location_type(INT) RETURNS "location_type" AS $$

  DELETE FROM "location_type" WHERE "id" = $1
  RETURNING *;

$$ LANGUAGE SQL STRICT;

CREATE FUNCTION create_location_blockage_type(json) RETURNS TABLE (
  id INT,
  name VARCHAR(3),
  description VARCHAR(100)
) AS $$

  INSERT INTO "location_blockage_type"
  (
    "name",
    "description"
  ) VALUES (
    ($1->>'name')::VARCHAR(3),
    ($1->>'description')::VARCHAR(100)
  )
  RETURNING id, name, description

$$ LANGUAGE SQL STRICT;

CREATE FUNCTION update_location_blockage_type(json) RETURNS TABLE (
    id INT,
    name VARCHAR(3),
    description VARCHAR(100),
    updated_at TIMESTAMPTZ
) AS $$

  UPDATE "location_blockage_type" SET (
    "name",
    "description",
    "updated_at"
  ) = (
    COALESCE(($1->>'name')::VARCHAR(3), "name"),
    COALESCE(($1->>'description')::VARCHAR(100), "description"),
    NOW()
  )
  WHERE "id" = ($1->>'id')::INT
  RETURNING id, name, description, "updated_at"

$$ LANGUAGE SQL STRICT;

CREATE FUNCTION delete_location_blockage_type(INT) RETURNS "location_blockage_type" AS $$

  DELETE FROM "location_blockage_type" WHERE "id" = $1
  RETURNING *;

$$ LANGUAGE SQL STRICT;

CREATE FUNCTION create_location(json) RETURNS TABLE (
  id INT,
  zone CHAR(1),
  alley CHAR(3),
  "position" CHAR(4),
  lvl CHAR(1),
  lvl_position CHAR(2),
  location CHAR(15),
  location_type_name VARCHAR(5),
  location_blockage_name CHAR(3)
) AS $$

  INSERT INTO "location"
  (
    "zone",
    "alley",
    "position",
    "lvl",
    "lvl_position",
    "location",
    "location_type_name",
    "location_blockage_name"
  ) VALUES (
    ($1->>'zone')::CHAR(1),
    ($1->>'alley')::CHAR(3),
    ($1->>'position')::CHAR(4),
    ($1->>'lvl')::CHAR(1),
    ($1->>'lvl_position')::CHAR(2),
    ($1->>'zone')::CHAR(1) || '-' || ($1->>'alley')::CHAR(3) || '-' || ($1->>'position')::CHAR(4) || '-' || ($1->>'lvl')::CHAR(1) || '-' || ($1->>'lvl_position')::CHAR(2),
    ($1->>'location_type_name')::VARCHAR(5),
    ($1->>'location_blockage_name')::CHAR(3)
  )
  RETURNING id, zone, alley, "position", lvl, lvl_position, location, location_type_name, location_blockage_name

$$ LANGUAGE SQL STRICT;

CREATE FUNCTION update_location(json) RETURNS TABLE (
    id INT,
    zone CHAR(1),
    alley CHAR(3),
    "position" CHAR(4),
    lvl CHAR(1),
    lvl_position CHAR(2),
    location CHAR(15),
    location_type_name VARCHAR(5),
    location_blockage_name CHAR(3),
    updated_at TIMESTAMPTZ
) AS $$

  UPDATE "location" SET (
    "zone",
    "alley",
    "position",
    "lvl",
    "lvl_position",
    "location_type_name",
    "location_blockage_name",
    "updated_at"
  ) = (
    COALESCE(($1->>'zone')::CHAR(1), "zone"),
    COALESCE(($1->>'alley')::CHAR(3), "alley"),
    COALESCE(($1->>'position')::CHAR(4), "position"),
    COALESCE(($1->>'lvl')::CHAR(1), "lvl"),
    COALESCE(($1->>'lvl_position')::CHAR(2), "lvl_position"),
    COALESCE(($1->>'location_type_name')::VARCHAR(5), "location_type_name"),
    COALESCE(($1->>'location_blockage_name')::CHAR(3), "location_blockage_name"),
    NOW()
  )
  WHERE "id" = ($1->>'id')::INT
  RETURNING id, zone, alley, "position", lvl, lvl_position, location, location_type_name, location_blockage_name, "updated_at"

$$ LANGUAGE SQL STRICT;

CREATE FUNCTION delete_location(INT) RETURNS "location" AS $$

  DELETE FROM "location" WHERE "id" = $1
  RETURNING *;

$$ LANGUAGE SQL STRICT;

CREATE FUNCTION update_location_field()
RETURNS TRIGGER AS $$
BEGIN
  NEW.location := NEW.zone || '-' || NEW.alley || '-' || NEW.position || '-' || NEW.lvl || '-' || NEW.lvl_position;
  RETURN NEW;
END;
$$ LANGUAGE PLPGSQL STRICT;

CREATE TRIGGER trigger_update_location
BEFORE UPDATE ON location
FOR EACH ROW
WHEN (OLD.zone IS DISTINCT FROM NEW.zone OR 
      OLD.alley IS DISTINCT FROM NEW.alley OR 
      OLD.position IS DISTINCT FROM NEW.position OR 
      OLD.lvl IS DISTINCT FROM NEW.lvl OR 
      OLD.lvl_position IS DISTINCT FROM NEW.lvl_position)
EXECUTE FUNCTION update_location_field();

COMMIT;
