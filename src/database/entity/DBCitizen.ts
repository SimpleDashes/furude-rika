import { addDays, intervalToDuration } from 'date-fns';
import type { CommandInteraction } from 'discord.js';
import CurrencyContainer from '../../containers/CurrencyContainer';
import MessageCreator from '../../utils/MessageCreator';
import FurudeOperations from '../FurudeOperations';
import type IDatabaseOperation from '../interfaces/IDatabaseOperation';
import GuildHyperDate from '../objects/hypervalues/concrets/guilds/GuildHyperDate';
import GuildHyperNumber from '../objects/hypervalues/concrets/guilds/GuildHyperNumber';
import type { HyperTypes } from '../objects/hypervalues/HyperTypes';
import type CurrencyContext from '../../contexts/currency/CurrencyContext';
import { Entity, Column, OneToOne } from 'typeorm';
import DBUser from './user/DBUser';
import SnowFlakeIDEntity from './abstracts/SnowFlakeIDEntity';

interface IStreakOperation extends IDatabaseOperation {
  readonly lostStreak: boolean;
  readonly gotMaxStreak: boolean;
}

/**
 * This class contains information related to a Furude citizen,
 * they could possibly have things such as "Furude coins",
 * have some online exclusive "assets" and others.
 */
@Entity()
export default class DBCitizen extends SnowFlakeIDEntity {
  public static readonly WEEKLY_STREAK = 7;
  public static readonly AMOUNT_DAILY = 50;

  @OneToOne(() => DBUser, (user) => user.citizen)
  public user!: DBUser;

  @Column(() => GuildHyperNumber)
  public capital = new GuildHyperNumber();

  @Column(() => GuildHyperNumber)
  public streak = new GuildHyperNumber();

  @Column(() => GuildHyperDate)
  public lastTimeClaimedDaily = new GuildHyperDate(null);

  public constructor(user: DBUser) {
    super();
    if (user) {
      this.user = user;
      this.id = user.id;
    }
  }

  #incrementCapital(
    interaction: CommandInteraction,
    type: HyperTypes,
    amount: number
  ): IDatabaseOperation {
    let capital = this.capital.getValueSwitchedForType(interaction.guild, type);

    const resultingCapital = capital + amount;

    if (resultingCapital < 0) {
      return FurudeOperations.error(
        `${this.user.id} couldn't complete increment capital operation, because he doesn't have enough ${CurrencyContainer.CURRENCY_NAME}`
      );
    }

    capital = Math.max(0, resultingCapital);

    this.capital.setValueSwitchedForType(interaction.guild, type, capital);

    return FurudeOperations.success(`Incremented ${this.user.id} capital.`);
  }

  /**
   *
   * @param amount Amount of days to be incremented (usually will always be 1)
   * @returns wether we reached the max streak.
   */
  #incrementStreak(
    interaction: CommandInteraction,
    type: HyperTypes,
    duration: Duration,
    selectedLastTimeClaimedDaily: Date | null | undefined,
    amount = 1
  ): IStreakOperation {
    const INCREMENT_SUCCESS = ', incremented streak successfully.';

    const DEFAULT_UNFORTUNATELY = ' but unfortunately ';
    let unfortunately = DEFAULT_UNFORTUNATELY;

    let lostStreak = false;
    let gotMaxStreak = false;

    const makeSuccess = (prefix: string): IStreakOperation => {
      let response = `${prefix}${INCREMENT_SUCCESS}$`;
      if (unfortunately != DEFAULT_UNFORTUNATELY) {
        response += unfortunately;
      }
      return {
        ...FurudeOperations.success(response),
        ...{ lostStreak, gotMaxStreak },
      };
    };

    let streak = this.streak.getValueSwitchedForType(interaction.guild, type);

    if (selectedLastTimeClaimedDaily) {
      if (duration.days && duration.days > 1) {
        streak = 0;
        lostStreak = true;
        unfortunately += ' lost the streak...';
      }
    }

    streak += amount;
    this.streak.setValueSwitchedForType(interaction.guild, type, streak);

    if (streak % DBCitizen.WEEKLY_STREAK === 0) {
      gotMaxStreak = true;
      return makeSuccess('Streak achieved');
    }

    return makeSuccess('Streak not achieved');
  }

  /**
   *
   * @param amount the amount of coins to be claimed
   * @returns wether you could claim or not because you had already claimed this day
   */
  public claimDaily(
    context: CurrencyContext<unknown>,
    type: HyperTypes,
    amount = DBCitizen.AMOUNT_DAILY
  ): IDatabaseOperation {
    const { interaction, client } = context;
    const { localizer } = client;

    const dateNow = new Date();
    const selectedLastTimeClaimedDaily =
      this.lastTimeClaimedDaily.getValueSwitchedForType(
        interaction.guild,
        type
      );
    const startDate = selectedLastTimeClaimedDaily ?? dateNow;

    const duration = intervalToDuration({
      start: startDate,
      end: dateNow,
    });

    if (selectedLastTimeClaimedDaily && duration.days == 0) {
      const ableToClaimWhen = addDays(startDate, 1);
      return FurudeOperations.error(
        localizer.getTranslationFromContext(
          context,
          (k) => k.database.citizen.claims.fail,
          {
            TIME: MessageCreator.timeStamp(ableToClaimWhen),
            CURRENCY_NAME: CurrencyContainer.CURRENCY_NAME,
          }
        )
      );
    } else {
      this.lastTimeClaimedDaily.setValueSwitchedForType(
        interaction.guild,
        type,
        dateNow
      );
    }

    const streakOperation = this.#incrementStreak(
      interaction,
      type,
      duration,
      selectedLastTimeClaimedDaily
    );

    if (streakOperation.gotMaxStreak) {
      amount *= 2;
    }

    this.#incrementCapital(interaction, type, amount);

    return FurudeOperations.success(
      localizer.getTranslationFromContext(
        context,
        (k) => k.database.citizen.claims.success,
        {
          CURRENCY_NAME: CurrencyContainer.CURRENCY_NAME,
          AMOUNT: MessageCreator.block(amount.toFixed()),
          STREAK: MessageCreator.block(
            this.streak
              .getValueSwitchedForType(interaction.guild, type)
              .toFixed()
          ),
          TOTAL: MessageCreator.block(
            this.capital
              .getValueSwitchedForType(interaction.guild, type)
              .toFixed()
          ),
        }
      )
    );
  }
}
