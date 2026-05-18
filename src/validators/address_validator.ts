import vine from '@vinejs/vine'

export const addressValidator = vine.compile(
  vine.object({
    country_id: vine.string().trim().minLength(3).maxLength(3),
    province_id: vine.number(),
    regency_id: vine.number(),
    district_id: vine.number(),
    village_id: vine.number(),
    street: vine.string().trim().minLength(3),
  })
)
