-- \ c products;

-- CREATE TABLE "base_product" (
--     id SERIAL PRIMARY KEY NOT NULL,
--     ean BIGINT NOT NULL,
--     "name" VARCHAR(255) NOT NULL,
--     "price" NUMERIC(10, 2) NOT NULL,
--     "book" VARCHAR(255) NULL,
--     "curve" VARCHAR(1) NULL,
--     inserted_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
--     updated_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
-- );

-- CREATE TABLE "product" (
--     id SERIAL PRIMARY KEY NOT NULL,
--     ean BIGINT NOT NULL,
--     "origin" VARCHAR(255) NOT NULL,
--     "name" VARCHAR(255) NULL,
--     "price" NUMERIC(10, 2) NULL DEFAULT 0,
--     "observation" TEXT NULL,
--     "brand" VARCHAR(255) NULL,
--     "image" VARCHAR(255) NULL,
--     "sku" BIGINT NOT NULL DEFAULT 0,
--     "exists" BOOLEAN NOT NULL DEFAULT FALSE,
--     "has_stock" BOOLEAN NOT NULL DEFAULT FALSE,
--     "subsidiary_one_stock" INT NOT NULL DEFAULT 0,
--     "subsidiary_two_stock" INT NOT NULL DEFAULT 0,
--     inserted_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
--     updated_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
-- );

-- CREATE UNIQUE INDEX unique_ean_origin_idx ON product (ean, origin);

-- CREATE TABLE "generic_product" (
--     id SERIAL PRIMARY KEY NOT NULL,
--     ean BIGINT NOT NULL UNIQUE,
--     inserted_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
--     updated_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
-- );