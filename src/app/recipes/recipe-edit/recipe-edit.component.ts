import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Recipe } from '../recipes.model';
import { RecipeService } from '../recipes.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode: boolean = false;
  recipeEditForm: FormGroup;
  currentRecipe: Recipe;

  constructor(private route: ActivatedRoute, private recipeService: RecipeService, private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap
      .subscribe(
        (params: Params) => {
          if (params.has('id')) {
            this.id = params.get('id');
            this.getRecipe;
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
      const recipe: Recipe = this.recipeService.getRecipeDataUsingIndex(this.id);

      name = recipe.name;
      description = recipe.description;
      imagePath = recipe.imagePath;
      if (recipe && recipe.ingredients.length > 0) {
        for (let ingredient of recipe.ingredients) {
          ingredients.push(new FormGroup({
            'name': new FormControl(ingredient.name, Validators.required),
            'amount': new FormControl(ingredient.amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
          }))
        }
      }

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
      this.recipeService.updateRecipe(this.id, this.recipeEditForm.value);
    } else {
      this.recipeService.addRecipe(this.recipeEditForm.value);
    }
    this.router.navigate(['../'], { relativeTo: this.route });
  }
  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  get getRecipe() {
    const recipe = this.recipeService.getRecipeDataUsingIndex(this.id);
    return recipe;
  }

  removeIngredientFormGroup(index: number) {
    (<FormArray>this.recipeEditForm.get('ingredients')).removeAt(index);
  }
}
