import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTypeormModel } from './base.typeorm-model';

@Entity('import_process')
export class ImportProcessTypeormEntity extends BaseTypeormModel {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'boolean' })
  public finished: boolean;
}
