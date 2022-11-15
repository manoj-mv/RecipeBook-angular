import { Component } from "@angular/core";
import { DataStorageService } from "../shared/data-storage.service";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
})
export class HeaderComponent {

    constructor(private storageService: DataStorageService) { }

    collapsed = true;

    onSaveData() {
        this.storageService.storeRecipes();
    }

    onFetchData() {
        this.storageService.fetchRecipes().subscribe();
    }
}