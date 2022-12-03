import { createAction, props } from "@ngrx/store";
import { Recipe } from "../recipes.model";

export const FETCH_RECIPES = '[Recipes] Fetch recipes';
export const FETCH_RECIPES_SUCCESS = '[Recipes] Fetch recipes success';
export const FETCH_RECIPES_FAIL = '[Recipes] Fetch recipes fail';

export const ADD_RECIPE = '[Recipes] Add recipe';
export const UPDATE_RECIPE = '[Recipes] Update recipe';
export const DELETE_RECIPE = '[Recipes] Delete recipe';

export const STORE_RECIPES = '[Recipes] Store recipes';
export const STORE_RECIPES_SUCCESS = '[Recipes] Store recipes success';
export const STORE_RECIPES_FAIL = '[Recipes] Store recipes fail';

export const setRecipes = createAction(
    '[Recipes] Get recipes',
    props<{ recipes: Recipe[] }>()
);

export const fetchRecipes = createAction(
    FETCH_RECIPES,
);

export const fetchRecipesSuccess = createAction(
    FETCH_RECIPES_SUCCESS,
    props<{ recipes: Recipe[] }>()
);

export const fetchRecipesFail = createAction(
    FETCH_RECIPES_FAIL
)

export const addRecipe = createAction(
    ADD_RECIPE,
    props<{ newRecipe: Recipe }>()
)

export const updateRecipe = createAction(
    UPDATE_RECIPE,
    props<{ updatedRecipe: Recipe, index: number }>()
)

export const deleteRecipe = createAction(
    DELETE_RECIPE,
    props<{ index: number }>()
)

export const storeRecipes = createAction(
    STORE_RECIPES,
    // props<{ recipes: Recipe[] }>()
);

export const storeRecipeSuccess = createAction(
    STORE_RECIPES_SUCCESS,
    props<{ recipes: Recipe[] }>()
);

export const storeRecipeFail = createAction(
    STORE_RECIPES_FAIL,
);


