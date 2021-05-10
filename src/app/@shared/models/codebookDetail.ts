import { Codebook } from './Codebook';
import { ColumnDefinition } from './columnDefinition';

export interface CodebookDetail extends Codebook {
  columns: ColumnDefinition[];
}
