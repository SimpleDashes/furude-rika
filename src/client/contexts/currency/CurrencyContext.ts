import DefaultContext from '../DefaultContext';

export default class CurrencyContext extends DefaultContext {
  protected override async build(): Promise<void> {
    await super.build();
    this.dbUser.citizen = await this.db.getCitizen(
      this.runner.interaction.user
    );
  }
}
