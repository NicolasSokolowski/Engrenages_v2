-- Deploy engrenages:product_tables_creation to pg

BEGIN;

CREATE TABLE "product_blockage_type" (
  "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "name" CHAR(3) NOT NULL UNIQUE,
  "description" VARCHAR(100) NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ
);

CREATE TABLE "product" (
  "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "title" VARCHAR(100) NOT NULL,
  "description" TEXT NOT NULL,
  "reference" CHAR(10) NOT NULL UNIQUE,
  "ean" CHAR(13) NOT NULL,
  "length" DECIMAL(15,2) NOT NULL,
  "width" DECIMAL(15,2) NOT NULL,
  "height" DECIMAL(15,2) NOT NULL,
  "product_image_url" TEXT,
  "price" DECIMAL(15,2) NOT NULL,
  "product_blockage_name" CHAR(3) DEFAULT NULL REFERENCES "product_blockage_type"("name") ON UPDATE CASCADE,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ
);


COMMIT;
