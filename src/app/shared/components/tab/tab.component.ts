import { NgTemplateOutlet } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  Output,
  QueryList,
  TemplateRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TabDirective } from './tab.directive';

@Component({
  selector: 'app-tab',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabComponent implements AfterContentInit, OnDestroy {
  @Input({ required: true }) closable = true;
  @Input() sortFunction?: (a: TabDirective, b: TabDirective) => number;

  currentTab: TemplateRef<TabDirective>;
  @ContentChildren(TabDirective) tabs: QueryList<TabDirective>;
  tabsElements: TabDirective[] = [];

  @Output() close = new EventEmitter<number>();

  private cdr = inject(ChangeDetectorRef);

  private destroyRef = inject(DestroyRef);

  ngAfterContentInit(): void {
    this.updateTabs();
    this.tabs.changes
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.updateTabs();
      });
  }

  private updateTabs(): void {
    this.cdr.markForCheck();
    this.tabsElements = this.tabs.toArray();

    if (this.sortFunction) {
      this.tabsElements.sort(this.sortFunction);
    }

    if (
      !this.currentTab ||
      !this.tabs.find((tab) => tab.templateRef === this.currentTab)
    ) {
      this.currentTab = this.tabs.first?.templateRef;
    }
  }

  selectTab(tab: TabDirective): void {
    this.currentTab = tab.templateRef;
  }

  onClose(i: number): void {
    this.close.emit(i);
    this.tabsElements.splice(i, 1);
    this.cdr.markForCheck();

    // setto il contenuto del tab precedente se esiste
    if (i > 0) {
      this.currentTab = this.tabsElements[i - 1].templateRef;
    } else {
      this.currentTab = this.tabsElements[0]?.templateRef;
    }
  }

  ngOnDestroy(): void {}
}
