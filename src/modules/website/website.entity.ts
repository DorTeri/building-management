import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Publisher } from '../publisher/publisher.entity';

@Entity()
@Index(['publisher_id', 'name'], { unique: true })
export class Website {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  publisher_id: number;

  @ManyToOne(() => Publisher, (publisher) => publisher.websites, {
    onDelete: 'CASCADE',
  })
  publisher: Publisher;

  @Column()
  name: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
