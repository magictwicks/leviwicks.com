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

    serialize() {
        return {type: "BlogImage", url: this.url}
    }

    static deserialize(json: any) {
        return new BlogImage(json.url);
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

    serialize() {
        return {type: "BlogParagraph", text: this.text}
    }

    static deserialize(json: any) {
        return new BlogParagraph(json.text);
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

    serialize() {
        return {type: "BlogHeader", text: this.text}
    }

    static deserialize(json: any) {
        return new BlogHeader(json.text)
    }
}

export class BlogEntry {
    public readonly location: City;
    public readonly title: string;
    public readonly content: (BlogImage | BlogParagraph | BlogHeader)[];

    constructor (location: City, title: string, content: (BlogImage | BlogParagraph | BlogHeader)[]) {
        this.location = location;
        this.title = title;
        this.content = content;
    }

    serialize() {
        return {
            location: this.location,
            title: this.title,
            content: this.content.map(c => c.serialize()),
        }
    }

    static deserialize(json: any) {
        const location: City = json.location;
        const title: string = json.title;
        const content: (BlogImage | BlogParagraph | BlogHeader)[] = [];

        for (const element of json.content) {
            switch (element.type) {
                case "BlogImage":
                    content.push(BlogImage.deserialize(element))
                case "BlogParagraph":
                    content.push(BlogParagraph.deserialize(element))
                case "BlogHeader":
                    content.push(BlogHeader.deserialize(element))
            }
        }

        return new BlogEntry(location, title, content);
    }
}
