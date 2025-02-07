import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('base_product')
export class BaseProduct {
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
