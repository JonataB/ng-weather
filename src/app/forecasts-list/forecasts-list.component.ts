import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject, Input, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WeatherService } from '../weather.service';
import { Forecast } from './forecast.type';

@Component({
  selector: 'app-forecasts-list',
  standalone: true,
  imports: [RouterLink, DatePipe, DecimalPipe],
  templateUrl: './forecasts-list.component.html',
  styleUrls: ['./forecasts-list.component.css'],
})
export default class ForecastsListComponent {
  weatherService = inject(WeatherService);

  @Input() set zipcode(value: string) {
    if (value) {
      this.weatherService.getForecast(value);
    }
  }

  protected forecastByZip: Signal<Forecast> =
    this.weatherService.getForecastByZip();
}
