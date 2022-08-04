import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipes.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [
    new Recipe('A Test Recipe', 'Test', 'https://assets.bonappetit.com/photos/62e2b81a029c78e6c977d31b/1:1/w_960,c_limit/0728-blueberry-muffin-cake-recipe-lede.jpg'),
    new Recipe('Test Recipe 2', 'Test 2', 'https://www.averiecooks.com/wp-content/uploads/2021/01/garlicbutterchicken-5.jpg')
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
