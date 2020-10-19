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
  const stocks: StockUnitResult[] = await StockUnit.find({
    relations: ["batches", "transactions"],
  });
  stocks.forEach((stock) => {
    const isAggregated = stock.batches.some(
      (batch) => batch.status === BatchStatus.IN_PROGRESS
    );
    stock.isAggregated = isAggregated;
  });
  return stocks;
};

type BatchResult = Batch & Record<string, any>;

export const getBatches = async () => {
  const batches: BatchResult[] = await Batch.find({
    relations: ["stock_units", "logistics", "transactions"],
  });
  batches.forEach((batch) => {
    const isAggregated = batch.logistics.some(
      (logistic) => logistic.status === LogisticStatus.IN_PROGRESS
    );
    batch.isAggregated = isAggregated;
  });
  return batches;
};

type LogisticResult = Logistic & Record<string, any>;

export const getLogistics = async () => {
  const logistics: LogisticResult[] = await Logistic.find({
    relations: ["batches", "asset_unit", "transports", "transactions"],
  });
  logistics.forEach((logistic) => {
    const isAggregated = logistic.transports.some(
      (transport) => transport.status === TransportStatus.IN_PROGRESS
    );
    logistic.isAggregated = isAggregated;
  });
  return logistics;
};

type TransportResult = Transport & Record<string, any>;

export const getTransports = async () => {
  const transports: TransportResult[] = await Transport.find({
    relations: ["logistics", "transport_unit", "transactions"],
  });
  return transports;
};

type AssetUnitResult = AssetUnit & Record<string, any>;

export const getAssetUnits = async () => {
  const asset_units: AssetUnitResult[] = await AssetUnit.find({
    relations: ["logistics"],
  });
  return asset_units;
};

type TransportUnitResult = TransportUnit & Record<string, any>;

export const getTransportUnits = async () => {
  const transport_units: TransportUnitResult[] = await TransportUnit.find({
    relations: ["transports"],
  });
  return transport_units;
};

export const getLocations = async () => {
  return await Location.find();
};
