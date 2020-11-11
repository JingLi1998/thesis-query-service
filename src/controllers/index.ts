import createHttpError from "http-errors";
import { In } from "typeorm";
import {
  AssetUnit,
  Batch,
  BatchStatus,
  Location,
  Logistic,
  LogisticStatus,
  StockUnit,
  Transport,
  TransportStatus,
  TransportUnit,
} from "../../../database/src/entities/supply-chain";

type StockUnitResult = StockUnit & Record<string, any>;

export const getStockUnits = async () => {
  const stock_units: StockUnitResult[] = await StockUnit.find({
    relations: [
      "batches",
      "transactions",
      "transactions.who",
      "transactions.where",
      "transactions.what_stock",
      "transactions.what_batch",
      "transactions.what_logistic",
      "transactions.what_transport",
    ],
  });
  stock_units.forEach((stock_unit) => {
    const isAggregated = stock_unit.batches?.some(
      (batch) => batch.status === BatchStatus.IN_PROGRESS
    );
    stock_unit.isAggregated = isAggregated;
  });
  return stock_units;
};

export const getStockUnit = async (gtin_serial_number: string) => {
  const stock_unit: StockUnitResult | undefined = await StockUnit.findOne(
    gtin_serial_number,
    {
      relations: [
        "product",
        "batches",
        "transactions",
        "transactions.who",
        "transactions.where",
        "transactions.what_stock",
        "transactions.what_batch",
        "transactions.what_logistic",
        "transactions.what_transport",
      ],
    }
  );
  if (!stock_unit) {
    throw createHttpError(400, "No result found");
  }
  const batchIds: number[] = [];
  stock_unit?.batches?.forEach((batch) => batchIds.push(batch.gtin_batch));
  if (!stock_unit) {
    throw createHttpError(400, "No result found");
  }
  let batches: Batch[] = [];
  if (batchIds.length) {
    batches = await Batch.find({
      where: { gtin_batch: In(batchIds) },
      relations: [
        "logistics",
        "transactions",
        "transactions.who",
        "transactions.where",
        "transactions.what_stock",
        "transactions.what_batch",
        "transactions.what_logistic",
        "transactions.what_transport",
      ],
    });
  }
  const logisticIds: number[] = [];
  batches.forEach((batch) =>
    batch.logistics?.forEach((logistic) => logisticIds.push(logistic.sscc))
  );
  let logistics: Logistic[] = [];
  if (logisticIds.length) {
    logistics = await Logistic.find({
      where: { sscc: In(logisticIds) },
      relations: [
        "transports",
        "asset_unit",
        "transactions",
        "transactions.who",
        "transactions.where",
        "transactions.what_stock",
        "transactions.what_batch",
        "transactions.what_logistic",
        "transactions.what_transport",
      ],
    });
  }
  const transportIds: number[] = [];
  logistics.forEach((logistic) =>
    logistic.transports?.forEach((transport) => transportIds.push(transport.id))
  );
  let transports: Transport[] = [];
  if (transportIds.length) {
    transports = await Transport.find({
      where: { id: In(transportIds) },
      relations: [
        "transport_unit",
        "transactions",
        "transactions.who",
        "transactions.where",
        "transactions.what_stock",
        "transactions.what_batch",
        "transactions.what_logistic",
        "transactions.what_transport",
      ],
    });
  }

  const isAggregated = stock_unit.batches?.some(
    (batch) => batch.status === BatchStatus.IN_PROGRESS
  );
  stock_unit.isAggregated = isAggregated;
  return { stock_unit, batches, logistics, transports };
};

type BatchResult = Batch & Record<string, any>;

export const getBatches = async () => {
  const batches: BatchResult[] = await Batch.find({
    relations: [
      "stock_units",
      "logistics",
      "transactions",
      "transactions.who",
      "transactions.where",
      "transactions.what_stock",
      "transactions.what_batch",
      "transactions.what_logistic",
      "transactions.what_transport",
    ],
  });
  batches.forEach((batch) => {
    const isAggregated = batch.logistics?.some(
      (logistic) => logistic.status === LogisticStatus.IN_PROGRESS
    );
    batch.isAggregated = isAggregated;
  });
  return batches;
};

