import { Directive, ViewContainerRef } from "@angular/core";

@Directive({
    selector: "[placeholderDirective]"
})
export class PlaceholderDirective {
    constructor(public viewContainerRef: ViewContainerRef) { }
}