import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', nullable: false })
  title!: string;

  @Column({ type: 'text', nullable: false })
  content!: string;

  @Column({ type: 'varchar', nullable: false })
  author!: string;

  @Column({ type: 'varchar', nullable: false })
  excerpt!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
