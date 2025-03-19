import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-button',
  imports: [ButtonModule],
  templateUrl: './button.component.html',
  standalone: true,
  styleUrl: './button.component.scss'
})
export class ButtonComponent {

}
