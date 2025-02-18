import { Column, Entity, PrimaryColumn } from 'typeorm';
import { BaseTypeormModel } from './base.typeorm-model';

@Entity('base_product')
export class BaseProductTypeormEntity extends BaseTypeormModel {
  @PrimaryColumn({ type: 'bigint' })
  public id: number;

  @Column({ type: 'bigint' })
  public ean: number;

  @Column({ type: 'varchar', length: 255 })
  public name: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  public price: number;

  @Column({ type: 'varchar', nullable: true, length: 255 })
  public book?: string;

  @Column({ type: 'varchar', nullable: true,  length: 1 })
  public curve?: string;
}
