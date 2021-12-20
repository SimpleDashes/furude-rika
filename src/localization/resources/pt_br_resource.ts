import FurudeResource from '../FurudeResource';
import SupportedFurudeLocales from '../SupportedFurudeLocales';

export default class extends FurudeResource {
  public constructor() {
    super(SupportedFurudeLocales.pt_br, {
      // AVATAR
      AVATAR_RESPONSE: 'Aqui, toma o avatar do(a) [$USER]',

      // PING
      PING_TO_PING: 'Pinguei em [$PING]ms',
      PING_NOT_REACHABLE: 'Não consegui pingar...',

      // DEPLOY
      DEPLOY_COMMAND_NOT_FOUND:
        'Eu não consegui achar o comando especificado na minha lista de comandos...',
      DEPLOY_COMMAND_CORRUPTED:
        'O comando especificado está provavelmente corrompido!',
      DEPLOY_COMMAND_ERROR: 'Tive um erro tentando fazer deploy deste comando!',
      DEPLOY_COMMAND_SUCCESS: 'Consegui fazer deploy desse comando!',

      // CALC
      CALC_RESULTS: '[$EXPR] dá: [$RES]',
    });
  }
}
