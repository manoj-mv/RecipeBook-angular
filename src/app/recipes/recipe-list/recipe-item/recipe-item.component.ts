import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Recipe } from '../../recipes.model';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.css']
})
export class RecipeItemComponent implements OnInit {
  @Input() recipe: Recipe;
  @Output() recipeItemClickedEvent = new EventEmitter<void>();
  constructor() { }

  ngOnInit(): void {
  }
  onRecipeItemClicked() {
    this.recipeItemClickedEvent.emit();
  }
}
