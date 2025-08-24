export type City = {
    location: {x: number, y: number}; // map coords
    name: string; // name to display - also what we use to identify if multiple BlogEntries are part of the same city
}

export class BlogImage {
    public readonly url: string;

    constructor (url: string) {
        this.url = url;
    }

    to_jsx() {
        return <image></image>;
    }
}

export class BlogParagraph {
    public readonly text: string;

    constructor (text: string) {
        this.text = text;
    }

    to_jsx() {
        return <p></p>;
    }
}

export class BlogHeader {
    public readonly text: string;

    constructor (text: string) {
        this.text = text;
    }

    to_jsx() {
        return <h1></h1>;
    }
}

export type BlogEntry = {
    location: City;
    title: string;
    content: (BlogImage | BlogParagraph | BlogHeader)[];
}
