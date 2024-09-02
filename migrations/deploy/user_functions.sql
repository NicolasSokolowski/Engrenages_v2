-- Deploy engrenages:user_functions to pg

BEGIN;

CREATE FUNCTION create_user(json) RETURNS TABLE (
  id INT,
  first_name VARCHAR(20),
  last_name VARCHAR(50),
  email VARCHAR(100),
  role_name VARCHAR(10)
) AS $$

  INSERT INTO "user"
  (
    "first_name",
    "last_name",
    "email",
    "password",
    "role_name"
  ) VALUES (
    ($1->>'first_name')::VARCHAR(20),
    ($1->>'last_name')::VARCHAR(50),
    ($1->>'email')::VARCHAR(100),
    ($1->>'password')::TEXT,
    ($1->>'role_name')::VARCHAR(10)
  )
  RETURNING id, first_name, last_name, email, role_name

$$ LANGUAGE SQL STRICT;

CREATE FUNCTION update_user(json) RETURNS TABLE (
    id INT,
    first_name VARCHAR(20),
    last_name VARCHAR(50),
    email VARCHAR(100),
    role_name VARCHAR(10),
    updated_at TIMESTAMPTZ
) AS $$

  UPDATE "user" SET (
    "first_name",
    "last_name",
    "email",
    "password",
    "role_name",
    "updated_at"
  ) = (
    COALESCE(($1->>'first_name')::VARCHAR(20), "first_name"),
    COALESCE(($1->>'last_name')::VARCHAR(50), "last_name"),
    COALESCE(($1->>'email')::VARCHAR(100), "email"),
    COALESCE(($1->>'password')::TEXT, "password"),
    COALESCE(($1->>'role_name')::VARCHAR(10), "role_name"),
    NOW()
  )
  WHERE "id" = ($1->>'id')::INT
  RETURNING id, first_name, last_name, email, role_name, "updated_at"

$$ LANGUAGE SQL STRICT;

CREATE FUNCTION delete_user(INT) RETURNS "user" AS $$

  DELETE FROM "user" WHERE "id" = $1
  RETURNING *;

$$ LANGUAGE SQL STRICT;

CREATE FUNCTION create_role(json) RETURNS TABLE (
  id INT,
  name VARCHAR(10)
) AS $$

  INSERT INTO "role"
  (
    "name"
  ) VALUES (
    ($1->>'name')::VARCHAR(10)
  )
  RETURNING id, name

$$ LANGUAGE SQL STRICT;

CREATE FUNCTION update_role(json) RETURNS TABLE (
    id INT,
    name VARCHAR(10),
    updated_at TIMESTAMPTZ
) AS $$

  UPDATE "role" SET (
    "name",
    "updated_at"
  ) = (
    COALESCE(($1->>'name')::VARCHAR(10), "name"),
    NOW()
  )
  WHERE "id" = ($1->>'id')::INT
  RETURNING id, name, "updated_at"

$$ LANGUAGE SQL STRICT;

CREATE FUNCTION delete_role(INT) RETURNS "role" AS $$

  DELETE FROM "role" WHERE "id" = $1
  RETURNING *;

$$ LANGUAGE SQL STRICT;

COMMIT;
