import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../shared/shared.module";

import { ShoppingEditComponent } from "./shopping-edit/shopping-edit.component";
import { ShoppingListComponent } from "./shopping-list.component";

const shoppingListRoutes: Routes = [
    { path: '', component: ShoppingListComponent },
]
@NgModule({
    declarations: [
        ShoppingListComponent,
        ShoppingEditComponent,
    ],
    imports: [
        FormsModule,
        SharedModule,
        RouterModule.forChild(shoppingListRoutes)
    ]
})
export class ShoppingListModule { }