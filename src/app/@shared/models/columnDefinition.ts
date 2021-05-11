export interface ColumnDefinition {
  name: string;
  isNullable: boolean;
  dataType: string;
  maximumLength: number;
  isIdentity: boolean;
  isPrimaryKey: boolean;
}
