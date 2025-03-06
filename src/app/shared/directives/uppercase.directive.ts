import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appUppercase]',
  standalone: true,
})
export class UppercaseDirective {
  constructor(private control: NgControl) {}

  @HostListener('input', ['$event.target.value']) onInput(value: string) {
    const uppercaseValue = value.toUpperCase();

    this.control.control?.setValue(uppercaseValue, { emitEvent: false });
  }
}
