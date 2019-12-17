import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[];
  private ingredChangeSub: Subscription;
  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit() {
    this.ingredients = this.shoppingListService.getShoppingList();
    // could manage updates this way or the below snippet
    // this.shoppingListService.addIngredient.subscribe((ingredient: Ingredient) => {
    //   this.ingredients.push(ingredient);
    // });

    // if you use the above commented method, you don't need the addIngredient() function in the service,
    // and you can just use the EventEmitter that's also named addIngredient
    // with this approach though, your service remains the point where updates are emitted from
    // and then separate components can be subscribers
    // whereas with the above approach, the emitter is shopping-edit.component, and the
    // subscriber is also here in shopping-list.component
    // therefore, with above approach the pub sub logic is in 2 components outside of the service
    // but with this approach 1 part of the pub/sub logic remains inside the service
    this.ingredChangeSub =
      this.shoppingListService.ingredientsChanged
        .subscribe((ingredients: Ingredient[]) => {
            this.ingredients = ingredients
          }
        );
  }

  onEditItem(index: number) {
    this.shoppingListService.startedEditing.next(index);
  }
  
  ngOnDestroy(): void {
    this.ingredChangeSub.unsubscribe();
  }
}
