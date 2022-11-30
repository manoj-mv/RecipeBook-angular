
import { Ingredient } from "src/app/shared/ingredient.model";
import * as ShoppingListActions from "./shopping-list.actions";
export interface State {
    ingredients: Ingredient[],
    editMode: boolean,
    editedIngredient: Ingredient,
    editedIngredientIndex: number
}

const initialState: State = {
    ingredients: [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10)
    ],
    editMode: false,
    editedIngredient: null,
    editedIngredientIndex: -1
}
export function shoppingListReducer(state = initialState, action: ShoppingListActions.shoppingListActionTypes) {
    switch (action.type) {
        case ShoppingListActions.ADD_INGREDIENT:
            return {
                ...state,
                ingredients: [...state.ingredients, action.payload]
            };
        case ShoppingListActions.ADD_INGREDIENTS:
            return {
                ...state,
                ingredients: [...state.ingredients, ...action.payload]
            };
        case ShoppingListActions.UPDATE_INGREDIENT:
            let ingredients: Ingredient[] = [...state.ingredients];
            ingredients[state.editedIngredientIndex] = action.payload.newIngredient;
            return {
                ...state,
                ingredients: ingredients,
                editedIngredientIndex: -1,
                editedIngredient: null
            };

        case ShoppingListActions.DELETE_INGREDIENT:
            return {
                ...state,
                ingredients: state.ingredients.filter((ingredient, index) => index != state.editedIngredientIndex),
                editedIngredientIndex: -1,
                editedIngredient: null
            }
        case ShoppingListActions.START_EDIT:
            const editedItem = { ...state.ingredients[action.payload.index] };
            return {
                ...state,
                editedIngredientIndex: action.payload.index,
                editedIngredient: editedItem,
                editMode: true
            }

        case ShoppingListActions.STOP_EDIT:
            return {
                ...state,
                editedIngredientIndex: -1,
                editedIngredient: null,
                editMode: false
            }

        default:
            return state;
    }
}