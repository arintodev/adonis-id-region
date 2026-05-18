# @arintodev/adonis-location

A reusable and scalable location module for AdonisJS 7 using TypeScript and Lucid ORM. This package provides models, migrations, seeders, services, and validators for managing countries, provinces, regencies, districts, and villages.

## Features
- **Clean Architecture:** Domain-oriented and scalable structure.
- **Lucid Models:** Relationships pre-configured (Country -> Province -> Regency -> District -> Village).
- **Service Class:** Reusable `LocationService` for querying hierarchical location data.
- **Data Seeding:** Built-in seeder for bulk-inserting CSV data using transactions and chunking (optimized for large datasets like villages).
- **VineJS Validator:** Pre-compiled validator for location fields.

## Installation

Since this is an internal package, you can install it from your local directory or private npm registry:

```bash
npm install @arintodev/adonis-location
```

## Configuration

1. **Register the Provider**
   In your AdonisJS project, open `adonisrc.ts` and add the provider:

   ```typescript
   export default defineConfig({
     providers: [
       // ...
       () => import('@arintodev/adonis-location/build/src/providers/location_provider.js')
     ]
   })
   ```

2. **Run Migrations**
   Because migrations are shipped within the package, you need to execute them. If you prefer, copy them or run them directly if your setup allows package migrations. (Example if executing from project root):
   
   ```bash
   node ace migration:run
   ```

3. **Seeding Data**
   Prepare your `.csv` data files in a `data` folder at the root of your project:
   - `data/countries.csv`
   - `data/provinces.csv`
   - `data/regencies.csv`
   - `data/districts.csv`
   - `data/villages.csv`
   
   Then run the seeder:
   ```bash
   node ace db:seed
   ```

## Example API Usage

**Using the LocationService inside a controller:**

```typescript
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { LocationService } from '@arintodev/adonis-location'

@inject()
export default class LocationController {
  constructor(private locationService: LocationService) {}

  public async getProvinces({ request, response }: HttpContext) {
    const countryId = request.input('country_id', 'IDN')
    const provinces = await this.locationService.getProvinces(countryId)
    return response.json(provinces)
  }

  public async getFullAddress({ params, response }: HttpContext) {
    const address = await this.locationService.fullAddress(params.villageId)
    return response.json({ address })
  }
}
```

**Using the Validator:**

```typescript
import type { HttpContext } from '@adonisjs/core/http'
import { addressValidator } from '@arintodev/adonis-location'

export default class AddressController {
  public async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(addressValidator)
    
    // Save address with payload...
    return response.created(payload)
  }
}
```
