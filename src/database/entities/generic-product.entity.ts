import { Column, Entity, PrimaryColumn } from 'typeorm';
import { BaseTypeormModel } from './base.typeorm-model';

@Entity('generic_product')
export class GenericProductTypeormEntity extends BaseTypeormModel {
  @PrimaryColumn({ type: 'bigint' })
  public id: number;

  @Column({ type: 'bigint', unique: true })
  public ean: number;
}
