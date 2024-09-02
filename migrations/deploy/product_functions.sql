-- Deploy engrenages:product_functions to pg

BEGIN;

CREATE FUNCTION create_product_blockage_type(json) RETURNS TABLE (
  id INT,
  name VARCHAR(3),
  description VARCHAR(100)
) AS $$

  INSERT INTO "product_blockage_type"
  (
    "name",
    "description"
  ) VALUES (
    ($1->>'name')::VARCHAR(3),
    ($1->>'description')::VARCHAR(100)
  )
  RETURNING id, name, description

$$ LANGUAGE SQL STRICT;

CREATE FUNCTION update_product_blockage_type(json) RETURNS TABLE (
    id INT,
    name VARCHAR(3),
    description VARCHAR(100),
    updated_at TIMESTAMPTZ
) AS $$

  UPDATE "product_blockage_type" SET (
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

CREATE FUNCTION delete_product_blockage_type(INT) RETURNS "product_blockage_type" AS $$

  DELETE FROM "product_blockage_type" WHERE "id" = $1
  RETURNING *;

$$ LANGUAGE SQL STRICT;

CREATE FUNCTION create_product(json) RETURNS TABLE (
  id INT,
  title VARCHAR(100),
  description TEXT,
  ean CHAR(13),
  length DECIMAL,
  width DECIMAL,
  height DECIMAL,
  product_image_url TEXT,
  price DECIMAL,
  product_blockage_name CHAR(3)
) AS $$

  INSERT INTO "product"
  (
    "title",
    "description",
    "ean",
    "length",
    "width",
    "height",
    "product_image_url",
    "price",
    "product_blockage_name"
  ) VALUES (
    ($1->>'title')::VARCHAR(100),
    ($1->>'description')::TEXT,
    ($1->>'ean')::VARCHAR(13),
    ($1->>'length')::DECIMAL,
    ($1->>'width')::DECIMAL,
    ($1->>'height')::DECIMAL,
    ($1->>'product_image_url')::TEXT,
    ($1->>'price')::DECIMAL,
    ($1->>'product_blockage_name')::CHAR(3)
  )
  RETURNING id, title, description, ean, length, width, height, product_image_url, price, product_blockage_name

$$ LANGUAGE SQL STRICT;

CREATE FUNCTION update_product(json) RETURNS TABLE (
    id INT,
    title VARCHAR(100),
    description TEXT,
    ean CHAR(13),
    length DECIMAL,
    width DECIMAL,
    height DECIMAL,
    product_image_url TEXT,
    price DECIMAL,
    updated_at TIMESTAMPTZ
) AS $$

  UPDATE "product" SET (
    "title",
    "description",
    "ean",
    "length",
    "width",
    "height",
    "product_image_url",
    "price",
    "updated_at"
  ) = (
    COALESCE(($1->>'title')::VARCHAR(100), "title"),
    COALESCE(($1->>'description')::TEXT, "description"),
    COALESCE(($1->>'ean')::VARCHAR(13), "ean"),
    COALESCE(($1->>'length')::DECIMAL, "length"),
    COALESCE(($1->>'width')::DECIMAL, "width"),
    COALESCE(($1->>'height')::DECIMAL, "height"),
    COALESCE(($1->>'product_image_url')::TEXT, "product_image_url"),
    COALESCE(($1->>'price')::DECIMAL, "price"),
    NOW()
  )
  WHERE "id" = ($1->>'id')::INT
  RETURNING id, title, description, ean, length, width, height, product_image_url, price, "updated_at"

$$ LANGUAGE SQL STRICT;

CREATE FUNCTION delete_product(INT) RETURNS "product" AS $$

  DELETE FROM "product" WHERE "id" = $1
  RETURNING *;

$$ LANGUAGE SQL STRICT;

COMMIT;
