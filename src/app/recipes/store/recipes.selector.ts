import { createSelector } from "@ngrx/store";
import { AppState } from "src/app/store/app.reducer"
import { RecipesState } from "./recipes.reducer";

export const selectFeature = (state: AppState) => state.recipes;

export const selectRecipes = createSelector(
    selectFeature,
    (state: RecipesState) => state.recipes
);