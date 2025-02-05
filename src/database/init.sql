\c products;

CREATE TABLE base_products (
    id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(255) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    ean BIGINT NOT NULL
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY NOT NULL,
    origin VARCHAR(255) NOT NULL, -- drogasil or drogal only
    name VARCHAR(255) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    observation TEXT,
    brand VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    sku BIGINT NOT NULL,
    ean BIGINT NOT NULL
);