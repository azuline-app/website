// The artworks the home page picks from, one per visit. Only public-domain or CC BY pieces, each shown with its
// credit and a link to where it came from. Files are in public/art, at most 1000 px wide.
export interface Artwork {
  file: string;
  w: number;
  h: number;
  title: string;
  artist: string;
  date?: string;
  licence: string;
  licenceUrl?: string;
  source: string;
  alt: string;
}

export const ARTWORKS: Artwork[] = [
  {
    file: 'met-337497',
    w: 1180,
    h: 1600,
    title: 'Studies for the Libyan Sibyl',
    artist: 'Michelangelo',
    date: 'ca. 1510–11',
    licence: 'Public domain',
    source: 'https://www.metmuseum.org/art/collection/search/337497',
    alt: 'Red chalk studies of a muscular back, a head and hands',
  },
  {
    file: 'cma-293239',
    w: 834,
    h: 1600,
    title: 'Dancing Fox',
    artist: 'Ohara Koson',
    date: '1900s–1910s',
    licence: 'Public domain',
    source: 'https://clevelandart.org/art/2016.546',
    alt: 'Woodblock print of an orange fox dancing on its hind legs with leaves on its head',
  },
  {
    file: 'wc-russian-wonder-tales-081',
    w: 1264,
    h: 1600,
    title: 'Vasilisa the Beautiful',
    artist: 'Ivan Bilibin',
    date: '1899–1900',
    licence: 'Public domain',
    source: 'https://commons.wikimedia.org/wiki/File:Russian_Wonder_Tales_081.jpg',
    alt: 'Vasilisa in a white shirt walking through a dark forest with a skull lantern',
  },
  {
    file: 'pc-david-revoy-pepper-c-tworks-2017-week-3-graceful',
    w: 1486,
    h: 1600,
    title: 'Graceful',
    artist: 'David Revoy',
    date: '2017',
    licence: 'CC BY 4.0',
    licenceUrl: 'https://creativecommons.org/licenses/by/4.0/',
    source: 'https://www.peppercarrot.com',
    alt: 'Ink drawing of a girl carrying a large jug on her shoulder through tall grass',
  },
  {
    file: 'met-57688',
    w: 1106,
    h: 1600,
    title: 'Hokusai Manga, a page from the sketchbooks',
    artist: 'Hokusai',
    licence: 'Public domain',
    source: 'https://www.metmuseum.org/art/collection/search/57688',
    alt: 'Book page with an ink drawing of a warrior fighting a wild animal',
  },
  {
    file: 'cma-148901',
    w: 1226,
    h: 1600,
    title: 'Ilsee, Princesse de Tripoli',
    artist: 'Alphonse Mucha',
    date: '1897',
    licence: 'Public domain',
    source: 'https://clevelandart.org/art/1977.1018',
    alt: 'Art nouveau lithograph of a reclining princess inside an ornamental frame',
  },
];
