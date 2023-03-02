import { Creator } from "./creator.model";


export class ZoteroItem {
    public key: string = '';
    public version: number = -1;
    public itemType: string = '';
    public title: string = '';
    public creators: Array<Creator> = [];
    public abstractNote: string = '';
    public websiteTitle: string = '';
    public websiteType: string = '';
    public date: string = '';
    public shortTitle: Array<any> = new Array();
    public url: string = '';
    public accessDate: string = '';
    public language: string = ''
    public rights: string = '';
    public extra: string = '';
    public dateAdded: string = '';
    public dateModified: string = '';
    public tags: Array<string> = [];
    public collections: Array<string> = [];
    public relations: object = {};
    public issue: string = '';
    public doi: string = '';
    public issn: string = '';
    public archive: string = '';
    public archiveLocation: string = '';
    public callNumber: string = '';
    public pages: string = '';
    public libraryCatalog: string = '';
    public publicationTitle: string = '';
    public series: string = '';
    public seriesText: string = '';
    public seriesTitle: string = '';
    public static notes: any = [];

    constructor(d: any) {
        if (d.itemType === 'note') {
            ZoteroItem.notes.push(d)
        }
        else {
            this.key = d.key;
            this.version = d.version;
            this.itemType = d.itemType;
            this.title = d.title;
            for (let creator of d.creators) {
                this.creators.push(new Creator(creator));
            }
            this.abstractNote = d.abstractNote;
            this.websiteTitle = d.websiteTitle;
            this.date = d.date;
            this.shortTitle.push({ abbr: d.shortTitle, source: 'AIEGL' });
            this.url = d.url;
            this.accessDate = d.accessDate;
            this.language = d.language;
            this.rights = d.rights;
            this.extra = d.extra;
            this.dateAdded = d.dateAdded;
            this.dateModified = d.dateModified;
            this.tags = d.tags;
            this.collections = d.collections;
            this.relations = d.relations;
            this.issue = d.issn;
            this.doi = d.doi;
            this.issn = d.issn;
            this.archive = d.archive;
            this.archiveLocation = d.archiveLocation;
            this.callNumber = d.callNumber === undefined ? '' : d.callNumber;
            this.pages = d.pages;
            this.libraryCatalog = d.libraryCatalog;
            this.publicationTitle = d.publicationTitle;
            this.series = d.series;
            this.seriesText = d.seriesText;
            this.seriesTitle = d.seriesTitle;
        }
    }

    getCreators() {
        return this.creators.map(x => ({ name: x.firstName + " " + x.lastName }).name).join(', ');
    }


}
