export type City = {
    location: {lat: number, lon: number}; // map coords
    name: string; // name to display - also what we use to identify if multiple BlogEntries are part of the same city
}

export type BlogImage = { type: "BlogImage", url: string };
export type BlogParagraph = { type: "BlogParagraph", text: string };
export type BlogHeader = { type: "BlogHeader", title: string };
export type BlogContent = BlogImage | BlogParagraph | BlogHeader;

export function blogContentToJSX(c: BlogContent) {
    switch (c.type) {
        case "BlogImage":
            return <image></image>
        case "BlogParagraph":
            return <p>{c.text}</p>
        case "BlogHeader":
            return <h1>{c.title}</h1>
    }
}

export type BlogEntry = {
    location: City,
    date: number, // easy serialization, unix time in millis
    title: string,
    content: BlogContent[],
}
