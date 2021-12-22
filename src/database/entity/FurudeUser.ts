import { Column, Entity } from 'typeorm';
import SupportedFurudeLocales from '../../localization/SupportedFurudeLocales';
import DiscordUser from './DiscordUser';

@Entity()
export class FurudeUser extends DiscordUser {
  @Column()
  preferred_locale?: SupportedFurudeLocales;
}
