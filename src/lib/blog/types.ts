export type City = {
    location: { lat: number; lon: number };
    name: string;
  };
  
  export type BlogImage   = { type: "BlogImage"; url: string };
  export type BlogParagraph = { type: "BlogParagraph"; text: string };
  export type BlogHeader  = { type: "BlogHeader"; title: string };
  export type BlogContent = BlogImage | BlogParagraph | BlogHeader;
  
  export type BlogEntry = {
    // Added slug (filename without extension) for convenience
    slug: string;
    location: City;
    date: number;     // unix millis
    title: string;
    content: BlogContent[];
  };
  
  export type LoadedData = {
    cities: City[];
    entries: BlogEntry[];
  };
  