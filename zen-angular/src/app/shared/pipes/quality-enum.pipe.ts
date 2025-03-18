import { Pipe, PipeTransform } from '@angular/core';
import { Quality } from '../models/appointment';

@Pipe({
  name: 'qualityEnum',
  standalone: true
})
export class QualityEnumPipe implements PipeTransform {

  transform(value: number) {
    return Quality[value] || 'Unknown Style'
  }
}
