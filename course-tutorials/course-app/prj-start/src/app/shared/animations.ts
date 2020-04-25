import { animation, style, animate, trigger, transition, query, animateChild, group } from '@angular/animations';

export const inwardListItemTransition = animation([
  style({
    opacity: '{{ opacity }}',
    transform: '{{ transform }}',
  }),
  animate('{{ time }}')
]);

export const fadeoutListItemTransitionStyle = {
  transform: 'translateX(100px)',
  opacity: 0
};

export const inStateListItemStyle = {
  opacity: 1,
  transform: 'translateX(0)'
};
