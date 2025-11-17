import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Website } from '../website/website.entity';

@Entity()
@Index(['name'], { unique: true })
export class Publisher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 255 })
  name: string;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 255 })
  contact_name: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Website, (website) => website.publisher, { cascade: true })
  websites: Website[];
}
