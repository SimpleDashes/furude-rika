import _ from 'lodash';
import type IRulesetInfo from './IRulesetInfo';

export default class RulesetInfo implements IRulesetInfo {
  public name;
  public shortName;

  public constructor(name = '', shortName = '') {
    this.name = name;
    this.shortName = shortName;
  }

  public clone(): RulesetInfo {
    return _.clone(this);
  }
}
