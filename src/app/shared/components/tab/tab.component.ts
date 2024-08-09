import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, EventEmitter, inject, Input, OnDestroy, Output, QueryList, TemplateRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { TabDirective } from './tab.directive';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabComponent implements AfterContentInit, OnDestroy {
  @Input({ required: true }) closable = true;

  currentTab: TemplateRef<any>;
  @ContentChildren(TabDirective) tabs: QueryList<TabDirective>;
  tabsElements: TabDirective[] = [];

  @Output() close = new EventEmitter<number>();

  private subscription: Subscription;

  private cdr = inject(ChangeDetectorRef);

  ngAfterContentInit(): void {
    if (this.tabs.length > 0) {
      this.cdr.markForCheck();
      this.tabsElements = this.tabs.toArray();
      this.currentTab = this.tabs.first.templateRef;
    } else {
      this.subscription = this.tabs.changes.subscribe(() => {
        this.cdr.markForCheck();
        this.tabsElements = this.tabs.toArray();
        if (!this.tabs.find(tab => tab.templateRef === this.currentTab)) {
          this.currentTab = this.tabs.first?.templateRef;
        }
      });
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
      this.currentTab = this.tabsElements[0].templateRef;
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
