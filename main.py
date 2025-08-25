from dataclasses import dataclass, asdict
from typing import List, Literal, Union, Dict, Any
from datetime import datetime
import json
import os
from flask import Flask, jsonify

@dataclass
class City:
    location: Dict[str, float]  # {"lat": float, "lon": float}
    name: str


@dataclass
class BlogImage:
    type: Literal["BlogImage"]
    url: str


@dataclass
class BlogParagraph:
    type: Literal["BlogParagraph"]
    text: str


@dataclass
class BlogHeader:
    type: Literal["BlogHeader"]
    title: str


BlogContent = Union[BlogImage, BlogParagraph, BlogHeader]


@dataclass
class BlogEntry:
    location: City
    date: int  # unix millis
    title: str
    content: List[BlogContent]


def load_blog_data() -> Dict[str, Any]:
    BLOG_DIR: str = "./public/blogdata/"
    files: list[str] = os.listdir(os.path.join(BLOG_DIR, "entries"))

    # Load cities
    with open(os.path.join(BLOG_DIR, "CITIES.json"), "r", encoding="utf-8") as f:
        cities_data = json.load(f)
    cities: list[City] = [City(**c) for c in cities_data]
    city_lookup: dict[str, City] = {c.name: c for c in cities}

    # Load blog entries
    entries: List[BlogEntry] = []
    for fname in files:
        if fname == "CITIES.json":
            continue
        fpath = os.path.join(BLOG_DIR, "entries", fname)
        with open(fpath, "r", encoding="utf-8") as f:
            raw = f.read().strip()

        lines: list[str] = raw.splitlines()
        title = lines[0].strip()
        city_name = lines[1].strip()
        if city_name not in city_lookup:
            raise ValueError(f"File {fname}: city '{city_name}' not found in CITIES.json")
        city = city_lookup[city_name]

        date_str = lines[2].strip()
        # TODO: I very vaguely remember such a function directly calling the underlying function in c stdlib which is system dependent on format strings.
        # If this is the case, find a way to do this in another way. Regex and create date yourself, perhaps?
        try:
            date = datetime.strptime(date_str, "%Y-%m-%d")
        except ValueError:
            raise ValueError(f"File {fname}: invalid date '{date_str}', expected YYYY-MM-DD")
        unix_millis = int(date.timestamp() * 1000)

        content_raw = "\n".join(lines[3:])
        blocks = [b.strip() for b in content_raw.split("\n\n") if b.strip()]

        content: List[BlogContent] = []
        for block in blocks:
            if block.startswith("# "):
                content.append(BlogHeader(type="BlogHeader", title=block[2:].strip()))
            elif block.startswith("[") and block.endswith("]"):
                url = block[1:-1].strip()
                content.append(BlogImage(type="BlogImage", url=url))
            else:
                content.append(BlogParagraph(type="BlogParagraph", text=block))

        entry = BlogEntry(
            location=city,
            date=unix_millis,
            title=title,
            content=content,
        )
        entries.append(entry)

    return {
        "cities": [asdict(c) for c in cities],
        "entries": [
            {
                "location": asdict(e.location),
                "date": e.date,
                "title": e.title,
                "content": [asdict(c) for c in e.content],
            }
            for e in entries
        ],
    }


# --- Flask App ---
app = Flask(__name__)

@app.route("/", methods=["GET"])
def root():
    data = load_blog_data()
    return jsonify(data)


if __name__ == "__main__":
    app.run(debug=True)

