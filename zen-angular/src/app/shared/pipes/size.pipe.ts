import { Pipe, PipeTransform } from '@angular/core';
import { Size } from '../models/appointment';

@Pipe({
  name: 'size',
  standalone: true
})
export class SizePipe implements PipeTransform {

  transform(value: string): number {
    const sizeNumber = Object.keys(Size).find(
      key => Size[key as any] === value
    );
    return sizeNumber !== undefined ? Number(sizeNumber) : 0;  // Return -1 for 'Unknown value'
  }
}
