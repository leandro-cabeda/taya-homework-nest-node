import { MigrationInterface, QueryRunner } from "typeorm";

export class Schema1728437670849 implements MigrationInterface {
    name = 'Schema1728437670849'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "fullName" varchar NOT NULL, "totalProposal" decimal(10,2) NOT NULL DEFAULT (0), "email" varchar NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"))`);
        await queryRunner.query(`CREATE TABLE "customer" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "balance" decimal(10,2) NOT NULL DEFAULT (0), "userId" integer)`);
        await queryRunner.query(`CREATE TABLE "proposal" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "profit" decimal(10,2) NOT NULL DEFAULT (0), "status" varchar CHECK( "status" IN ('PENDING','REFUSED','ERROR','SUCCESSFUL') ) NOT NULL DEFAULT ('PENDING'), "userId" integer, "customerId" integer)`);
        await queryRunner.query(`CREATE TABLE "temporary_customer" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "balance" decimal(10,2) NOT NULL DEFAULT (0), "userId" integer, CONSTRAINT "FK_3f62b42ed23958b120c235f74df" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_customer"("id", "name", "balance", "userId") SELECT "id", "name", "balance", "userId" FROM "customer"`);
        await queryRunner.query(`DROP TABLE "customer"`);
        await queryRunner.query(`ALTER TABLE "temporary_customer" RENAME TO "customer"`);
        await queryRunner.query(`CREATE TABLE "temporary_proposal" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "profit" decimal(10,2) NOT NULL DEFAULT (0), "status" varchar CHECK( "status" IN ('PENDING','REFUSED','ERROR','SUCCESSFUL') ) NOT NULL DEFAULT ('PENDING'), "userId" integer, "customerId" integer, CONSTRAINT "FK_de14a768fe600bb1e723b32377e" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_b7f525c4957a9bec0d227138907" FOREIGN KEY ("customerId") REFERENCES "customer" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_proposal"("id", "profit", "status", "userId", "customerId") SELECT "id", "profit", "status", "userId", "customerId" FROM "proposal"`);
        await queryRunner.query(`DROP TABLE "proposal"`);
        await queryRunner.query(`ALTER TABLE "temporary_proposal" RENAME TO "proposal"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "proposal" RENAME TO "temporary_proposal"`);
        await queryRunner.query(`CREATE TABLE "proposal" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "profit" decimal(10,2) NOT NULL DEFAULT (0), "status" varchar CHECK( "status" IN ('PENDING','REFUSED','ERROR','SUCCESSFUL') ) NOT NULL DEFAULT ('PENDING'), "userId" integer, "customerId" integer)`);
        await queryRunner.query(`INSERT INTO "proposal"("id", "profit", "status", "userId", "customerId") SELECT "id", "profit", "status", "userId", "customerId" FROM "temporary_proposal"`);
        await queryRunner.query(`DROP TABLE "temporary_proposal"`);
        await queryRunner.query(`ALTER TABLE "customer" RENAME TO "temporary_customer"`);
        await queryRunner.query(`CREATE TABLE "customer" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "balance" decimal(10,2) NOT NULL DEFAULT (0), "userId" integer)`);
        await queryRunner.query(`INSERT INTO "customer"("id", "name", "balance", "userId") SELECT "id", "name", "balance", "userId" FROM "temporary_customer"`);
        await queryRunner.query(`DROP TABLE "temporary_customer"`);
        await queryRunner.query(`DROP TABLE "proposal"`);
        await queryRunner.query(`DROP TABLE "customer"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
