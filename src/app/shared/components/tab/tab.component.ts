import { AfterContentInit, Component, ContentChildren, EventEmitter, Input, OnDestroy, Output, QueryList, TemplateRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { TabDirective } from './tab.directive';


@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css']
})
export class TabComponent implements AfterContentInit, OnDestroy {
  @Input({ required: true }) closable = true;

  currentTab: TemplateRef<any>;
  @ContentChildren(TabDirective) tabs: QueryList<TabDirective>;

  @Output() close = new EventEmitter<number>();

  private subscription: Subscription;

  // A callback method that is invoked immediately after Angular has completed initialization of all of the directive's content. 
  // It is invoked only once when the directive is instantiated.
  ngAfterContentInit(): void {
    if (this.tabs.length > 0) {
      this.currentTab = this.tabs.first.templateRef;
    } else {
      this.subscription = this.tabs.changes.subscribe(() => {
        if (!this.tabs.find(tab => tab.templateRef === this.currentTab)) {
          this.currentTab = this.tabs.first?.templateRef;
        }
      });
    }
  }

  selectTab(tab: TabDirective): void {
    this.currentTab = tab.templateRef;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
