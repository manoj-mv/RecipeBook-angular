import { Component, EventEmitter, Output } from "@angular/core";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent {
    collapsed = true;
    @Output() linkClickedEvent = new EventEmitter<string>();

    onNavbarLinkClicked(linkClicked: string) {
        this.linkClickedEvent.emit(linkClicked);
    }
}