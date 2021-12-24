import { CommandInteraction } from 'discord.js';
import { Column, Entity } from 'typeorm';
import CurrencyContainer from '../../containers/CurrencyContainer';
import MessageFactory from '../../helpers/MessageFactory';
import FurudeLocales from '../../localization/FurudeLocales';
import FurudeTranslationKeys from '../../localization/FurudeTranslationKeys';
import FurudeOperations from '../FurudeOperations';
import IDatabaseOperation from '../interfaces/IDatabaseOperation';

import SnowFlakeIDEntity from './abstracts/SnowFlakeIDEntity';

/**
 * This class contains information related to a Furude citizen,
 * they could possibly have things such as "Furude coins",
 * have some online exclusive "assets" and others.
 */
@Entity()
export default class DBCitizen extends SnowFlakeIDEntity {
  public static readonly STARTING_CAPITAL = 100;
  public static readonly MAX_STREAK = 10;
  public static readonly AMOUNT_DAILY = 50;

  @Column('int')
  capital: number = 0;

  @Column('int')
  streak: number = 0;

  @Column('date')
  lastTimeClaimedDaily?: Date;

  justCreated?: boolean | null;

  /**
   *
   * @param amount the amount of coins to be incremented
   * @returns wether the operation has succeeded
   */
  public incrementCapital(amount: number): IDatabaseOperation {
    const resultingCapital = this.capital + amount;

    if (resultingCapital < 0) {
      return FurudeOperations.error(
        `${this.id} couldn't complete increment capital operation, because he doesn't have enough ${CurrencyContainer.CURRENCY_NAME}`
      );
    }

    this.capital = Math.max(0, resultingCapital);

    return FurudeOperations.success(`Incremented ${this.id} capital.`);
  }

  /**
   *
   * @param amount Amount of days to be incremented (usually will always be 1)
   * @returns wether we reached the max streak.
   */
  private incrementStreak(amount = 1): IDatabaseOperation {
    const incrementSuccess = ', incremented streak successfully.';
    const makeSuccess = (prefix: string) => {
      return FurudeOperations.success(`${prefix}${incrementSuccess}`);
    };

    this.streak += amount;
    if (this.streak == DBCitizen.MAX_STREAK) {
      this.streak = amount;
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
    localizer: FurudeLocales,
    amount = DBCitizen.AMOUNT_DAILY
  ): IDatabaseOperation {
    const dateNow = new Date();

    if (this.lastTimeClaimedDaily?.getDay() === dateNow.getDay()) {
      return FurudeOperations.error(
        localizer.get(FurudeTranslationKeys.DATABASE_CITIZEN_ALREADY_CLAIMED)
      );
    } else {
      this.lastTimeClaimedDaily = dateNow;
    }

    if (this.incrementStreak()) {
      amount *= 2;
    }

    this.incrementCapital(amount);

    return FurudeOperations.success(
      localizer.get(FurudeTranslationKeys.DATABASE_CITIZEN_CLAIM_SUCCESS, [
        amount.toFixed(),
        this.streak.toString(),
        this.capital.toFixed(),
      ])
    );
  }

  /**
   * Assigns a new account (this instance) to our parent (A DBUser).
   * If the parent didn't had an open account beforehand.
   */
  public openAccount(localizer: FurudeLocales): IDatabaseOperation {
    if (!this.justCreated) {
      return FurudeOperations.error(
        localizer.get(FurudeTranslationKeys.ECONOMY_OPEN_FAIL)
      );
    }

    this.capital = DBCitizen.STARTING_CAPITAL;

    return FurudeOperations.success(
      localizer.get(FurudeTranslationKeys.ECONOMY_OPEN_SUCCESS)
    );
  }
}
