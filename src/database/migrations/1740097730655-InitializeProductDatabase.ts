import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitializeProductDatabase1740097730655 implements MigrationInterface {
  name = 'InitializeProductDatabase1740097730655';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."origin_enum" AS ENUM('DROGAL', 'DROGASIL')`);
    await queryRunner.query(
      `CREATE TABLE "product" ("id" SERIAL NOT NULL, "ean" bigint NOT NULL, "name" character varying(255), "origin" "public"."origin_enum" NOT NULL, "price" numeric(10,2) NOT NULL DEFAULT '0', "observation" text, "brand" character varying(255), "image" character varying(255), "sku" bigint NOT NULL, "subsidiary_one_stock" integer NOT NULL DEFAULT '0', "subsidiary_two_stock" integer NOT NULL DEFAULT '0', "has_stock" boolean NOT NULL DEFAULT false, "exists" boolean NOT NULL DEFAULT false, "inserted_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "generic_product" ("id" SERIAL NOT NULL, "ean" bigint NOT NULL, "inserted_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_c89a787685686e859d719e68926" UNIQUE ("ean"), CONSTRAINT "PK_fbb40c6de436fdd145bb57a382e" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "base_product" ("id" SERIAL NOT NULL, "ean" bigint NOT NULL, "name" character varying(255) NOT NULL, "price" numeric(10,2) NOT NULL, "book" character varying(255), "curve" character varying(1), "inserted_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_0ef9c06b3a37b436970e697dcfc" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "base_product"`);
    await queryRunner.query(`DROP TABLE "generic_product"`);
    await queryRunner.query(`DROP TABLE "product"`);
    await queryRunner.query(`DROP TYPE "public"."origin_enum"`);
  }
}
