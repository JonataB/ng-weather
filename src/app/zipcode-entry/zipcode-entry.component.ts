import { Component } from '@angular/core';
import { LocationService } from '../location.service';

@Component({
  selector: 'app-zipcode-entry',
  standalone: true,
  templateUrl: './zipcode-entry.component.html',
})
export class ZipcodeEntryComponent {
  constructor(private service: LocationService) {}

  addLocation(zipcode: string) {
    if (zipcode) {
      this.service.addLocation(zipcode);
    } else {
      alert('Please enter value');
    }
  }
}
