export interface RecordChange {
  operation: string;
  recordKey: RecordKey;
  recordChanges: Record<string, any>;
}

export interface RecordKey {
  key: string;
  value: any;
}
