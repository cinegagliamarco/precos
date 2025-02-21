import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTypeormModel } from './base.typeorm-model';
import { Origin } from '../../common/origin.enum';

@Entity('product')
export class ProductTypeormEntity extends BaseTypeormModel {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    type: 'bigint',
    transformer: { to: (value: number) => value, from: (value: string) => Number(value) }
  })
  public ean: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  public name: string;

  @Column({
    type: 'enum',
    enum: Origin,
    enumName: 'origin_enum'
  })
  public origin: Origin;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  public price: number;

  @Column({ type: 'text', nullable: true })
  public observation: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  public brand: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  public image: string;

  @Column({ type: 'bigint', transformer: { to: (value: number) => value, from: (value: string) => Number(value) } })
  public sku: number;

  @Column({ type: 'int', default: 0, nullable: false, name: 'subsidiary_one_stock' })
  public subsidiaryOneStock: number;

  @Column({ type: 'int', default: 0, nullable: false, name: 'subsidiary_two_stock' })
  public subsidiaryTwoStock: number;

  @Column({ type: 'boolean', default: false, nullable: false, name: 'has_stock' })
  public hasStock: boolean;

  @Column({ type: 'boolean', default: false, nullable: false, name: 'exists' })
  public exists: boolean;
}
