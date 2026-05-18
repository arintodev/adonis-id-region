import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import District from './district.js'

export default class Village extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare districtId: number

  @column()
  declare name: string

  @column()
  declare postalCode: string | null

  @belongsTo(() => District)
  declare district: BelongsTo<typeof District>
}
