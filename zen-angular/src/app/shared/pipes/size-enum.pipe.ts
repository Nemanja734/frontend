import { Pipe, PipeTransform } from '@angular/core';
import { Size } from '../models/appointment';

@Pipe({
  name: 'sizeEnum',
  standalone: true
})
export class SizeEnumPipe implements PipeTransform {

  transform(value: number) {
    return Size[value] || 'Unknown Size'
  }

}
