import { trigger, transition, animate, style, state, useAnimation } from '@angular/animations';

import { fadeOutTransitionStyle, fadeInTransitionStyle, inwardListItemTransition } from './animations';

const inwardAnimation = transition('void => *', [
  useAnimation(inwardListItemTransition, {
    params: {
      opacity: 0,
      transform : 'translateX(-100px)',
      time: '300ms'
    }
  })
]);

const outwardAnimation = transition('* => void', [
  animate(300, style(fadeOutTransitionStyle))
]);

export const recipeListFadeInTrigger = trigger('recipe-list', [
  state('in', style(fadeInTransitionStyle)),
  inwardAnimation
]);

export const recipeListFadeOutTrigger = trigger('component-fade-out', [
  outwardAnimation
]);

export const shoppingListTrigger = trigger('shopping-list', [
  state('in', style(fadeInTransitionStyle)),
  inwardAnimation,
  outwardAnimation
]);

export const recipeEditTrigger = trigger('recipe-edit', [
  state('in', style(fadeInTransitionStyle)),
  inwardAnimation,
  outwardAnimation
]);
