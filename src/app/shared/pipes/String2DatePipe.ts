/**
 * String2DatePipe
 *
 * @author tobiasb
 * @since 2016
 */
import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({name: 'string2Date'})
export default class String2DatePipe implements PipeTransform {
  transform(value:string) : Date {
    return new Date(value);
  }
}
