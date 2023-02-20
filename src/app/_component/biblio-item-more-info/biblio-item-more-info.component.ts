import { Component, Input, OnInit } from '@angular/core';
import { Creator } from '../../_models/creator.model';
import { ZoteroItem } from '../../_models/zotero-item.model';
import { BiblAbbrService } from '../../_service/bibl-abbr.service'

//const { default: api } = require('zotero-api-client');

@Component({
  selector: 'app-biblio-item-more-info',
  templateUrl: './biblio-item-more-info.component.html',
  styleUrls: ['./biblio-item-more-info.component.scss']
})
export class BiblioItemMoreInfoComponent {
  //myapi = api('4Rti1M1IB3Cw2993pop81f5v').library('group', 4858485);

  constructor(private abbrsService: BiblAbbrService) { }

  zoteroObject: any = null;

  isOpenTextbox = false;

  getSpecificData(obj: ZoteroItem) {
    //console.log(obj)
    if (localStorage.getItem(`ZoteroItem_${obj.key}`) !== undefined && localStorage.getItem(`ZoteroItem_${obj.key}`) !== null) {
      let item = JSON.parse(localStorage.getItem(`ZoteroItem_${obj.key}`) || '{}') as ZoteroItem;
      obj = item;
    }

    this.abbrsService.getSEGAbbrByAIEGL(obj.shortTitle[0]['abbr']).subscribe(resp => {
      if (resp !== null) {
        if (resp.length > 0) {
          for (let d of resp) {
            if (d.seg1_abbr !== null) {
              if (obj.shortTitle.filter(x => x.abbr === d.seg1_abbr).length === 0)
                obj.shortTitle.push({ abbr: d.seg1_abbr, source: 'SEG 1' })
            }
            else if (d.seg2_abbr !== null) {
              if (obj.shortTitle.filter(x => x.abbr === d.seg2_abbr).length === 0)
                obj.shortTitle.push({ abbr: d.seg2_abbr, source: 'SEG 2' })
            }
          }
        }
      }
      this.zoteroObject = obj;
      //console.log(resp)
    })

  }

  getColumnName(key: any) {
    let colName = key.replace(/([a-z])([A-Z])/g, '$1 $2');
    // if(colName.split(' ').length < 1)
    // {
    //   return colName.toUpperCase();
    // }
    return colName;
  }

  getNotes(obj: ZoteroItem) {
    return ZoteroItem.notes.filter((x: any) => x.parentItem === obj.key).map((x: any) => x.note);
  }

  getRelations(obj: ZoteroItem) {
    return Object.entries(obj.relations).filter(([key]) => !key.includes('added'))
  }

  getRelationURIs() {
    let rel = this.zoteroObject.url.split(',');
    if (rel[0] === '')
      return [];
    return rel;
  }

  showTextbox(obj: any) {
    if ('relations' in obj) {
      obj.relations.added = false;
    }
    else if ('firstName' in obj) {
      let c = this.zoteroObject.creators.filter((x: any) => x.firstName === obj.firstName && x.lastName === obj.lastName && x.creatorType === obj.creatorType);
      c[0].VIAF = '';
    }
    else if ('value' in obj) {
      obj.value.push('')
    }
  }

  addRelations(obj: any, event: any) {
    let target = event.currentTarget || event.target;

    //obj.relations['owl:sameAs'] = 'http://zotero.org/groups/1/items/JKLM6543'; // with this object, it is running
    obj.url += obj.url !== '' ? ',' + target.children[0].value : target.children[0].value;

    if (obj.url !== '') {
      // (async () => {
      //   delete obj.relations.added;
      //   delete obj.relations['owl:sameAs'];
      //   //const itemsResponse = await this.myapi.items(obj.key).put(obj, {});
      //   //obj.relations.added = true;
      // })();
      delete obj.relations.added;
      localStorage.setItem(`ZoteroItem_${this.zoteroObject.key}`, JSON.stringify(this.zoteroObject))
    }

    return false;
  }

  addVIAF(obj: Creator, event: any) {
    let c = this.zoteroObject.creators.filter((x: any) => x.firstName === obj.firstName && x.lastName === obj.lastName && x.creatorType === obj.creatorType);
    let target = event.currentTarget || event.target;
    c[0].VIAF = target.children[0].value;
    localStorage.setItem(`ZoteroItem_${this.zoteroObject.key}`, JSON.stringify(this.zoteroObject))
  }

  getAbbr(item: any) {
    //let abbr = (item.value as Array<string>).slice(1);
    return item.value;
  }

  addAbbreviation(item: any, event: any) {
    let target = event.currentTarget || event.target;
    let index = this.zoteroObject.shortTitle.findIndex((x: any) => x === '')
    this.zoteroObject.shortTitle[index] = target.children[0].value;
    localStorage.setItem(`ZoteroItem_${this.zoteroObject.key}`, JSON.stringify(this.zoteroObject))
    return false;
  }

  getFirstAbbr(item: any) {
    return item[0] as string;
  }

  getCreators(value: any) {
    let creators: Array<Creator> = new Array();
    for (let c of value) {
      creators.push(new Creator(c));
    }
    return creators;
  }
}
