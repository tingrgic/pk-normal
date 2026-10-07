export const club = {
  name: "PK Normal",
  city: "Zagreb",
  competition: "4. liga · skupina B",
  admission: "12. kolovoza 2026.",
  registration: "21015646",
  email: "pikadonormal@gmail.com",
  emailHref: "mailto:pikadonormal@gmail.com",
  instagram: "@pikadonormal",
  instagramHref: "https://www.instagram.com/pikadonormal/",
  venue: "CB Quattro",
  address: "Zagrebačka 26, Sesvete",
  sources: {
    admission: "https://psgz.hr/pk-normal-novi-clan-psgza",
    registry:
      "https://psgz.hr/user-content/zagreb/files/ud2/2026/8/00000224_registar-20262027.pdf",
    team: "https://hps-dart.hr/normal",
    club: "https://hps-dart.hr/pk-normal",
    competitions: "https://psgz.hr/competitions",
  },
  checked: "16. 9. 2026.",
};
export const players = [
  {
    first: "Rikard",
    last: "Milašinović",
    initials: "RM",
    role: "Predsjednik / kapetan",
    slug: "milasinovic-rikard",
  },
  {
    first: "Tin",
    last: "Grgić",
    initials: "TG",
    role: "Igrač",
    slug: "grgic-tin",
  },
  {
    first: "Ivan",
    last: "Štimac",
    initials: "IŠ",
    role: "Igrač",
    slug: "stimac-ivan",
  },
  {
    first: "Stjepan",
    last: "Prusac",
    initials: "SP",
    role: "Igrač",
    slug: "prusac-stjepan",
  },
  {
    first: "Franko",
    last: "Čegec",
    initials: "FČ",
    role: "Igrač",
    slug: "cegec-franko-",
  },
  {
    first: "Mihovil",
    last: "Marjanović",
    initials: "MM",
    role: "Igrač",
    slug: "marjanovic-mihovil",
  },
  {
    first: "Ivan",
    last: "Žugec",
    initials: "IŽ",
    role: "Igrač",
    slug: "zugec-ivan",
  },
  {
    first: "Franko",
    last: "Ermakora",
    initials: "FE",
    role: "Igrač",
    slug: "ermakora-franko",
  },
  {
    first: "Filip",
    last: "Jakelić",
    initials: "FJ",
    role: "Igrač",
    slug: "jakelic-filip",
  },
];
// Add confirmed results with source and check date; never synthesize scores.
export type CompetitionResult = {
  date: string;
  opponent: string;
  score: string;
  source: string;
  checked: string;
};
export const results: CompetitionResult[] = [];

