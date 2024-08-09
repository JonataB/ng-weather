import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export const LOCATIONS: string = "locations";

@Injectable()
export class LocationService {

  private locations = new BehaviorSubject<string[]>([]);
  locations$ = this.locations.asObservable();

  private get locationsValues(): string[] {
    return this.locations.value;
  }

  constructor() {
    let locString = localStorage.getItem(LOCATIONS);
    if (locString) {
      this.locations.next(JSON.parse(locString));
    }
  }

  addLocation(zipcode: string) {
    if (zipcode && !this.locationsValues.includes(zipcode)) {
      this.locations.next([...this.locationsValues, zipcode]);
      localStorage.setItem(LOCATIONS, JSON.stringify(this.locations.value));
    }
  }

  removeLocation(zipcode: string) {
    const locations = this.locationsValues.filter(loc => loc !== zipcode);
    this.locations.next([...locations]);
    localStorage.setItem(LOCATIONS, JSON.stringify(locations));
  }
}
