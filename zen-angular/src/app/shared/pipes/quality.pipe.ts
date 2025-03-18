import { Pipe, PipeTransform } from '@angular/core';
import { Quality } from '../models/appointment';

@Pipe({
  name: 'quality',
  standalone: true
})
export class QualityPipe implements PipeTransform {

  // Transforms string to number
  transform(value: string): number {
    const qualityNumber = Object.keys(Quality).find(
      key => Quality[key as any] === value
    );
    return qualityNumber !== undefined ? Number(qualityNumber) : -1;  // Return -1 for 'Unknown value'
  }
}
