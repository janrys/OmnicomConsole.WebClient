import { ColumnDefinition } from '@app/@shared/models/columnDefinition';

export interface DialogNewcodebookDataModel {
  data: any;
  isNewRecord: boolean;
  columns: ColumnDefinition[];
}
