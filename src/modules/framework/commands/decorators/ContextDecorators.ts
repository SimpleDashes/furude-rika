/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Channel, GuildMember, Role, User } from 'discord.js';
import type BooleanOption from '../../options/classes/BooleanOption';
import type ChannelOption from '../../options/classes/ChannelOption';
import type IntegerOption from '../../options/classes/IntegerOption';
import type MentionableOptions from '../../options/classes/MentionableOption';
import type NumberOption from '../../options/classes/NumberOption';
import type RoleOption from '../../options/classes/RoleOption';
import type StringOption from '../../options/classes/StringOption';
import type UserOption from '../../options/classes/UserOption';
import type IDiscordOption from '../../options/interfaces/IDiscordOption';
import type { ILazyApply } from '../../options/interfaces/ILazyApply';

export type MapCommandOption<
  R,
  T extends IDiscordOption<R>
> = T['required'] extends true ? R : R | undefined;

export type TypedArgs<A> = {
  [K in keyof A]: A[K] extends ILazyApply
    ? A[K]
    : A[K] extends BooleanOption
    ? MapCommandOption<boolean, A[K]>
    : A[K] extends ChannelOption
    ? MapCommandOption<Channel, A[K]>
    : A[K] extends IntegerOption | NumberOption
    ? MapCommandOption<number, A[K]>
    : A[K] extends MentionableOptions
    ? MapCommandOption<GuildMember | Role | User, A[K]>
    : A[K] extends RoleOption
    ? MapCommandOption<Role, A[K]>
    : A[K] extends StringOption
    ? MapCommandOption<string, A[K]>
    : A[K] extends UserOption
    ? MapCommandOption<User, A[K]>
    : A[K];
};
