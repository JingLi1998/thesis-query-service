import { assert } from "chai";
import dotenv from "dotenv";
import "reflect-metadata";
import { createConnection } from "typeorm";
import * as controller from "../controllers/index";

process.env.NODE_ENV = "test";
dotenv.config();

describe("Testing all controllers", function () {
  before(async function () {
    await createConnection({
      type: "postgres",
      name: "default",
      synchronize: true,
      username: process.env.TEST_DB_USERNAME,
      database: "thesis_test",
      password: process.env.TEST_DB_PASSWORD,
      entities: ["dist/database/src/entities/**/*.js"],
      cli: {
        entitiesDir: "src/entities",
      },
      logging: false,
    });
  });

  it("should be able to query an asset unit", async function () {
    const asset_unit = await controller.getAssetUnit("1");
    assert.containsAllKeys(asset_unit, ["grai", "asset_type", "status"]);
  });

  it("should be able to query a transport unit", async function () {
    const transport_unit = await controller.getTransportUnit("1");
    assert.containsAllKeys(transport_unit, [
      "giai",
      "brand",
      "model",
      "status",
    ]);
  });

  it("should be able to query a location", async function () {
    const location = await controller.getLocation("1");
    assert.containsAllKeys(location, ["gln", "latitude", "longitude"]);
  });

  it("should be able to query a stock unit", async function () {
    const stock_unit = await controller.getStockUnit("1");
    assert.containsAllKeys(stock_unit, [
      "stock_unit",
      "batches",
      "logistics",
      "transports",
    ]);
  });

  it("should be able to query a batch", async function () {
    const batch = await controller.getBatch("1");
    assert.containsAllKeys(batch, ["batch", "logistics", "transports"]);
  });

  it("should be able to query a logistic", async function () {
    const logistic = await controller.getLogistic("1");
    assert.containsAllKeys(logistic, ["logistic", "transports"]);
  });

  it("should be able to query a transport", async function () {
    const transport = await controller.getTransport("1");
    assert.containsAllKeys(transport, [
      "id",
      "status",
      "transport_unit",
      "status",
      "aggregation_date",
      "disaggregation_date",
    ]);
  });
});
