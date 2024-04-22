# About the FAIR Epigraphy Bibliographic project

The FAIR Epigraphy Bibliography project aims to enable bibliographic linked open data for digital projects in ancient epigraphy. In order to achieve this we are piloting a platform to generate and maintain unique stable identifiers (URIs) for bibliographic items referenced in epigraphic studies. As part of this pilot, we also aim to make community-established epigraphic abbreviations more accessible; consequently, the pilot project starts with the [List of Abbreviations of Editions and Works of Reference for Alphabetic Greek Epigraphy](https://aiegl.org/grepiabbr.html) promoted by the *International Society for Greek and Latin Epigraphy* (AIEGL).

## Background

All published inscriptions have at least one bibliographic reference. Traditionally epigraphers have used these references as the primary identifier for an inscription. Although digital projects are now generating identifiers for inscriptions, and the [Trismegistos project](https://www.trismegistos.org/) aims to generate unique identifiers for every inscription in the abstract, bibliographic references remain the primary form of reference. These references usually refer to specific curated editions, each of which is potentially distinct from another edition of the same inscription (in contrast to the TM number which points to the inscription in the abstract, independent of any single edition).

For a long time, epigraphers, like many other scholars, have employed bibliographic abbreviations to simplify and speed up their reference to individual publications. Such abbreviations offer an early example of an attempt to use unique identifiers, such as "*CIL* I<sup>2</sup> 1221". However, these abbreviations and references suffer from two major problems: firstly, they are frequently not very machine-readable, since they tend to combine multiple types of symbol and character, including very inconsistent use of punctuation marks; and secondly they are rarely used consistently, and so are insufficiently standardised for machine – or even human – use. A version of the same problem extends to a normal ‘full’ bibliographic reference, which can be presented in a myriad of different editorial styles, and so while more human readable is even less machine readable.

There have been many attempts over the years to standardise the abbreviations used for such references. Lists of such abbreviations can be found in many places, in particular in the main epigraphic gazetteers, *L’Année Épigraphique* (the list of abbreviations used in the most recent volume freely available on JSTOR (2014 [2017]) can be [downloaded in pdf](https://www.jstor.org/stable/48628058)) and *Supplementum Epigraphicum Graecum* (the [list of abbreviations is online in HTML](https://scholarlyeditions.brill.com/sego/abbreviations/)); but also in the *Guide de l’Épigraphiste*. The book itself is not available electronically, but various resources including the original 4th edition (2010) list of abbreviations and a series of supplements are [available in pdf](https://antiquite.ens.psl.eu/the-book/) (caution: some of the links are broken and some currently lack a valid security certificate). However, many of these abbreviations are not identical and, for example, many of those used by *SEG* have changed at least once over the years. Recently, the *International Association for Greek and Latin Epigraphy* (AIEGL) sponsored the creation of a newly revised list of abbreviations for Greek epigraphic publications, in order to try to bring greater consistency and cohesion to such abbreviations. The list is [available in pdf or docx format](https://aiegl.org/grepiabbr.html) on the AIEGL website. This list was prepared by a group consisting of A. Chaniotis, T. Corsten, D. Feissel, P.-L. Gatier, K. Hallof, M. Hatzopoulos, S. Orlandi, R. Parker, D. Rousset and C. Schuler and was first published in 2020, with revisions in 2022. The aim is for the list to be maintained and updated, with the support of the AIEGL. In order to make that list more accessible, and in order to maximise its utility for digital as well as paper publications, it was agreed at the 16th Epigraphic Congress at Bordeaux in 2022 that the list would form the basis for this pilot project to create stable and unique bibliographic identifiers.

## Approach

The pilot project employs the Zotero open source bibliographic software to host the core bibliography in a [public online library](https://www.zotero.org/groups/4858485/fair-epigraphy/library). The Zotero platform provides a wide range of tools to support bibliographic data interoperability and is supported by a large international community. However, there are several elements which Zotero currently does not support (or does not support outside of bespoke customisation of data fields), and which we consider necessary to facilitate bibliographic linked open data for the community. These include (but are not limited to):
* hierarchical relationships between bibliographic items;
* a sufficiently rich classification of bibliographic item types;
* the ability to record multiple abbreviations;
* the ability to record equivalent resources in other platforms;
* the ability to record additional semantically rich metadata such as VIAF identifiers for authors;
* and most importantly the maintenance of a unique and stable item identifier.

The pilot project therefore starts from the Zotero bibliography as the best tool to generate and maintain the bibliography, but then extends this with back-end resources and a web-interface. The web-front end is maintained in [the github repository](https://github.com/FAIR-epigraphy/FAIR_Epigraphic_Bibliography), and is accessible at <https://biblio.inscriptiones.org/>, with the bibliography itself at <https://biblio.inscriptiones.org/biblio/bibliography>. The data is hosted on a server at the [Centre for the Study of Ancient Documents](https://www.csad.ox.ac.uk/home), University of Oxford. This is very much work-in-progress, and fuller information will be posted here soon, but the current interface already provides for search and export, as well as serving URIs for each item (e.g. <https://biblio.inscriptiones.org/epig10001219>).

We welcome all comments and feedback.


# Technical information

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.0.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
