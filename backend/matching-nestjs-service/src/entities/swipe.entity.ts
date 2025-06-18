import { Column, Entity } from 'typeorm';
import { BaseEntityCustom } from './base.entity';

export enum SwipeAction {
  LIKE = 'LIKE',
  PASS = 'PASS',
}

export const SwipeActionData = {
  [SwipeAction.LIKE]: {
    value: SwipeAction.LIKE,
    label: 'Like',
    name: 'Like',
    color: '#008000',
  },
  [SwipeAction.PASS]: {
    value: SwipeAction.PASS,
    label: 'Pass',
    name: 'Pass',
    color: '#FF0000',
  },
};

@Entity('swipe')
export class SwipeEntity extends BaseEntityCustom {
  @Column()
  swiperId: string;

  @Column()
  swipedId: string;

  @Column({ type: 'enum', enum: SwipeAction })
  action: SwipeAction;
}
