import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  RelationId,
} from 'typeorm';
import { Publisher } from '../publisher/publisher.entity';

@Entity()
@Index(['publisher', 'name'], { unique: false })
export class Website {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Publisher, (publisher) => publisher.websites, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'publisher_id' })
  publisher: Publisher;

  @RelationId((website: Website) => website.publisher)
  publisher_id: number;

  @Column({ length: 255 })
  name: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
