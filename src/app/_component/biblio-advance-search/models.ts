export interface NgAsSearchTerm {
    searchMode: 'simple' | 'advanced';

    simpleSearchTerm: string;
    
    advancedSearchLink: 'and' | 'or';
    advancedTerms: NgAsAdvancedSearchTerm[];

    name?: string;
    isDefault?: boolean;
}

export interface NgAsAdvancedSearchTerm {
    id: number;
    fieldName?: string;
    fieldType?: 'string' | 'number' | 'date';
    action?: 'contains' | 'equals' | 'larger than' | 'smaller than';
    searchTerm?: string;
    isNegated?: boolean;
}

export interface NgAsHeader {
    id: string;
    displayText: string;
    type?: 'string' | 'number' | 'date';
}