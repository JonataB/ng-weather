import { Component, inject, Signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ConditionsAndZip } from '../conditions-and-zip.type';
import { LocationService } from '../location.service';
import { WeatherService } from '../weather.service';
import { TabComponent } from 'app/shared/components/tab/tab.component';
import { TabDirective } from 'app/shared/components/tab/tab.directive';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-current-conditions',
  standalone: true,
  imports: [TabComponent, TabDirective, DecimalPipe, RouterLink],
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css'],
})
export class CurrentConditionsComponent {
  private router = inject(Router);
  private weatherService = inject(WeatherService);
  protected locationService = inject(LocationService);
  protected currentConditionsByZip: Signal<ConditionsAndZip[]> =
    this.weatherService.getCurrentConditions();

  sortByZipCodeFn = (a: TabDirective, b: TabDirective) => {
    return a.name.localeCompare(b.name);
  };

  showForecast(zipcode: string): void {
    this.router.navigate(['/forecast', zipcode]);
  }

  onClose(index: number): void {
    const zipCode = this.currentConditionsByZip()[index].zip;
    this.locationService.removeLocation(zipCode);
    this.weatherService.removeCurrentConditions(zipCode);
  }
}
