import { Action } from "@ngrx/store";
import { Ingredient } from "src/app/shared/ingredient.model";

export const ADD_INGREDIENT = '[Shopping List] Add ingredient';
export const ADD_INGREDIENTS = '[Shopping List] Add ingredients';
export const UPDATE_INGREDIENT = '[Shopping List] Update ingredient';
export const DELETE_INGREDIENT = '[Shopping List] Delete Ingredient';

export const START_EDIT = '[Shopping List] start editing ingredient';
export const STOP_EDIT = '[Shopping List] Stop editing ingredient';

// export const addIngredients = createAction(
//     '[Shopping list] add ingredients',
//     props<{ ingredients: Ingredient[] }>()
// );

export class AddIngredient implements Action {
    readonly type = ADD_INGREDIENT;
    constructor(public payload: Ingredient) { }
}

export class AddIngredients implements Action {
    readonly type = ADD_INGREDIENTS;
    constructor(public payload: Ingredient[]) { }
}

export class UpdateIngredient implements Action {
    readonly type = UPDATE_INGREDIENT;
    constructor(public payload: { newIngredient: Ingredient }) { }
}

export class DeleteIngredient implements Action {
    readonly type = DELETE_INGREDIENT;
}

export class StartEditIngredient implements Action {
    readonly type = START_EDIT;
    constructor(public payload: { index: number }) { }
}

export class StopEditIngredient implements Action {
    readonly type = STOP_EDIT;
}


export type shoppingListActionTypes =
    AddIngredient
    | AddIngredients
    | UpdateIngredient
    | DeleteIngredient
    | StartEditIngredient
    | StopEditIngredient;