// Official league snapshot for the odds simulator. Derived odds are not official.
export const oddsSnapshot = {
  "source": "https://psgz.hr/ranking-table/831",
  "api": "https://psgz.hr/site/uniondivision/UnionLeagueTable?unionId=2&seasonId=26&leagueId=831",
  "checked": "2026-10-07T11:37:23.613Z",
  "season": "2026/27",
  "competition": "4. liga · skupina B",
  "teams": [
    {
      "name": "BULLDOG GIANTS",
      "played": 4,
      "wins": 4,
      "losses": 0,
      "duelsWon": 46,
      "duelsLost": 18,
      "legsWon": 101,
      "legsLost": 54,
      "draws": 0
    },
    {
      "name": "HOLLYWOOD PROMILI",
      "played": 3,
      "wins": 3,
      "losses": 0,
      "duelsWon": 29,
      "duelsLost": 19,
      "legsWon": 44,
      "legsLost": 34,
      "draws": 0
    },
    {
      "name": "BBF BULLY BOYS",
      "played": 4,
      "wins": 2,
      "losses": 1,
      "duelsWon": 39,
      "duelsLost": 26,
      "legsWon": 88,
      "legsLost": 71,
      "draws": 1
    },
    {
      "name": "MOZART DIAMANTI",
      "played": 4,
      "wins": 2,
      "losses": 1,
      "duelsWon": 36,
      "duelsLost": 29,
      "legsWon": 85,
      "legsLost": 69,
      "draws": 1
    },
    {
      "name": "ZAGREB",
      "played": 4,
      "wins": 2,
      "losses": 1,
      "duelsWon": 34,
      "duelsLost": 31,
      "legsWon": 82,
      "legsLost": 77,
      "draws": 1
    },
    {
      "name": "BLACK M",
      "played": 3,
      "wins": 1,
      "losses": 1,
      "duelsWon": 24,
      "duelsLost": 25,
      "legsWon": 61,
      "legsLost": 62,
      "draws": 1
    },
    {
      "name": "EXTERIUM II",
      "played": 3,
      "wins": 1,
      "losses": 2,
      "duelsWon": 19,
      "duelsLost": 29,
      "legsWon": 49,
      "legsLost": 64,
      "draws": 0
    },
    {
      "name": "KOCKA FELGA CVRČAK",
      "played": 4,
      "wins": 1,
      "losses": 3,
      "duelsWon": 25,
      "duelsLost": 39,
      "legsWon": 63,
      "legsLost": 91,
      "draws": 0
    },
    {
      "name": "VRAPČE 2",
      "played": 3,
      "wins": 1,
      "losses": 2,
      "duelsWon": 24,
      "duelsLost": 24,
      "legsWon": 43,
      "legsLost": 38,
      "draws": 0
    },
    {
      "name": "PKZ VOLTAGE",
      "played": 4,
      "wins": 1,
      "losses": 3,
      "duelsWon": 28,
      "duelsLost": 36,
      "legsWon": 70,
      "legsLost": 82,
      "draws": 0
    },
    {
      "name": "NORMAL",
      "played": 4,
      "wins": 0,
      "losses": 4,
      "duelsWon": 18,
      "duelsLost": 46,
      "legsWon": 56,
      "legsLost": 100,
      "draws": 0
    }
  ],
  "players": [
    {
      "name": "Ivan Ljubej",
      "team": "VRAPČE 2",
      "played": 6,
      "wins": 6,
      "losses": 0,
      "legsWon": 12,
      "legsLost": 2
    },
    {
      "name": "Benjamin Dalipi",
      "team": "BULLDOG GIANTS",
      "played": 12,
      "wins": 11,
      "losses": 1,
      "legsWon": 23,
      "legsLost": 6
    },
    {
      "name": "Toni Kuraja",
      "team": "HOLLYWOOD PROMILI",
      "played": 12,
      "wins": 11,
      "losses": 1,
      "legsWon": 23,
      "legsLost": 5
    },
    {
      "name": "Luka Žuljević",
      "team": "BBF BULLY BOYS",
      "played": 13,
      "wins": 11,
      "losses": 2,
      "legsWon": 23,
      "legsLost": 10
    },
    {
      "name": "Goran  Lončarić",
      "team": "HOLLYWOOD PROMILI",
      "played": 8,
      "wins": 7,
      "losses": 1,
      "legsWon": 14,
      "legsLost": 3
    },
    {
      "name": "ANTONIO SABLJAK",
      "team": "BBF BULLY BOYS",
      "played": 12,
      "wins": 10,
      "losses": 2,
      "legsWon": 21,
      "legsLost": 6
    },
    {
      "name": "Josip Gucić",
      "team": "BULLDOG GIANTS",
      "played": 11,
      "wins": 9,
      "losses": 2,
      "legsWon": 19,
      "legsLost": 6
    },
    {
      "name": "Siniša Percela",
      "team": "ZAGREB",
      "played": 16,
      "wins": 12,
      "losses": 4,
      "legsWon": 26,
      "legsLost": 13
    },
    {
      "name": "Antun Berišić",
      "team": "BULLDOG GIANTS",
      "played": 14,
      "wins": 10,
      "losses": 4,
      "legsWon": 23,
      "legsLost": 13
    },
    {
      "name": "FILIP  ĐULABIĆ",
      "team": "MOZART DIAMANTI",
      "played": 16,
      "wins": 11,
      "losses": 5,
      "legsWon": 25,
      "legsLost": 15
    },
    {
      "name": "Željko Marković",
      "team": "MOZART DIAMANTI",
      "played": 16,
      "wins": 11,
      "losses": 5,
      "legsWon": 24,
      "legsLost": 12
    },
    {
      "name": "Enrico Novak",
      "team": "BULLDOG GIANTS",
      "played": 10,
      "wins": 7,
      "losses": 3,
      "legsWon": 15,
      "legsLost": 9
    },
    {
      "name": "Zdravko Besednik",
      "team": "BLACK M",
      "played": 12,
      "wins": 8,
      "losses": 4,
      "legsWon": 19,
      "legsLost": 11
    },
    {
      "name": "Luka Martić",
      "team": "EXTERIUM II",
      "played": 12,
      "wins": 8,
      "losses": 4,
      "legsWon": 16,
      "legsLost": 11
    },
    {
      "name": "Leon Berišić",
      "team": "BULLDOG GIANTS",
      "played": 14,
      "wins": 9,
      "losses": 5,
      "legsWon": 20,
      "legsLost": 14
    },
    {
      "name": "ANTON BELAN",
      "team": "ZAGREB",
      "played": 9,
      "wins": 6,
      "losses": 3,
      "legsWon": 13,
      "legsLost": 9
    },
    {
      "name": "Dejan Šimić",
      "team": "PKZ VOLTAGE",
      "played": 8,
      "wins": 5,
      "losses": 3,
      "legsWon": 10,
      "legsLost": 8
    },
    {
      "name": "Sven Klasić",
      "team": "VRAPČE 2",
      "played": 10,
      "wins": 6,
      "losses": 4,
      "legsWon": 15,
      "legsLost": 9
    },
    {
      "name": "Goran Chudy",
      "team": "ZAGREB",
      "played": 12,
      "wins": 7,
      "losses": 5,
      "legsWon": 18,
      "legsLost": 14
    },
    {
      "name": "Joko Antunović",
      "team": "PKZ VOLTAGE",
      "played": 12,
      "wins": 7,
      "losses": 5,
      "legsWon": 16,
      "legsLost": 11
    },
    {
      "name": "Hrvoje Stolar",
      "team": "PKZ VOLTAGE",
      "played": 16,
      "wins": 9,
      "losses": 7,
      "legsWon": 21,
      "legsLost": 19
    },
    {
      "name": "DOMAGOJ BENKOVIĆ",
      "team": "BBF BULLY BOYS",
      "played": 14,
      "wins": 8,
      "losses": 6,
      "legsWon": 19,
      "legsLost": 17
    },
    {
      "name": "Goran Blažinović",
      "team": "BBF BULLY BOYS",
      "played": 14,
      "wins": 8,
      "losses": 6,
      "legsWon": 17,
      "legsLost": 17
    },
    {
      "name": "Darijan Šamec-Gjurin",
      "team": "MOZART DIAMANTI",
      "played": 16,
      "wins": 8,
      "losses": 8,
      "legsWon": 20,
      "legsLost": 19
    },
    {
      "name": "Franko Dugandžić",
      "team": "BLACK M",
      "played": 12,
      "wins": 6,
      "losses": 6,
      "legsWon": 16,
      "legsLost": 14
    },
    {
      "name": "Željko Štefanović",
      "team": "VRAPČE 2",
      "played": 12,
      "wins": 6,
      "losses": 6,
      "legsWon": 14,
      "legsLost": 17
    },
    {
      "name": "Dalibor Kremenović",
      "team": "HOLLYWOOD PROMILI",
      "played": 8,
      "wins": 4,
      "losses": 4,
      "legsWon": 11,
      "legsLost": 12
    },
    {
      "name": "Robert Žabec",
      "team": "VRAPČE 2",
      "played": 8,
      "wins": 4,
      "losses": 4,
      "legsWon": 8,
      "legsLost": 12
    },
    {
      "name": "Lukas  Jurina",
      "team": "KOCKA FELGA CVRČAK",
      "played": 16,
      "wins": 7,
      "losses": 9,
      "legsWon": 17,
      "legsLost": 22
    },
    {
      "name": "Blaž Pranjkić",
      "team": "HOLLYWOOD PROMILI",
      "played": 11,
      "wins": 5,
      "losses": 6,
      "legsWon": 13,
      "legsLost": 13
    },
    {
      "name": "Nikolina Kožul",
      "team": "KOCKA FELGA CVRČAK",
      "played": 14,
      "wins": 6,
      "losses": 8,
      "legsWon": 15,
      "legsLost": 19
    },
    {
      "name": "Petar Jozić",
      "team": "BLACK M",
      "played": 9,
      "wins": 4,
      "losses": 5,
      "legsWon": 11,
      "legsLost": 13
    },
    {
      "name": "Karlo Berger",
      "team": "ZAGREB",
      "played": 12,
      "wins": 5,
      "losses": 7,
      "legsWon": 14,
      "legsLost": 15
    },
    {
      "name": "Renato Bergles",
      "team": "KOCKA FELGA CVRČAK",
      "played": 12,
      "wins": 5,
      "losses": 7,
      "legsWon": 11,
      "legsLost": 17
    },
    {
      "name": "Andrija Skendrović",
      "team": "EXTERIUM II",
      "played": 7,
      "wins": 3,
      "losses": 4,
      "legsWon": 7,
      "legsLost": 8
    },
    {
      "name": "Franko Ermakora",
      "team": "NORMAL",
      "played": 16,
      "wins": 6,
      "losses": 10,
      "legsWon": 16,
      "legsLost": 23
    },
    {
      "name": "Rikard Milašinović",
      "team": "NORMAL",
      "played": 8,
      "wins": 3,
      "losses": 5,
      "legsWon": 11,
      "legsLost": 11
    },
    {
      "name": "Robert Bebek",
      "team": "EXTERIUM II",
      "played": 8,
      "wins": 3,
      "losses": 5,
      "legsWon": 10,
      "legsLost": 12
    },
    {
      "name": "Mato Ačkar",
      "team": "BLACK M",
      "played": 8,
      "wins": 3,
      "losses": 5,
      "legsWon": 8,
      "legsLost": 12
    },
    {
      "name": "Ivan Žugec",
      "team": "NORMAL",
      "played": 8,
      "wins": 3,
      "losses": 5,
      "legsWon": 7,
      "legsLost": 11
    },
    {
      "name": "Tin Grgić",
      "team": "NORMAL",
      "played": 11,
      "wins": 4,
      "losses": 7,
      "legsWon": 11,
      "legsLost": 16
    },
    {
      "name": "Miroslav Remenarić",
      "team": "KOCKA FELGA CVRČAK",
      "played": 15,
      "wins": 5,
      "losses": 10,
      "legsWon": 14,
      "legsLost": 21
    },
    {
      "name": "Zoran Steković",
      "team": "MOZART DIAMANTI",
      "played": 12,
      "wins": 4,
      "losses": 8,
      "legsWon": 12,
      "legsLost": 16
    },
    {
      "name": "Danijel Čavić",
      "team": "HOLLYWOOD PROMILI",
      "played": 7,
      "wins": 2,
      "losses": 5,
      "legsWon": 7,
      "legsLost": 11
    },
    {
      "name": "Vito  Zirdum",
      "team": "EXTERIUM II",
      "played": 11,
      "wins": 3,
      "losses": 8,
      "legsWon": 10,
      "legsLost": 16
    },
    {
      "name": "Bruno Plehan",
      "team": "VRAPČE 2",
      "played": 8,
      "wins": 2,
      "losses": 6,
      "legsWon": 6,
      "legsLost": 14
    },
    {
      "name": "Saša Percela",
      "team": "ZAGREB",
      "played": 13,
      "wins": 3,
      "losses": 10,
      "legsWon": 9,
      "legsLost": 22
    },
    {
      "name": "Petra Ivanišević",
      "team": "PKZ VOLTAGE",
      "played": 11,
      "wins": 2,
      "losses": 9,
      "legsWon": 8,
      "legsLost": 19
    },
    {
      "name": "Mihovil Marjanović",
      "team": "NORMAL",
      "played": 8,
      "wins": 1,
      "losses": 7,
      "legsWon": 3,
      "legsLost": 14
    },
    {
      "name": "Danijel Ivanišević",
      "team": "PKZ VOLTAGE",
      "played": 11,
      "wins": 1,
      "losses": 10,
      "legsWon": 6,
      "legsLost": 21
    },
    {
      "name": "Dragutin Štefanović",
      "team": "VRAPČE 2",
      "played": 4,
      "wins": 0,
      "losses": 4,
      "legsWon": 2,
      "legsLost": 8
    },
    {
      "name": "Matej Šakota",
      "team": "PKZ VOLTAGE",
      "played": 6,
      "wins": 4,
      "losses": 2,
      "legsWon": 9,
      "legsLost": 4
    },
    {
      "name": "MARKO MALEČIĆ",
      "team": "BLACK M",
      "played": 4,
      "wins": 2,
      "losses": 2,
      "legsWon": 5,
      "legsLost": 5
    },
    {
      "name": "Miroslav Škegro",
      "team": "MOZART DIAMANTI",
      "played": 4,
      "wins": 2,
      "losses": 2,
      "legsWon": 4,
      "legsLost": 5
    },
    {
      "name": "Dominik Kossa",
      "team": "EXTERIUM II",
      "played": 5,
      "wins": 2,
      "losses": 3,
      "legsWon": 5,
      "legsLost": 7
    },
    {
      "name": "Boško Šalamon",
      "team": "KOCKA FELGA CVRČAK",
      "played": 3,
      "wins": 1,
      "losses": 2,
      "legsWon": 3,
      "legsLost": 5
    },
    {
      "name": "KARLO KRALJ",
      "team": "BLACK M",
      "played": 3,
      "wins": 1,
      "losses": 2,
      "legsWon": 2,
      "legsLost": 5
    },
    {
      "name": "Franko  Čegec",
      "team": "NORMAL",
      "played": 4,
      "wins": 1,
      "losses": 3,
      "legsWon": 3,
      "legsLost": 7
    },
    {
      "name": "Miroslav Greif",
      "team": "KOCKA FELGA CVRČAK",
      "played": 4,
      "wins": 1,
      "losses": 3,
      "legsWon": 3,
      "legsLost": 7
    },
    {
      "name": "Luka Miličić",
      "team": "BBF BULLY BOYS",
      "played": 6,
      "wins": 1,
      "losses": 5,
      "legsWon": 4,
      "legsLost": 11
    },
    {
      "name": "Stjepan Prusac",
      "team": "NORMAL",
      "played": 5,
      "wins": 0,
      "losses": 5,
      "legsWon": 3,
      "legsLost": 10
    },
    {
      "name": "Danijel Bibić",
      "team": "BBF BULLY BOYS",
      "played": 5,
      "wins": 0,
      "losses": 5,
      "legsWon": 2,
      "legsLost": 10
    },
    {
      "name": "Ivan Štimac",
      "team": "NORMAL",
      "played": 4,
      "wins": 0,
      "losses": 4,
      "legsWon": 2,
      "legsLost": 8
    },
    {
      "name": "Ante Dominković",
      "team": "BULLDOG GIANTS",
      "played": 3,
      "wins": 0,
      "losses": 3,
      "legsWon": 1,
      "legsLost": 6
    },
    {
      "name": "Ante  Bebek",
      "team": "EXTERIUM II",
      "played": 5,
      "wins": 0,
      "losses": 5,
      "legsWon": 1,
      "legsLost": 10
    },
    {
      "name": "Nikola Klarić",
      "team": "HOLLYWOOD PROMILI",
      "played": 1,
      "wins": 0,
      "losses": 1,
      "legsWon": 0,
      "legsLost": 2
    },
    {
      "name": "Denis Bukva",
      "team": "HOLLYWOOD PROMILI",
      "played": 1,
      "wins": 0,
      "losses": 1,
      "legsWon": 0,
      "legsLost": 2
    },
    {
      "name": "Stjepan Oblić",
      "team": "ZAGREB",
      "played": 2,
      "wins": 0,
      "losses": 2,
      "legsWon": 0,
      "legsLost": 4
    }
  ]
};
