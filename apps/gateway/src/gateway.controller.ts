import { Controller, Get, Inject } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, from } from 'rxjs';

@Controller()
export class GatewayController {
  constructor(
    @Inject('CATALOG_CLIENT') private readonly catalogClient: ClientProxy,
    @Inject('SEARCH_CLIENT') private readonly searchClient: ClientProxy,
    @Inject('MEDIA_CLIENT') private readonly mediaClient: ClientProxy,
  ) {}

  @Get('health')
  async health() {
    const ping = async (serviceName: string, client: ClientProxy) => {
      try {
        const result = await firstValueFrom(
          client.send('service.ping', { from: 'gateway' }),
        );

        return {
          ok: true,
          service: serviceName,
          now: new Date().toLocaleDateString(),
          result,
        };
      } catch (err: any) {
        return {
          ok: false,
          service: serviceName,
          now: new Date().toLocaleDateString(),
          error: err?.message ?? 'Unknown error',
        };
      }
    };

    const [catalog, media, search] = await Promise.all([
      ping('catalog', this.catalogClient),
      ping('search', this.searchClient),
      ping('media', this.mediaClient),
    ]);

    const ok = [catalog, media, search].every((s) => s.ok);

    return {
      ok,
      gateway: {
        gateway: 'gateway',
        now: new Date().toLocaleDateString(),
      },
      services: {
        catalog,
        media,
        search,
      },
    };
  }
}
