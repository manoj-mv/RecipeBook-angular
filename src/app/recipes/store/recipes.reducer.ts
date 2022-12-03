import { createReducer, on } from "@ngrx/store";
import { Recipe } from "../recipes.model";
import * as RecipesActions from './recipes.action';

export interface RecipesState {
    recipes: Recipe[];
}

export const initialState: RecipesState = {
    recipes: null
}
export const recipeReducer = createReducer(initialState,
    on(RecipesActions.setRecipes, (state, action) => {
        console.log(state);

        return {
            ...state,
            recipes: [...action.recipes]
        }
    }),
    on(RecipesActions.fetchRecipesSuccess, (state, action) => {
        return {
            ...state,
            recipes: action.recipes
        }
    }),
    on(RecipesActions.fetchRecipesFail, (state, action) => {
        return {
            ...state,
            recipes: null
        }
    }),
    on(RecipesActions.addRecipe, (state, action) => {
        return {
            ...state,
            recipes: [...state.recipes, action.newRecipe]
        }
    }),
    on(RecipesActions.updateRecipe, (state, action) => {
        const updatedRecipe = { ...state.recipes[action.index], ...action.updatedRecipe };
        const updatedRecipes = [...state.recipes];
        updatedRecipes[action.index] = updatedRecipe;

        return {
            ...state,
            recipes: updatedRecipes
        }
    }),
    on(RecipesActions.deleteRecipe, (state, action) => {
        return {
            ...state,
            recipes: state.recipes.filter((recipe, index) => index !== action.index)
        }
    })

);