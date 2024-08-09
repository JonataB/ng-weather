import { Component, inject, Signal } from '@angular/core';
import { Router } from "@angular/router";
import { ConditionsAndZip } from '../conditions-and-zip.type';
import { LocationService } from "../location.service";
import { WeatherService } from "../weather.service";

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css']
})
export class CurrentConditionsComponent {

  private router = inject(Router);
  private weatherService = inject(WeatherService);
  protected locationService = inject(LocationService);
  protected currentConditionsByZip: Signal<ConditionsAndZip[]> = this.weatherService.getCurrentConditions();

  showForecast(zipcode : string): void{
    this.router.navigate(['/forecast', zipcode])
  }

  trackByZipcode(_index: number, location: ConditionsAndZip): string {
    return location.zip;
  }

  onClose(index: number): void {
    const zipCode = this.currentConditionsByZip()[index].zip;
    this.locationService.removeLocation(zipCode);
    this.weatherService.removeCurrentConditions(zipCode);
  }
}