export const getBatch = async (gtin_batch_number: string) => {
  const batch: BatchResult | undefined = await Batch.findOne(
    gtin_batch_number,
    {
      relations: [
        "logistics",
        "transactions",
        "transactions.who",
        "transactions.where",
        "transactions.what_stock",
        "transactions.what_batch",
        "transactions.what_logistic",
        "transactions.what_transport",
      ],
    }
  );
  if (!batch) {
    throw createHttpError(400, "No result found");
  }
  const logisticIds: number[] = [];
  batch.logistics?.forEach((logistic) => logisticIds.push(logistic.sscc));
  let logistics: Logistic[] = [];
  if (logisticIds.length) {
    logistics = await Logistic.find({
      where: { sscc: In(logisticIds) },
      relations: [
        "transports",
        "asset_unit",
        "transactions",
        "transactions.who",
        "transactions.where",
        "transactions.what_stock",
        "transactions.what_batch",
        "transactions.what_logistic",
        "transactions.what_transport",
      ],
    });
  }
  const transportIds: number[] = [];
  logistics.forEach((logistic) =>
    logistic.transports?.forEach((transport) => transportIds.push(transport.id))
  );
  let transports: Transport[] = [];
  if (transportIds.length) {
    await Transport.find({
      where: { id: In(transportIds) },
      relations: [
        "transport_unit",
        "transactions",
        "transactions.who",
        "transactions.where",
        "transactions.what_stock",
        "transactions.what_batch",
        "transactions.what_logistic",
        "transactions.what_transport",
      ],
    });
  }
  const isAggregated = batch.logistics?.some(
    (logistic) => logistic.status === LogisticStatus.IN_PROGRESS
  );
  batch.isAggregated = isAggregated;
  return { batch, logistics, transports };
};

type LogisticResult = Logistic & Record<string, any>;

export const getLogistics = async () => {
  const logistics: LogisticResult[] = await Logistic.find({
    relations: [
      "batches",
      "asset_unit",
      "transports",
      "transactions",
      "transactions.who",
      "transactions.where",
      "transactions.what_stock",
      "transactions.what_batch",
      "transactions.what_logistic",
      "transactions.what_transport",
    ],
  });
  logistics.forEach((logistic) => {
    const isAggregated = logistic.transports?.some(
      (transport) => transport.status === TransportStatus.IN_PROGRESS
    );
    logistic.isAggregated = isAggregated;
  });
  return logistics;
};

export const getLogistic = async (sscc: string) => {
  const logistic: LogisticResult | undefined = await Logistic.findOne(sscc, {
    relations: [
      "transports",
      "asset_unit",
      "transactions",
      "transactions.who",
      "transactions.where",
      "transactions.what_stock",
      "transactions.what_batch",
      "transactions.what_logistic",
      "transactions.what_transport",
    ],
  });
  if (!logistic) {
    throw createHttpError(400, "No result found");
  }
  const transportIds: number[] = [];
  logistic.transports?.forEach((transport) => transportIds.push(transport.id));
  let transports: Transport[] = [];
  if (transportIds.length) {
    transports = await Transport.find({
      where: { id: In(transportIds) },
      relations: [
        "transport_unit",
        "transactions",
        "transactions.who",
        "transactions.where",
        "transactions.what_stock",
        "transactions.what_batch",
        "transactions.what_logistic",
        "transactions.what_transport",
      ],
    });
  }
  const isAggregated = logistic.transports?.some(
    (transport) => transport.status === TransportStatus.IN_PROGRESS
  );
  logistic.isAggregated = isAggregated;
  return { logistic, transports };
};

type TransportResult = Transport & Record<string, any>;

export const getTransports = async () => {
  const transports: TransportResult[] = await Transport.find({
    relations: [
      "logistics",
      "transport_unit",
      "transactions",
      "transactions.who",
      "transactions.where",
      "transactions.what_stock",
      "transactions.what_batch",
      "transactions.what_logistic",
      "transactions.what_transport",
    ],
  });
  return transports;
};

export const getTransport = async (id: string) => {
  const transport = await Transport.findOne(id, {
    relations: [
      "logistics",
      "transport_unit",
      "transactions",
      "transactions.who",
      "transactions.where",
      "transactions.what_stock",
      "transactions.what_batch",
      "transactions.what_logistic",
      "transactions.what_transport",
    ],
  });
  if (!transport) {
    throw createHttpError(400, "No result found");
  }
  return transport;
};

type AssetUnitResult = AssetUnit & Record<string, any>;

export const getAssetUnits = async () => {
  const asset_units: AssetUnitResult[] = await AssetUnit.find({
    relations: ["logistics"],
  });
  return asset_units;
};

export const getAssetUnit = async (grai: string) => {
  const asset_unit: AssetUnitResult | undefined = await AssetUnit.findOne(
    grai,
    {
      relations: ["logistics"],
    }
  );
  if (!asset_unit) {
    throw createHttpError(400, "No result found");
  }
  return asset_unit;
};

type TransportUnitResult = TransportUnit & Record<string, any>;

export const getTransportUnits = async () => {
  const transport_units: TransportUnitResult[] = await TransportUnit.find({
    relations: ["transports"],
  });
  return transport_units;
};

export const getTransportUnit = async (giai: string) => {
  const transport_unit:
    | TransportUnitResult
    | undefined = await TransportUnit.findOne(giai, {
    relations: ["transports"],
  });
  if (!transport_unit) {
    throw createHttpError(400, "No result found");
  }
  return transport_unit;
};

export const getLocations = async () => {
  return await Location.find();
};

export const getLocation = async (gln: string) => {
  const location = await Location.findOne(gln);
  if (!location) {
    throw createHttpError(400, "No result found");
  }
  return location;
};
