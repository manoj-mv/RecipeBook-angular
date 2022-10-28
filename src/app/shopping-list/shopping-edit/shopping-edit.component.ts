import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  editMode: boolean = false;
  editedItemIndex: number;
  editedItem: Ingredient;
  @ViewChild('f') slForm: NgForm;

  constructor(private slService: ShoppingListService) { }

  ngOnInit(): void {
    this.subscription = this.slService.startedEditing.subscribe((id: number) => {
      this.editedItemIndex = id;
      this.editMode = true;
      this.editedItem = this.slService.getIngredient(this.editedItemIndex);
      this.slForm.setValue({
        'name': this.editedItem.name,
        'amount': this.editedItem.amount
      })
    });
  }

  onSubmit(f: NgForm) {
    const ingName = f.value.name;
    const ingAmount = f.value.amount;
    const newIngredient = new Ingredient(ingName, ingAmount);
    if (this.editMode) {
      this.updateIngredient(newIngredient);
    } else {
      this.addIngredient(newIngredient);
    }
    this.onReset();
  }
  addIngredient(newIngredient: Ingredient) {
    this.slService.addIngredient(newIngredient);
  }

  updateIngredient(ingredient: Ingredient) {
    this.slService.updateIngredient(this.editedItemIndex, ingredient);
  }

  onReset() {
    this.slForm.reset();
    this.editMode = false;
  }

  onDelete() {
    this.slService.deleteIngredeient(this.editedItemIndex);
    this.onReset();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
