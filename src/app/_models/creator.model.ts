export class Creator {
    public creatorType: string = '';
    public firstName: string = '';
    public lastName: string = '';
    public fullName: string = '';
    public VIAF: any = {};
    public ORCID: any = {};

    constructor(creator: any) {
        if (creator !== null) {
            this.creatorType = creator.creatorType;
            this.firstName = creator.firstName;
            this.lastName = creator.lastName;
            this.fullName = creator.firstName + " " + creator.lastName;
            if (creator.VIAF !== undefined) {
                this.VIAF.value = creator.VIAF.value === null ? undefined : creator.VIAF.value;
                this.VIAF.invalid = creator.VIAF.invalid;
            }

            if (creator.ORCID !== undefined) {
                this.ORCID.value = creator.ORCID.value === null ? undefined : creator.ORCID.value;
                this.ORCID.invalid = creator.ORCID.invalid;
            }
        }
    }

    getFullName(creator: Creator) {
        return creator.firstName + " " + creator.lastName;
    }
}
