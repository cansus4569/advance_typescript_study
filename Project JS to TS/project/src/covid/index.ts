interface Country {
  Country: string;
  CountryCode: string;
  Date: string;
  NewConfirmed: number;
  NewDeaths: number;
  NewRecovered: number;
  Premium: any;
  Slug: string;
  TotalConfirmed: number;
  TotalDeaths: number;
  TotalRecovered: number;
}

interface Global {
  NewConfirmed: number;
  NewDeaths: number;
  NewRecovered: number;
  TotalConfirmed: number;
  TotalDeaths: number;
  TotalRecovered: number;
}

export interface CovidSummaryResponse {
  Countries: Country[];
  Date: string;
  Global: Global;
  Message: string;
}

export interface CountrySummaryInfo {
  Cases: number;
  City: string;
  CityCode: string;
  Country: string;
  CountryCode: string;
  Date: string;
  Lat: string;
  Lon: string;
  Province: string;
  Status: string;
}

export type CountrySummaryResponse = CountrySummaryInfo[];

export interface PublicDataPortalInfo {
  '#text': Array<string>;
  deathCnt: string;
  defCnt: string;
  gubun: string;
  gubunCn: string;
  gubunEn: string;
  incDec: string;
  isolClearCnt: string;
  isolIngCnt: string;
  localOccCnt: string;
  overFlowCnt: string;
  qurRate: string;
  stdDay: string;
}

export type PublicDataPortalResponse = PublicDataPortalInfo[];
