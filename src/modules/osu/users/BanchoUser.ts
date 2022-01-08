import IBanchoAPIUserResponse from '../servers/implementations/bancho/interfaces/IBanchoAPIUserResponse';
import BaseOsuUser from './BaseOsuUser';

export default class BanchoUser extends BaseOsuUser<IBanchoAPIUserResponse> {}
