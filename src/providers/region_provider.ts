import { ApplicationService } from '@adonisjs/core/types'
import { RegionService } from '../services/region_service.js'

export default class RegionProvider {
  constructor(protected app: ApplicationService) { }

  public register() {
    this.app.container.singleton(RegionService, () => {
      return new RegionService()
    })
  }

  public async boot() { }
}
