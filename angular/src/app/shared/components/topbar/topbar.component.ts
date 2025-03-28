import { Component } from '@angular/core';
import { StyleClassModule } from 'primeng/styleclass';
import { Router, RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { OverlayBadgeModule } from 'primeng/overlaybadge';

@Component({
  selector: 'app-topbar',
    imports: [RouterModule, StyleClassModule, ButtonModule, RippleModule,OverlayBadgeModule],
    standalone: true,
    templateUrl: './topbar.component.html',
    styleUrl: './topbar.component.scss'})

    export class TopbarWidget {
    constructor(public router: Router) {}
}
