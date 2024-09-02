-- Deploy engrenages:structure_tables_creation to pg

BEGIN;

CREATE TABLE "location_type" (
  "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "name" VARCHAR(5) NOT NULL UNIQUE,
  "description" VARCHAR(100) NOT NULL,
  "length" DECIMAL(15,2) NOT NULL,
  "width" DECIMAL(15,2) NOT NULL,
  "height" DECIMAL(15,2) NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ
);

CREATE TABLE "location_blockage_type" (
  "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "name" VARCHAR(3) NOT NULL UNIQUE,
  "description" VARCHAR(100) NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ
);

CREATE TABLE "location" (
  "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "zone" CHAR(1) NOT NULL,
  "alley" CHAR(3) NOT NULL,
  "position" CHAR(4) NOT NULL,
  "lvl" CHAR(1) NOT NULL,
  "lvl_position" CHAR(2) NOT NULL,
  "location" CHAR(15) NOT NULL UNIQUE,
  "location_type_name" VARCHAR(5) NOT NULL REFERENCES location_type("name") ON UPDATE CASCADE,
  "location_blockage_name" CHAR(3) DEFAULT NULL REFERENCES location_blockage_type("name") ON UPDATE CASCADE,
  "product_reference" CHAR(10) DEFAULT NULL REFERENCES product("reference") ON UPDATE CASCADE,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ
);

COMMIT;
