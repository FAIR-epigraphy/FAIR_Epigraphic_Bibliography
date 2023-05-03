import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
const { default: api } = require('zotero-api-client');

@Injectable({
  providedIn: 'root'
})
export class ZoteroSyncService {
  api_key = '4Rti1M1IB3Cw2993pop81f5v'
  zoteroAPI = api(this.api_key).library('group', 4858485);
  storeName = 'allBiblioData';
  headers = { 'Zotero-API-Version': '3', Authorization: '' };
  libraries: any = {};
  userID: any;
  items: any = [];
  version = 0;
  name = '';
  batch = 50;
  public fetchingPercentage = 0;
  public otherLibItemsCount = 1;

  constructor(
    private http: HttpClient
  ) {
  }
  async login() {
    this.headers.Authorization = `Bearer ${this.api_key}`;
    let account: any = await this.fetchAPI('https://api.zotero.org/keys/current');
    this.libraries = {};
    let library = await this.fetchAPI(`https://api.zotero.org/users/${account.userID}/groups`);
    if (account.access.groups[library[0].id]) {
      const prefix = `/groups/${library[0].id}`;
      this.libraries[prefix] = {
        type: 'group',
        prefix,
        name: library[0].data.name,
      };
    }
    this.userID = account.userID;
  }

  async fetchAPI(url: any) {
    return await (await fetch(url, { headers: this.headers })).json()
  }

  load() {
    let items = [];
    let version = 0;
    let name = '';

    try {
      ({ items, version, name } = JSON.parse(localStorage.getItem(this.storeName) || '{}'));
      if (items !== undefined) {
        this.items = items;
        this.version = version;
        this.name = name;
      }
    }
    catch (err) {
      console.log(err)
    }
  }

  async add(item: any) {
    await this.remove([item.key]);
    this.items.push(item);
  }
  async remove(keys: any) {
    this.items = this.items.filter((item: any) => !(keys.includes(item.key)));
  }
  async save(name: any, version: any) {
    await localStorage.setItem(this.storeName, JSON.stringify({ items: this.items, name: name, version: version }));
  }

  async sync(includeTrashed = false) {
    // remove libraries we no longer have access to
    // update all libraries
    try {
      await this.login();
      //////////////////////////////////
      // This method is temp will be deleted soon
      this.checkForModifiedByAddedBy()
      ///////////////////////////////////
      let prefix = this.libraries[Object.keys(this.libraries)[0]].prefix;
      await this.update(prefix, includeTrashed);
      return { items: this.items, libraryName: this.name, version: this.version };
    }
    catch (err) {
      console.log(err);
      return 'Error: ' + err;
    }
  }

  checkForModifiedByAddedBy(){
    let items = [];
    let version = 0;
    let name = '';
    ({ items, version, name } = JSON.parse(localStorage.getItem(this.storeName) || '{}'));
    if(items!==undefined)
    {
      if(items[0]['addedBy'] === undefined)
      {
        localStorage.removeItem(this.storeName);
      }
    }
  }

  getPreviousVersion() {
    return JSON.parse(localStorage.getItem(this.storeName) || '{}');
  }

  async getAllBiblioCitationStyles() {
    if (localStorage.getItem('ZoteroStyleCitations') !== null && localStorage.getItem('ZoteroStyleCitations') !== undefined) {
      return JSON.parse(localStorage.getItem('ZoteroStyleCitations') || '{}')
    }
    else {
      let data = await (await fetch('https://www.zotero.org/styles-files/styles.json')).json()
      let citations = [];
      for (let d of data) {
        citations.push({ title: d.title, name: d.name });
      }
      localStorage.setItem('ZoteroStyleCitations', JSON.stringify(citations));
    }
  }

  getTotalNumberOfItems() {
    return JSON.parse(localStorage.getItem(this.storeName) || '{}').items.length;
  }

  async get(prefix: any, uri: any) {
    const library = this.libraries[prefix];
    if (!library)
      throw new Error(`${this.userID} does not have access to ${prefix}`);
    uri = `https://api.zotero.org${prefix}${uri}`;
    const res: any = await fetch(uri, { headers: this.headers });
    if (typeof library.version === 'number') {
      if (res.headers.get('last-modified-version') !== `${library.version}`) {
        throw new Error(`last-modified-version changed from ${library.version} to ${res.headers.get('last-modified-version')} during sync, retry later`);
      }
    }
    else {
      library.version = parseInt(res.headers.get('last-modified-version'));
      if (isNaN(library.version))
        throw new Error(`${res.headers.get('last-modified-version')} is not a number`);
    }
    //return res;
    return await res.json(); // eslint-disable-line @typescript-eslint/no-unsafe-return
  }

