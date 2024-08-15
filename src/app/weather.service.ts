import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Signal, signal } from '@angular/core';
import { tap } from 'rxjs/operators';
import { CacheDataService } from './cache-data.service';
import { ConditionsAndZip } from './conditions-and-zip.type';
import { CurrentConditions } from './current-conditions/current-conditions.type';
import { Forecast } from './forecasts-list/forecast.type';
import { LocationService } from './location.service';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  static readonly URL = 'https://api.openweathermap.org/data/2.5';
  static readonly APPID = '5a4b2d457ecbef9eb2a71e480b947604';
  static readonly ICON_URL =
    'https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/';

  private currentConditions = signal<ConditionsAndZip[]>([]);
  private forecastConditions = signal<Forecast>({} as Forecast);

  readonly cacheDurationSeconds = 7200;

  http = inject(HttpClient);
  weatherService = inject(LocationService);
  cacheDataService = inject(CacheDataService);

  constructor() {
    this.weatherService.locations$
      .pipe(
        tap((locations: string[]) => {
          const existingZips = this.currentConditions().map((cond) => cond.zip);
          locations
            .filter((loc) => !existingZips.includes(loc))
            .forEach((loc: string) => this.addCurrentConditions(loc));
        })
      )
      .subscribe();
  }

  addCurrentConditions(zipcode: string): void {
    const cacheKey = `current-conditions-${zipcode}`;
    const cachedConditions =
      this.cacheDataService.getCache<CurrentConditions>(cacheKey);

    if (!cachedConditions) {
      this.http
        .get<CurrentConditions>(
          `${WeatherService.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${WeatherService.APPID}`
        )
        .subscribe((data) => {
          this.cacheDataService.setCache(
            cacheKey,
            data,
            this.cacheDurationSeconds
          );
          this.currentConditions.update((conditions) => [
            ...conditions,
            { zip: zipcode, data },
          ]);
        });
    } else {
      this.currentConditions.update((conditions) => [
        ...conditions,
        { zip: zipcode, data: cachedConditions },
      ]);
    }
  }

  removeCurrentConditions(zipcode: string) {
    this.currentConditions.update((conditions) =>
      conditions.filter((cond) => cond.zip !== zipcode)
    );
    this.cacheDataService.removeCacheByKey(`current-conditions-${zipcode}`);
    this.cacheDataService.removeCacheByKey(`forecast-conditions-${zipcode}`); // rimuovo anche il forecast
  }

  getCurrentConditions(): Signal<ConditionsAndZip[]> {
    return this.currentConditions.asReadonly();
  }

  getForecastByZip(): Signal<Forecast> {
    return this.forecastConditions.asReadonly();
  }

  getForecast(zipcode: string): void {
    const cacheKey = `forecast-conditions-${zipcode}`;
    const cachedConditions = this.cacheDataService.getCache<Forecast>(cacheKey);

    if (!cachedConditions) {
      this.http
        .get<Forecast>(
          `${WeatherService.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`
        )
        .pipe(
          tap((data) => {
            this.cacheDataService.setCache(
              cacheKey,
              data,
              this.cacheDurationSeconds
            );
            this.forecastConditions.set(data);
          })
        )
        .subscribe();
    } else {
      this.forecastConditions.set(cachedConditions);
    }
  }

  getWeatherIcon(id): string {
    if (id >= 200 && id <= 232)
      return WeatherService.ICON_URL + 'art_storm.png';
    else if (id >= 501 && id <= 511)
      return WeatherService.ICON_URL + 'art_rain.png';
    else if (id === 500 || (id >= 520 && id <= 531))
      return WeatherService.ICON_URL + 'art_light_rain.png';
    else if (id >= 600 && id <= 622)
      return WeatherService.ICON_URL + 'art_snow.png';
    else if (id >= 801 && id <= 804)
      return WeatherService.ICON_URL + 'art_clouds.png';
    else if (id === 741 || id === 761)
      return WeatherService.ICON_URL + 'art_fog.png';
    else return WeatherService.ICON_URL + 'art_clear.png';
  }
}
