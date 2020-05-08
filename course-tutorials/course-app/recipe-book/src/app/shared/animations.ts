import { animation, style, animate } from '@angular/animations';

export const inwardListItemTransition = animation([
  style({
    opacity: '{{ opacity }}',
    transform: '{{ transform }}',
  }),
  animate('{{ time }}')
]);

export const fadeOutTransitionStyle = {
  transform: 'translateX(100px)',
  opacity: 0
};

export const fadeInTransitionStyle = {
  opacity: 1,
  transform: 'translateX(0)'
};
