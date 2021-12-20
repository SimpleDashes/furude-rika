import FurudeRika from '../client/FurudeRika';
import BaseCommand from '../framework/commands/BaseCommand';
import ICommandInformation from '../framework/commands/ICommandInformation';

export default abstract class FurudeCommand extends BaseCommand<FurudeRika> {
  public constructor(information: ICommandInformation) {
    super(information);
  }
}
