import { trigger, transition, animate, style, state, useAnimation } from '@angular/animations';

import { fadeoutListItemTransitionStyle, inStateListItemStyle, inwardListItemTransition } from './animations';

export const recipeListFadeInTrigger = trigger('recipe-list', [
  state('in', style(inStateListItemStyle)),
  transition('void => *', [
    useAnimation(inwardListItemTransition, {
      params: {
        opacity: 0,
        transform : 'translateX(-100px)',
        time: '300ms'
      }
    })
  ])
]);

export const recipeListFadeOutTrigger = trigger('component-fade-out', [
  transition('* => void', [
    animate(300, style(fadeoutListItemTransitionStyle))
  ])
]);

export const shoppingListTrigger = trigger('shopping-list', [
  state('in', style(inStateListItemStyle)),
  transition('void => *', [
    useAnimation(inwardListItemTransition, {
      params: {
        opacity: 0,
        transform : 'translateX(-100px)',
        time: '300ms'
      }
    })
  ]),
  transition('* => void', [
    animate(300, style(fadeoutListItemTransitionStyle))
  ])
]);

export const recipeEditTrigger = trigger('recipe-edit', [
  state('in', style(inStateListItemStyle)),
  transition('void => *', [
    useAnimation(inwardListItemTransition, {
      params: {
        opacity: 0,
        transform : 'translateX(-100px)',
        time: '300ms'
      }
    })
  ]),
  transition('* => void', [
    animate(300, style(fadeoutListItemTransitionStyle))
  ])
]);
