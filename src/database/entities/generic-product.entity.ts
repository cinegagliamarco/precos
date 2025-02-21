import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTypeormModel } from './base.typeorm-model';

@Entity('generic_product')
export class GenericProductTypeormEntity extends BaseTypeormModel {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'bigint', unique: true, transformer: { to: (value: number) => value, from: (value: string) => Number(value) } })
  public ean: number;
}
