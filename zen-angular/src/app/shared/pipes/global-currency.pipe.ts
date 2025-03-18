import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'globalCurrency',
  standalone: true
})
export class GlobalCurrencyPipe implements PipeTransform {
  transform(
    value: number | null | undefined,
    currencyCode: string = 'EUR', // Default currency to EUR
    display: 'symbol' | 'code' | 'name' = 'symbol', // Default display style to symbol (€)
    digitsInfo: string = '1.2-2', // Default format: minimum 2 decimals, maximum 2 decimals
    locale: string = 'de-DE' // Default locale to German
  ): string {
    if (value == null) return ''; // Return empty string if value is null or undefined

    // Format the currency value
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: parseInt(digitsInfo.split('-')[1] || '2', 10),
      maximumFractionDigits: parseInt(digitsInfo.split('-')[2] || '2', 10),
    }).format(value);
  }
}