  async update(prefix: any, includeTrashed: any) {
    await this.load();
    const remote = this.libraries[prefix];
    // first fetch also gets the remote version
    const deleted = await this.get(prefix, `/deleted?since=${this.version}`);
    if (this.version === remote.version)
      return;
    if (deleted.items.length) {
      await this.remove(deleted.items);
    }
    if (deleted.collections.length) {
      //this.emitter.emit(Sync.event.remove, 'collections', deleted.collections);
      //await stored.remove_collections(deleted.collections);
    }
    const items = Object.keys(await this.get(prefix, `/items?since=${this.version}&format=versions&includeTrashed=${Number(includeTrashed)}`));
    for (let n = 0; n < items.length; n++) {
      for (const item of await this.get(prefix, `/items?itemKey=${items.slice(n, n + this.batch).join(',')}&includeTrashed=${Number(includeTrashed)}`)) {
        let bibData = item.data;
        if(item.meta['createdByUser'] !== undefined)
          bibData['addedBy'] = item.meta['createdByUser']['username'];
        if(item.meta['lastModifiedByUser']!==undefined)
          bibData['modifiedBy'] = item.meta['lastModifiedByUser']['username'];

        await this.add(bibData);
        n += 1;
      }
    }
    // const collections = Object.keys(await this.get(prefix, `/collections?since=${this.version}&format=versions`));
    // for (let n = 0; n < collections.length; n++) {
    //   for (const collection of await this.get(prefix, `/collections?collectionKey=${collections.slice(n, n + this.batch).join(',')}`)) {
    //     await stored.add_collection(collection.data);
    //     n += 1;
    //     this.emitter.emit(Sync.event.collection, collection.data, n, collections.length);
    //   }
    // }
    await this.save(remote.type === 'group' ? remote.name : undefined, remote.version);
  }

  async export(format: any, key: any, ext: any) {
    let d = await this.zoteroAPI.items(key).get({ format: format });
    this.download(`export.${ext}`, await d.getData().text())
  }

  async citation(content: any, key: any, style: any, language: any) {
    let d = await this.zoteroAPI.items(key).get({ style: style, format: 'json', include: content, locale: language });
    let c = await d.getData().bib;
    return c;
  }

  async updateCallNumber(zoteroObject: any) {
    let resp = await this.zoteroAPI.items(zoteroObject.key).patch(
      {
        callNumber: zoteroObject.callNumber,
        version: zoteroObject.version
      });
  }

  download(filename: any, text: any) {
    //var element = document.createElement('a');
    //element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    const contentType = 'data:text/plain;charset=utf-8,';//'text/csv;charset=utf-8;';
    const a = document.createElement('a');
    const file = new Blob([text], { type: contentType });

    a.href = URL.createObjectURL(file);
    a.download = filename;
    a.click();

    URL.revokeObjectURL(a.href);
  }

  async fetchURL(apiNumber:any, libURL: any)
  {
    let zoteroItems: any = [];
    let res: any = null;
    try{
      let response = await fetch(`https://api.zotero.org/groups/${apiNumber}/items?since=0&format=versions&includeTrashed=0`);
      if(response.status === 200)
        res = Object.keys(await (response).json())
      else 
        return zoteroItems;
    }
    catch(err)
    {
      return zoteroItems;
    }

    this.otherLibItemsCount = res.length;
    for (let n = 0; n < res.length; n++) {
      for (const item of await(await fetch(`https://api.zotero.org/groups/${apiNumber}/items?itemKey=${res.slice(n, n + this.batch).join(',')}&includeTrashed=0`)).json()) {
        zoteroItems.push(item.data);
        n += 1;
        this.fetchingPercentage = n;
      }
      //break;
    }

    localStorage.setItem(apiNumber, JSON.stringify(zoteroItems));
    localStorage.setItem('libURL', libURL);
    return zoteroItems;
    //console.log(res)
  }

  takeBackup() {
    let data = localStorage.getItem(this.storeName);
    let fileName = `Backup_${new Date().toJSON().slice(0, 19).replaceAll(':', '_').replace('T', '-')}.json`;
    this.download(fileName, data);
  }
}
