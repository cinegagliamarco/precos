import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('base_products')
export class BaseProduct {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'varchar', length: 255 })
  public name: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  public price: number;

  @Column({ type: 'bigint' })
  public ean: number;
}
