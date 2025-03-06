import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { UppercaseDirective } from './uppercase.directive';

@Component({
  template: `<input type="text" appUppercase [(ngModel)]="value" />`,
})
class TestComponent {
  value: string = '';
}

describe('UppercaseDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let inputElement: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [FormsModule, ReactiveFormsModule, UppercaseDirective],
      providers: [NgControl],
    });

    fixture = TestBed.createComponent(TestComponent);
    inputElement = fixture.debugElement.query(By.css('input'));
    fixture.detectChanges();
  });

  it('should create the directive', () => {
    expect(inputElement).toBeTruthy();
  });

  it('should convert input value to uppercase', () => {
    const input = inputElement.nativeElement;

    input.value = 'hello';
    input.dispatchEvent(new Event('input'));

    expect(input.value).toBe('HELLO');
  });

  it('should not emit additional event when updating value', () => {
    const input = inputElement.nativeElement;
    const ngControl = inputElement.injector.get(NgControl);

    spyOn(ngControl.control!, 'setValue');

    input.value = 'hello';
    input.dispatchEvent(new Event('input'));

    expect(ngControl.control!.setValue).toHaveBeenCalledWith('HELLO', { emitEvent: false });
  });
});
