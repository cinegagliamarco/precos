import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

export class BaseTypeormModel {
  @CreateDateColumn({ name: 'inserted_date', type: 'timestamptz', nullable: false })
  public insertedDate: Date;

  @UpdateDateColumn({ name: 'updated_date', type: 'timestamptz', nullable: false })
  public updatedDate: Date;
}
