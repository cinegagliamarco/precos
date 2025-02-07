\c products;

CREATE TABLE "base_product" (
    id SERIAL PRIMARY KEY NOT NULL,
    ean BIGINT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "price" NUMERIC(10,2) NOT NULL,
    "book" VARCHAR(255) NULL,
    "curve" VARCHAR(1) NULL
);

CREATE TABLE "product" (
    id SERIAL PRIMARY KEY NOT NULL,
    ean BIGINT NOT NULL,
    "origin" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "price" NUMERIC(10,2) NOT NULL,
    "observation" TEXT NULL,
    "brand" VARCHAR(255) NOT NULL,
    "image" VARCHAR(255) NULL,
    "sku" BIGINT NOT NULL
);
