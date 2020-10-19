import { Router } from "express";
import { asyncMiddleware } from "../middleware/asyncMiddleware";
import * as controller from "../controllers";

export const router = Router();

router.get(
  "/stock-units",
  asyncMiddleware(async (_req, res) => {
    const stock_units = await controller.getStockUnits();
    return res.status(200).json({ stock_units });
  })
);

router.get(
  "/batches",
  asyncMiddleware(async (_req, res) => {
    const batches = await controller.getBatches();
    return res.status(200).json({ batches });
  })
);

router.get(
  "/logistics",
  asyncMiddleware(async (_req, res) => {
    const logistics = await controller.getLogistics();
    return res.status(200).json({ logistics });
  })
);

router.get(
  "/transports",
  asyncMiddleware(async (_req, res) => {
    const transports = await controller.getTransports();
    return res.status(200).json({ transports });
  })
);

router.get(
  "/asset-units",
  asyncMiddleware(async (_req, res) => {
    const asset_units = await controller.getAssetUnits();
    return res.status(200).json({ asset_units });
  })
);

router.get(
  "/transport-units",
  asyncMiddleware(async (_req, res) => {
    const transport_units = await controller.getTransportUnits();
    return res.status(200).json({ transport_units });
  })
);

router.get(
  "/locations",
  asyncMiddleware(async (_req, res) => {
    const locations = await controller.getLocations();
    return res.status(200).json({ locations });
  })
);
