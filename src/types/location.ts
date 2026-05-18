import type Country from '../models/country.js'
import type Province from '../models/province.js'
import type Regency from '../models/regency.js'
import type District from '../models/district.js'
import type Village from '../models/village.js'

export interface LocationServiceContract {
  getCountries(): Promise<Country[]>
  getProvinces(countryId?: string): Promise<Province[]>
  getRegencies(provinceId: number): Promise<Regency[]>
  getDistricts(regencyId: number): Promise<District[]>
  getVillages(districtId: number): Promise<Village[]>
  searchVillage(keyword: string): Promise<Village[]>
  fullAddress(villageId: number): Promise<string>
}
