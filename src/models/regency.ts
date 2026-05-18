import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Province from './province.js'
import District from './district.js'

export default class Regency extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare provinceId: number

  @column()
  declare name: string

  @belongsTo(() => Province)
  declare province: BelongsTo<typeof Province>

  @hasMany(() => District)
  declare districts: HasMany<typeof District>
}
