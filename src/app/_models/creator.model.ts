export class Creator {
    public creatorType: string = '';
    public firstName: string = '';
    public lastName: string = '';
    public VIAF: string = '';

    constructor(creator: any) {
        if (creator !== null) {
            this.creatorType = creator.creatorType;
            this.firstName = creator.firstName;
            this.lastName = creator.lastName;
            this.VIAF = creator.VIAF;
        }
    }

    getFullName(creator: Creator)
    {
        return creator.firstName + " " + creator.lastName;
    }
}
