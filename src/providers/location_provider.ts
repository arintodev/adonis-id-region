import { ApplicationService } from '@adonisjs/core/types'
import { LocationService } from '../services/location_service.js'

export default class LocationProvider {
  constructor(protected app: ApplicationService) {}

  public register() {
    this.app.container.singleton(LocationService, () => {
      return new LocationService()
    })
  }

  public async boot() {}
}
