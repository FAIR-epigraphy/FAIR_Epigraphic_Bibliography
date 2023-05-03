import { Component, Input, OnInit, QueryList, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { ZoteroItem } from 'src/app/_models/zotero-item.model';
import { childViewContainerDirective } from '../child.view.container.directive';

@Component({
  selector: 'app-child-list',
  templateUrl: './child-list.component.html',
  styleUrls: ['./child-list.component.scss']
})
export class ChildListComponent implements OnInit {
  @Input() data: any;
  @ViewChildren('dynamic', { read: ViewContainerRef }) childView!: QueryList<ViewContainerRef>;
  public currentSelectedRecord: any = null;
  @Input() biblioItemInfoComp: any;
  @Input() parentComponent: any;

  constructor() { }
  ngOnInit(): void {
  }

  getSpecificData(obj: ZoteroItem, event: Event) {
    console.log(obj)
    this.removeHiglightedClass(event.currentTarget as HTMLElement);
    if (this.biblioItemInfoComp !== undefined)
    {
      this.biblioItemInfoComp.getSpecificData(obj);
      document.getElementById('btnOpenModalDetail')?.click();
    }
      
  }

  removeHiglightedClass(element: HTMLElement) {
    let classes = document.getElementsByClassName('highlighted')
    if (classes.length > 0) {
      Array.from(classes).forEach((element: any) => {
        element.classList.remove('highlighted');
      });
    }
    element.classList.add('highlighted');
  }

  expandInnerChild(data: any, flag: boolean, event: any) {
    let viewContainerRef = this.childView.filter(x => x.element.nativeElement.isEqualNode(event.currentTarget.parentNode.parentNode))[0];
    data.showChild = flag;
    if (flag) {
      const componentRef = viewContainerRef.createComponent(ChildListComponent);
      componentRef.instance.data = data;
      componentRef.instance.biblioItemInfoComp = this.biblioItemInfoComp;
      componentRef.instance.parentComponent = this;
    }
    else {
      viewContainerRef.clear();
    }
  }
}
