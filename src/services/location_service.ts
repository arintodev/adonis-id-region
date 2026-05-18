import Country from '../models/country.js'
import Province from '../models/province.js'
import Regency from '../models/regency.js'
import District from '../models/district.js'
import Village from '../models/village.js'

export class LocationService {
  public async getCountries() {
    return await Country.query().orderBy('name', 'asc')
  }

  public async getProvinces(countryId?: string) {
    const query = Province.query().orderBy('name', 'asc')
    if (countryId) {
      query.where('countryId', countryId)
    }
    return await query
  }

  public async getRegencies(provinceId: number) {
    return await Regency.query().where('provinceId', provinceId).orderBy('name', 'asc')
  }

  public async getDistricts(regencyId: number) {
    return await District.query().where('regencyId', regencyId).orderBy('name', 'asc')
  }

  public async getVillages(districtId: number) {
    return await Village.query().where('districtId', districtId).orderBy('name', 'asc')
  }

  public async searchVillage(keyword: string) {
    return await Village.query()
      .whereILike('name', `%${keyword}%`)
      .preload('district', (q) => {
        q.preload('regency', (q2) => {
          q2.preload('province')
        })
      })
      .limit(20)
  }

  public async fullAddress(villageId: number, street?: string): Promise<string> {
    const village = await Village.query()
      .where('id', villageId)
      .preload('district', (q) => {
        q.preload('regency', (q2) => {
          q2.preload('province', (q3) => {
            q3.preload('country')
          })
        })
      })
      .first()

    if (!village) {
      throw new Error('Village not found')
    }

    const parts = []
    if (street) parts.push(street)
    parts.push(`Desa/Kelurahan ${village.name}`)
    parts.push(`Kecamatan ${village.district.name}`)
    parts.push(`${village.district.regency.name}`)
    parts.push(`Provinsi ${village.district.regency.province.name}`)
    if (village.postalCode) parts.push(village.postalCode)
    parts.push(village.district.regency.province.country.name)

    return parts.join(', ')
  }
}

export default new LocationService()
