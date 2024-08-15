import { Component } from '@angular/core';
import { CurrentConditionsComponent } from 'app/current-conditions/current-conditions.component';
import { ZipcodeEntryComponent } from 'app/zipcode-entry/zipcode-entry.component';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [ZipcodeEntryComponent, CurrentConditionsComponent],
  templateUrl: './main-page.component.html',
})
export class MainPageComponent {}
