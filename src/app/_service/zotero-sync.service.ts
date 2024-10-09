import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
const { default: api } = require('zotero-api-client');
import { BiblApiService } from '../_service/bibl-api.service';


@Injectable({
  providedIn: 'root'
})
export class ZoteroSyncService {
  api_key = '4Rti1M1IB3Cw2993pop81f5v'
  libraryId = 4858485;
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
    private http: HttpClient,
    private apiService: BiblApiService,
  ) {
  }
  async login() {
    this.headers.Authorization = `Bearer ${this.api_key}`;
    let account: any = await this.fetchAPI('https://api.zotero.org/keys/current');
    this.libraries = {};
    let library = await this.fetchAPI(`https://api.zotero.org/users/${account.userID}/groups`);
    if (account.access.groups[this.libraryId]) {
      const prefix = `/groups/${this.libraryId}`;
      this.libraries[prefix] = {
        type: 'group',
        prefix,
        name: library.find((x: any) => x.id === this.libraryId).data.name,
      };
    }
    this.userID = account.userID;
  }

  async fetchAPI(url: any) {
    return await (await fetch(url, { headers: this.headers })).json()
  }

  async load() {
    let items = [];
    let version = 0;
    let name = '';

    try {
      let jsonData = await this.apiService.getJSONData();
      ({ items, version, name } = JSON.parse(jsonData || '{}'));
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
    //await localStorage.setItem(this.storeName, JSON.stringify({ items: this.items, name: name, version: version }));
    await this.apiService.setJSONData(JSON.stringify({ items: this.items, name: name, version: version }));
  }

  async sync(includeTrashed = false, appComponent: any) {
    // remove libraries we no longer have access to
    // update all libraries
    try {
      await this.login();
      //////////////////////////////////
      // This method is temp will be deleted soon
      //this.checkForModifiedByAddedBy()
      ///////////////////////////////////
      let prefix = this.libraries[Object.keys(this.libraries)[0]].prefix;
      await this.update(prefix, includeTrashed, appComponent);
      return { items: this.items, libraryName: this.name, version: this.version };
    }
    catch (err) {
      console.log(err);
      return 'Error: ' + err;
    }
  }

  async checkForModifiedByAddedBy() {
    let items = [];
    let version = 0;
    let name = '';
    //({ items, version, name } = JSON.parse(localStorage.getItem(this.storeName) || '{}'));
    let jsonData = await this.apiService.getJSONData();
    ({ items, version, name } = JSON.parse(jsonData || '{}'));
    if (items !== undefined) {
      if (items[0]['addedBy'] === undefined) {
        localStorage.removeItem(this.storeName);
      }
    }
  }

  async getPreviousVersion() {
    let data = await this.apiService.getJSONData();
    return JSON.parse(data);
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

  async getTotalNumberOfItems() {
    let jsonData = await this.apiService.getJSONData();
    return JSON.parse(jsonData || '{}').items.length;
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

  async update(prefix: any, includeTrashed: any, appComponent: any) {
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

    appComponent.progressBar.count = items.length;
    appComponent.progressBar.processedCount = 0;
    appComponent.progressBar.message = 'Syncing ...'

    for (let n = 0; n < items.length;) {
      for (const item of await this.get(prefix, `/items?itemKey=${items.slice(n, n + this.batch).join(',')}&includeTrashed=${Number(includeTrashed)}`)) {
        let bibData = item.data;
        if (item.meta['createdByUser'] !== undefined)
          bibData['addedBy'] = item.meta['createdByUser']['username'];
        if (item.meta['lastModifiedByUser'] !== undefined)
          bibData['modifiedBy'] = item.meta['lastModifiedByUser']['username'];

        await this.add(bibData);
        n += 1;
      }
      appComponent.progressBar.processedCount = n;

      if (appComponent.progressBar.processedCount >= appComponent.progressBar.count)
        appComponent.progressBar.processedCount = appComponent.progressBar.count
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

  async getAllcitations(content: any, style: any, language: any, start: any, limit: any) {
    let d = await this.zoteroAPI.items().get({ style: style, format: 'json', include: content, locale: language, start: start, limit: limit });
    let c = await d.getData();
    return c;
  }

  async getCitationsBySource(source: any, content: any, style: any, language: any, start: any, limit: any) {
    let d = await this.zoteroAPI.items().get({ tag: `source: ${source}`, style: style, format: 'json', include: content, locale: language, start: start, limit: limit });
    let c = await d.getData();
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

  async fetchURL(apiNumber: any, libURL: any) {
    let zoteroItems: any = [];
    let res: any = null;
    let existingItems: any = [];
    let existingVersion = 0;
    if (localStorage.getItem(apiNumber)) {
      existingItems = JSON.parse(localStorage.getItem(apiNumber) || '{}').items;
      existingVersion = parseInt(JSON.parse(localStorage.getItem(apiNumber) || '{}').version);
    }

    try {
      let response: any = await fetch(`https://api.zotero.org/groups/${apiNumber}/items?since=${existingVersion}&format=versions`);
      if (response.status === 200) {
        existingVersion = parseInt(response.headers.get('last-modified-version'))
        res = Object.keys(await (response).json())
      }

      else
        return zoteroItems;
    }
    catch (err) {
      return zoteroItems;
    }

    this.otherLibItemsCount = res.length;
    for (let n = 0; n < res.length; n++) {
      for (const item of await (await fetch(`https://api.zotero.org/groups/${apiNumber}/items?itemKey=${res.slice(n, n + this.batch).join(',')}`)).json()) {
        let existingIndex = existingItems.findIndex((x: any) => x.key === item.data.key)
        if (existingIndex > -1) {
          existingItems[existingIndex] = item.data;
        }
        else {
          existingItems.push(item.data);
        }
        n += 1;
        this.fetchingPercentage = n;
      }
    }

    let obj = { items: existingItems, version: existingVersion }
    localStorage.setItem(apiNumber, JSON.stringify(obj));
    if (localStorage.getItem('libURL')) {
      if (JSON.parse(localStorage.getItem('libURL') || '{}').libURL !== libURL)
        localStorage.setItem('libURL', JSON.stringify({ libURL: libURL, apiKey: '' }));
    }
    else {
      localStorage.setItem('libURL', JSON.stringify({ libURL: libURL, apiKey: '' }));
    }

    return existingItems;
  }

  async insert(item: any) {
    delete item['key'];
    delete item['version'];
    let insertData = await this.zoteroAPI.items().post([item]);
    return insertData;
  }

  async updateOtherLibTagsWithCallNumber(otherLibURL: any, zoterObj: any, apiKey: any, tag: any, callNumber: any = '') {
    let other_api_key = apiKey;
    let zoteroOtherAPI = api(other_api_key).library('group', otherLibURL.replace(/[^0-9]/g, ""));
    let jsonData = await zoteroOtherAPI.items(zoterObj.key).get();
    let data = await jsonData.getData();
    if (data.callNumber === '')
      data.callNumber = callNumber;

    data.tags.push(tag)
    await zoteroOtherAPI.items(zoterObj.key).patch(data);
  }

  async getZoteroItemByCallNumber(callNumber: any) {
    let obj = await this.zoteroAPI.items().get({ itemQ: callNumber, itemQMode: 'contains' });
    let s = '';
    return obj;
  }

  async takeBackup() {
    let data = await this.apiService.getJSONData();
    let fileName = `Backup_${new Date().toJSON().slice(0, 19).replaceAll(':', '_').replace('T', '-')}.json`;
    this.download(fileName, data);
  }
}
