import { Component } from '@angular/core';
import { MatCard, MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-review-success',
  standalone: true,
  imports: [
    MatCardModule,
    TranslateModule
  ],
  templateUrl: './review-success.component.html',
  styleUrl: './review-success.component.scss'
})
export class ReviewSuccessComponent {

}
