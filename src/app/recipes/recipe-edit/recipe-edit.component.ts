import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Subscription, take } from 'rxjs';
import * as fromApp from 'src/app/store/app.reducer';
import { Recipe } from '../recipes.model';
import { addRecipe, updateRecipe } from '../store/recipes.action';
import * as fromRecipeSelector from '../store/recipes.selector';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  id: number;
  editMode: boolean = false;
  recipeEditForm: FormGroup;
  currentRecipe: Recipe;
  storeSub: Subscription;

  constructor(private route: ActivatedRoute, private router: Router,
    private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.route.paramMap
      .subscribe(
        (params: Params) => {
          if (params.has('id')) {
            this.id = params.get('id');
            this.editMode = true;
          } else {
            this.editMode = false;
          }
        }
      );

    this.initForm();
  }

  private initForm() {
    let name = '';
    let description = '';
    let imagePath = '';
    let ingredients: FormArray = new FormArray([]);

    if (this.editMode) {
      // const recipe: Recipe = this.recipeService.getRecipeDataUsingIndex(this.id);

      this.storeSub = this.store.select(fromRecipeSelector.selectRecipes).pipe(
        take(1),
        map(recipes => {
          return recipes.find((recipe, index) => {
            return Number(this.id) === index;
          })
        })
      ).subscribe(recipe => {
        name = recipe.name;
        description = recipe.description;
        imagePath = recipe.imagePath;
        if (recipe && recipe.ingredients && recipe.ingredients.length > 0) {
          for (let ingredient of recipe.ingredients) {
            ingredients.push(new FormGroup({
              'name': new FormControl(ingredient.name, Validators.required),
              'amount': new FormControl(ingredient.amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
            }))
          }
        }
      }
      );


      // ingredients = recipe.ingredients;
    }
    this.recipeEditForm = new FormGroup({
      'name': new FormControl(name, Validators.required),
      'description': new FormControl(description, Validators.required),
      'imagePath': new FormControl(imagePath, Validators.required),
      'ingredients': ingredients,
    })
  }

  get getIngredientControls() {
    return (<FormArray>this.recipeEditForm.get('ingredients')).controls;
  }

  onAddingredient() {
    (<FormArray>this.recipeEditForm.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount': new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
      })
    )
  }
  onSubmit() {
    if (this.editMode) {
      // this.recipeService.updateRecipe(this.id, this.recipeEditForm.value);
      this.store.dispatch(updateRecipe({ index: this.id, updatedRecipe: this.recipeEditForm.value }));
    } else {
      // this.recipeService.addRecipe(this.recipeEditForm.value);
      this.store.dispatch(addRecipe({ newRecipe: this.recipeEditForm.value }));
    }
    this.router.navigate(['../'], { relativeTo: this.route });
  }
  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  // get getRecipe() {
  //   const recipe = this.recipeService.getRecipeDataUsingIndex(this.id);
  //   return recipe;
  // }

  removeIngredientFormGroup(index: number) {
    (<FormArray>this.recipeEditForm.get('ingredients')).removeAt(index);
  }

  ngOnDestroy(): void {
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }
}
