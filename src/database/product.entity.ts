import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'varchar', length: 255 })
  public origin: string; // drogasil or drogal only

  @Column({ type: 'varchar', length: 255 })
  public name: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  public price: number;

  @Column({ type: 'text', nullable: true })
  public observation: string;

  @Column({ type: 'varchar', length: 255 })
  public brand: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  public image: string;

  @Column({ type: 'bigint' })
  public sku: number;

  @Column({ type: 'bigint' })
  public ean: number;
}
