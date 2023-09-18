import { DatePipe } from "@angular/common";
import { Creator } from "./creator.model";


export class ZoteroItem {
    public key: string = '';
    public version: number = -1;
    public itemType: string = '';
    public resourceType: string = 'Book';
    public resourceTypeId: string = '';
    public title: string = '';
    public altTitle: any = [];
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
    public dateAdded: any = '';
    public dateModified: any = '';
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
    public publisher: string = '';
    public publisher_place: string = '';
    public volume: string = '';
    public numberOfVolumes: string = '';
    public edition: string = '';
    public event_place: string = '';
    public seriesNumber: string = '';
    public numPages: string = '';
    public ISBN: string = '';
    public addedBy: string = '';
    public modifiedBy: string = '';

    public static notes: any = [];
    public children: Array<ZoteroItem> = new Array();
    public showChild: boolean = false;
    public category: string = '';
    public creatorsName: string = '';

    constructor(d: any) {
        const pipe = new DatePipe('en-US'); // Use your own locale
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
            this.creatorsName = this.creators.map(x => ({ name: x.fullName }).name).join(', ');
            this.abstractNote = d.abstractNote;
            this.websiteTitle = d.websiteTitle;
            this.date = d.date;
            this.shortTitle.push({ abbr: d.shortTitle, source: '' });
            this.url = d.url;
            this.accessDate = d.accessDate;
            this.language = d.language;
            this.rights = d.rights;
            this.extra = d.extra;
            this.dateAdded = new Date(d.dateAdded).toLocaleString();//pipe.transform(new Date(d.dateAdded).toLocaleString(), 'dd/MM/yyyy, hh:mm:ss a');
            this.dateModified = new Date(d.dateModified).toLocaleString();//pipe.transform(new Date(d.dateModified).toLocaleString(), 'dd/MM/yyyy, hh:mm:ss a');
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

            this.publisher = d.publisher;
            this.event_place = d.place;
            this.volume = d.volume;
            this.numberOfVolumes = d.numberOfVolumes;
            this.seriesNumber = d.seriesNumber;
            this.numPages = d.numPages;
            this.ISBN = d.ISBN;

            ////////////////////
            // Contributor
            if (d.addedBy !== undefined) {
                this.addedBy = d.addedBy;
            }

            if (d.modifiedBy !== undefined) {
                this.modifiedBy = d.modifiedBy;
            }
        }
    }

    getCreators() {
        //return this.creators.map(x => ({ name: x.fullName }).name).join(', ');
        let authors = this.creators.filter((x: Creator) => x.creatorType.toLowerCase() === 'author');
        let editors = this.creators.filter((x: Creator) => x.creatorType.toLowerCase() === 'editor');
        let others = this.creators.filter((x: Creator) => x.creatorType.toLowerCase() !== 'author' && x.creatorType.toLowerCase() !== 'editor');

        if (authors.length > 0)
            return this.getCreatorsFromArray(authors);
        else if (editors.length > 0)
            return this.getCreatorsFromArray(editors);
        else
            return this.getCreatorsFromArray(others);
    }

    getCreatorsFromArray(creators: Creator[]) {
        if(creators.length > 0)
        {
            if (creators.length === 1) {
                if (creators[0].lastName !== '')
                    return creators[0].lastName;
                else
                    return creators[0].fullName;
    
            }
            else if (creators.length === 2) {
                if (creators[0].lastName !== '')
                    if (creators[1].lastName !== '')
                        return `${creators[0].lastName} and ${creators[1].lastName}`;
                    else
                        return `${creators[0].lastName} and ${creators[1].fullName}`;
    
                else
                    return creators[0].fullName;
            }
            else {
                if (this.creators[0].lastName !== '')
                    return this.creators[0].lastName + ' et al.'
                else
                    return this.creators[0].fullName;
            }
        }
        
        return '';
    }
}
