// Country data with flag URLs from Wikimedia Commons
// All flag images are hotlinked from Wikimedia Commons

export interface Country {
  code: string;
  name_en: string;
  name_fr: string;
  flagUrl: string;
}

export const countries: Country[] = [
  {
    code: 'US',
    name_en: 'United States',
    name_fr: 'États-Unis',
    flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Flag_of_the_United_States.svg/320px-Flag_of_the_United_States.svg.png'
  },
  {
    code: 'CA',
    name_en: 'Canada',
    name_fr: 'Canada',
    flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/320px-Flag_of_Canada_%28Pantone%29.svg.png'
  },
  {
    code: 'MX',
    name_en: 'Mexico',
    name_fr: 'Mexique',
    flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Flag_of_Mexico.svg/320px-Flag_of_Mexico.svg.png'
  },
  {
    code: 'BR',
    name_en: 'Brazil',
    name_fr: 'Brésil',
    flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Flag_of_Brazil.svg/320px-Flag_of_Brazil.svg.png'
  },
  {
    code: 'AR',
    name_en: 'Argentina',
    name_fr: 'Argentine',
    flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Flag_of_Argentina.svg/320px-Flag_of_Argentina.svg.png'
  },
  {
    code: 'GB',
    name_en: 'United Kingdom',
    name_fr: 'Royaume-Uni',
    flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Flag_of_the_United_Kingdom.svg/320px-Flag_of_the_United_Kingdom.svg.png'
  },
  {
    code: 'FR',
    name_en: 'France',
    name_fr: 'France',
    flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Flag_of_France.svg/320px-Flag_of_France.svg.png'
  },
  {
    code: 'DE',
    name_en: 'Germany',
    name_fr: 'Allemagne',
    flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Flag_of_Germany.svg/320px-Flag_of_Germany.svg.png'
  },
  {
    code: 'IT',
    name_en: 'Italy',
    name_fr: 'Italie',
    flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Flag_of_Italy.svg/320px-Flag_of_Italy.svg.png'
  },
  {
    code: 'ES',
    name_en: 'Spain',
    name_fr: 'Espagne',
    flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Flag_of_Spain.svg/320px-Flag_of_Spain.svg.png'
  },
  {
    code: 'PT',
    name_en: 'Portugal',
    name_fr: 'Portugal',
    flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Flag_of_Portugal.svg/320px-Flag_of_Portugal.svg.png'
  },
  {
    code: 'NL',
    name_en: 'Netherlands',
    name_fr: 'Pays-Bas',
    flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Flag_of_the_Netherlands.svg/320px-Flag_of_the_Netherlands.svg.png'
  },
  {
    code: 'BE',
    name_en: 'Belgium',
    name_fr: 'Belgique',
    flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Flag_of_Belgium.svg/320px-Flag_of_Belgium.svg.png'
  },
  {
    code: 'CH',
    name_en: 'Switzerland',
    name_fr: 'Suisse',
    flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Flag_of_Switzerland.svg/240px-Flag_of_Switzerland.svg.png'
  },
  {
    code: 'SE',
    name_en: 'Sweden',
    name_fr: 'Suède',
    flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Flag_of_Sweden.svg/320px-Flag_of_Sweden.svg.png'
  },
  {
    code: 'NO',
    name_en: 'Norway',
    name_fr: 'Norvège',
    flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Norway.svg/320px-Flag_of_Norway.svg.png'
  },
  {
    code: 'DK',
    name_en: 'Denmark',
    name_fr: 'Danemark',
    flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Flag_of_Denmark.svg/320px-Flag_of_Denmark.svg.png'
  },
  {
    code: 'FI',
    name_en: 'Finland',
    name_fr: 'Finlande',
    flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Flag_of_Finland.svg/320px-Flag_of_Finland.svg.png'
  },
  {
    code: 'PL',
    name_en: 'Poland',
    name_fr: 'Pologne',
    flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Flag_of_Poland.svg/320px-Flag_of_Poland.svg.png'
  },
  {
    code: 'GR',
    name_en: 'Greece',
    name_fr: 'Grèce',
    flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Flag_of_Greece.svg/320px-Flag_of_Greece.svg.png'
  },
  {
    code: 'RU',
    name_en: 'Russia',
    name_fr: 'Russie',
    flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Flag_of_Russia.svg/320px-Flag_of_Russia.svg.png'
  },
  {
    code: 'JP',
    name_en: 'Japan',
    name_fr: 'Japon',
    flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Flag_of_Japan.svg/320px-Flag_of_Japan.svg.png'
  },
  {
    code: 'CN',
    name_en: 'China',
    name_fr: 'Chine',
    flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Flag_of_the_People%27s_Republic_of_China.svg/320px-Flag_of_the_People%27s_Republic_of_China.svg.png'
  },
  {
    code: 'KR',
    name_en: 'South Korea',
    name_fr: 'Corée du Sud',
    flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Flag_of_South_Korea.svg/320px-Flag_of_South_Korea.svg.png'
  },
  {
    code: 'IN',
    name_en: 'India',
    name_fr: 'Inde',
    flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Flag_of_India.svg/320px-Flag_of_India.svg.png'
  },
  {
    code: 'TH',
    name_en: 'Thailand',
    name_fr: 'Thaïlande',
    flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Flag_of_Thailand.svg/320px-Flag_of_Thailand.svg.png'
  },
  {
    code: 'VN',
    name_en: 'Vietnam',
    name_fr: 'Viêt Nam',
    flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Vietnam.svg/320px-Flag_of_Vietnam.svg.png'
  },
  {
    code: 'ID',
    name_en: 'Indonesia',
    name_fr: 'Indonésie',
    flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Flag_of_Indonesia.svg/320px-Flag_of_Indonesia.svg.png'
  },
  {
    code: 'PH',
    name_en: 'Philippines',
    name_fr: 'Philippines',
    flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Flag_of_the_Philippines.svg/320px-Flag_of_the_Philippines.svg.png'
  },
  {
    code: 'AU',
    name_en: 'Australia',
    name_fr: 'Australie',
    flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Flag_of_Australia_%28converted%29.svg/320px-Flag_of_Australia_%28converted%29.svg.png'
  },
  {
    code: 'NZ',
    name_en: 'New Zealand',
    name_fr: 'Nouvelle-Zélande',
    flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Flag_of_New_Zealand.svg/320px-Flag_of_New_Zealand.svg.png'
  },
  {
    code: 'ZA',
    name_en: 'South Africa',
    name_fr: 'Afrique du Sud',
    flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Flag_of_South_Africa.svg/320px-Flag_of_South_Africa.svg.png'
  },
  {
    code: 'EG',
    name_en: 'Egypt',
    name_fr: 'Égypte',
    flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Flag_of_Egypt.svg/320px-Flag_of_Egypt.svg.png'
  },
  {
    code: 'NG',
    name_en: 'Nigeria',
    name_fr: 'Nigéria',
    flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Flag_of_Nigeria.svg/320px-Flag_of_Nigeria.svg.png'
  },
  {
    code: 'KE',
    name_en: 'Kenya',
    name_fr: 'Kenya',
    flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Flag_of_Kenya.svg/320px-Flag_of_Kenya.svg.png'
  },
  {
    code: 'MA',
    name_en: 'Morocco',
    name_fr: 'Maroc',
    flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Flag_of_Morocco.svg/320px-Flag_of_Morocco.svg.png'
  },
  {
    code: 'TR',
    name_en: 'Turkey',
    name_fr: 'Turquie',
    flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Flag_of_Turkey.svg/320px-Flag_of_Turkey.svg.png'
  },
  {
    code: 'SA',
    name_en: 'Saudi Arabia',
    name_fr: 'Arabie Saoudite',
    flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Flag_of_Saudi_Arabia.svg/320px-Flag_of_Saudi_Arabia.svg.png'
  },
  {
    code: 'AE',
    name_en: 'United Arab Emirates',
    name_fr: 'Émirats Arabes Unis',
    flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Flag_of_the_United_Arab_Emirates.svg/320px-Flag_of_the_United_Arab_Emirates.svg.png'
  },
  {
    code: 'IL',
    name_en: 'Israel',
    name_fr: 'Israël',
    flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Flag_of_Israel.svg/320px-Flag_of_Israel.svg.png'
  },
  {
    code: 'CL',
    name_en: 'Chile',
    name_fr: 'Chili',
    flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Flag_of_Chile.svg/320px-Flag_of_Chile.svg.png'
  },
  {
    code: 'CO',
    name_en: 'Colombia',
    name_fr: 'Colombie',
    flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Colombia.svg/320px-Flag_of_Colombia.svg.png'
  },
  {
    code: 'PE',
    name_en: 'Peru',
    name_fr: 'Pérou',
    flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Flag_of_Peru.svg/320px-Flag_of_Peru.svg.png'
  },
  {
    code: 'IS',
    name_en: 'Iceland',
    name_fr: 'Islande',
    flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Flag_of_Iceland.svg/320px-Flag_of_Iceland.svg.png'
  },
  {
    code: 'IE',
    name_en: 'Ireland',
    name_fr: 'Irlande',
    flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Flag_of_Ireland.svg/320px-Flag_of_Ireland.svg.png'
  },
  {
    code: 'AT',
    name_en: 'Austria',
    name_fr: 'Autriche',
    flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Flag_of_Austria.svg/320px-Flag_of_Austria.svg.png'
  },
  {
    code: 'CZ',
    name_en: 'Czech Republic',
    name_fr: 'République Tchèque',
    flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Flag_of_the_Czech_Republic.svg/320px-Flag_of_the_Czech_Republic.svg.png'
  },
  {
    code: 'UA',
    name_en: 'Ukraine',
    name_fr: 'Ukraine',
    flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Flag_of_Ukraine.svg/320px-Flag_of_Ukraine.svg.png'
  }
];
