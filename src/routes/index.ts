import { Router } from "express";
import { asyncMiddleware } from "../middleware/asyncMiddleware";
import * as controller from "../controllers";
import { roleMiddleware } from "../middleware/roleMiddleware";

export const router = Router();

router.get(
  "/stock-units",
  asyncMiddleware(async (_req, res) => {
    const stock_units = await controller.getStockUnits();
    return res.status(200).json({ stock_units });
  })
);

router.get(
  "/stock-unit/:id",
  roleMiddleware,
  asyncMiddleware(async (req, res) => {
    const stock_unit = await controller.getStockUnit(req.params.id);
    return res.status(200).json({ stock_unit });
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
  "/batch/:id",
  roleMiddleware,
  asyncMiddleware(async (req, res) => {
    const batch = await controller.getBatch(req.params.id);
    return res.status(200).json({ batch });
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
  "/logistic/:id",
  roleMiddleware,
  asyncMiddleware(async (req, res) => {
    const logistic = await controller.getLogistic(req.params.id);
    return res.status(200).json({ logistic });
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
  "/asset-unit/:id",
  roleMiddleware,
  asyncMiddleware(async (req, res) => {
    const asset_unit = await controller.getAssetUnit(req.params.id);
    return res.status(200).json({ asset_unit });
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
  "/transport/:id",
  roleMiddleware,
  asyncMiddleware(async (req, res) => {
    const transport = await controller.getTransport(req.params.id);
    return res.status(200).json({ transport });
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
  "/transport-unit/:id",
  roleMiddleware,
  asyncMiddleware(async (req, res) => {
    const transport_unit = await controller.getTransportUnit(req.params.id);
    return res.status(200).json({ transport_unit });
  })
);

router.get(
  "/locations",
  asyncMiddleware(async (_req, res) => {
    const locations = await controller.getLocations();
    return res.status(200).json({ locations });
  })
);

router.get(
  "/location/:id",
  roleMiddleware,
  asyncMiddleware(async (req, res) => {
    const location = await controller.getLocation(req.params.id);
    return res.status(200).json({ location });
  })
);
