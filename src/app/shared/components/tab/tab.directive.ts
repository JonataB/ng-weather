import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[tab]',
  standalone: true,
})
export class TabDirective {
  @Input('tab') name: string;

  constructor(public templateRef: TemplateRef<any>) {}
}
