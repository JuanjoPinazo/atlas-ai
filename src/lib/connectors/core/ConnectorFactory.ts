import { ConnectorType } from '@/lib/schemas/integration';
import { IConnector } from './Connector.interface';
import { GesdenConnector } from '../adapters/gesden.connector';
import { WhatsAppConnector } from '../adapters/whatsapp.connector';
import { GCalendarConnector } from '../adapters/gcalendar.connector';
import { M365Connector } from '../adapters/m365.connector';
import { StripeConnector } from '../adapters/stripe.connector';
import { DentalLabConnector } from '../adapters/dental-lab.connector';

export class ConnectorFactory {
  static create(type: ConnectorType): IConnector {
    switch (type) {
      case 'GESDEN': return new GesdenConnector();
      case 'WHATSAPP_BUSINESS': return new WhatsAppConnector();
      case 'GOOGLE_CALENDAR': return new GCalendarConnector();
      case 'MICROSOFT_365': return new M365Connector();
      case 'STRIPE': return new StripeConnector();
      case 'DENTAL_LAB': return new DentalLabConnector();
      default:
        throw new Error(`Connector type ${type} is not supported.`);
    }
  }
}
