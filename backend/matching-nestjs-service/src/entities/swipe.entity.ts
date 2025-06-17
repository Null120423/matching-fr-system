import { Column, Entity } from 'typeorm';
import { BaseEntityCustom } from './base.entity';

export enum SwipeAction {
  LIKE = 'like',
  PASS = 'pass',
}

@Entity('swipe')
export class SwipeEntity extends BaseEntityCustom {
  @Column()
  swiperId: string;

  @Column()
  swipedId: string;

  @Column({ type: 'enum', enum: SwipeAction })
  action: SwipeAction;
}
