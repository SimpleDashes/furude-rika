import { Locale, ResourceValue } from 'discowork';
import FurudeResource from '../FurudeResource';
import { ResourceArguments } from '../FurudeResourceStructure';

export default class extends FurudeResource {
  public constructor() {
    super(Locale.pt_BR, {
      avatar: {
        response: new ResourceValue(
          (b) => [
            `Avatar do(a) ${b.USER} é bem lindo mesmo...`,
            `Toma logo... me paga um café!`,
          ],
          [ResourceArguments.USER]
        ),
      },

      ping: {
        response: new ResourceValue(
          (b) => `Pinguei em ${b.PING}ms`,
          [ResourceArguments.PING]
        ),
        unreachable: new ResourceValue(
          () => 'O servidor não me respondeu...',
          []
        ),
      },

      deploy: {
        command: {
          missing: new ResourceValue(
            () => 'Não consegui encontrar o comando especificado.',
            []
          ),
          corrupted: new ResourceValue(
            () => 'O comando especificado provavelmente está corrompido.',
            []
          ),
          error: new ResourceValue(
            () => 'Não consegui fazer deploy do comando especificado.',
            []
          ),
          success: new ResourceValue(
            () => 'Fiz deploy do comando especificado com sucesso.',
            []
          ),
        },
      },

      calc: {
        response: new ResourceValue(
          (b) => `${b.EXPRESSION} equals to: ${b.RESULT}`,
          [ResourceArguments.EXPRESSION, ResourceArguments.RESULT]
        ),
        fail: new ResourceValue(
          (b) =>
            `Talvez eu seja meio retardada, mas eu não acho que ${b.EXPRESSION} é uma expressão matemática.`,
          [ResourceArguments.EXPRESSION]
        ),
        variables: {
          description: new ResourceValue(
            (b) => `Com as variáveis sendo: ${b.VARIABLES}`,
            [ResourceArguments.VARIABLES]
          ),
          missing: new ResourceValue(
            (b) =>
              `Você esqueceu de adicionar as seguintes variáveis: ${b.VARIABLES}, para a expressão: ${b.EXPRESSION}`,
            [ResourceArguments.VARIABLES, ResourceArguments.EXPRESSION]
          ),
        },
      },

      coin: {
        heads: new ResourceValue(() => 'Cara', []),
        tails: new ResourceValue(() => 'Coroa', []),
        response: new ResourceValue(
          (b) => `~Eu lanço uma moeda no ar... ela para no lado da ${b.SIDE}.`,
          [ResourceArguments.SIDE]
        ),
      },

      command: {
        error: {
          missing_permissions: new ResourceValue(
            () => 'Você não tem permissões suficientes para usar esse comando.',
            []
          ),
          owner_only: new ResourceValue(
            () => 'Apenas meu dono pode usar esse comando.',
            []
          ),
          requires_guild: new ResourceValue(
            () =>
              'Você precisa executar este comando em um servidor do discord...',
            []
          ),
        },

        subcommand: {
          error: {
            required: new ResourceValue(
              () => 'Eu não encontrei o subcomando especificado...',
              []
            ),
          },
          group: {
            error: {
              required: new ResourceValue(
                () =>
                  'Você precisa escolher um subcomando para poder rodar este comando.',
                []
              ),
            },
          },
        },
      },

      customize: {
        locale: {
          user: {
            response: new ResourceValue(
              () => [
                'Se você realmente quer que eu fale assim, ok.',
                'Tá bom então né, fazer o que... vou te responder assim quando possível...',
              ],
              []
            ),
          },
          guild: {
            responses: {
              default: new ResourceValue(
                () =>
                  'Agora os membros deste servidor vão ser respondidos em português...',
                []
              ),
              any: new ResourceValue(
                () =>
                  'Então quer dizer que tanto faz? então eu vou deixar as outras regras de idioma regularem...',
                []
              ),
            },
          },
          channel: {
            responses: {
              default: new ResourceValue(
                () => 'Nesse canal somente pode falar em português? entendido.',
                []
              ),
              any: new ResourceValue(
                () => 'Então tanto faz a lingua nesse canal?... ok.',
                []
              ),
            },
          },
        },
      },

      economy: {
        open: {
          success: new ResourceValue(
            (b) => `Ok, abri uma conta de ${b.CURRENCY_NAME} pra você...`,
            [ResourceArguments.CURRENCY_NAME]
          ),
          fail: new ResourceValue(
            (b) => `Você já tem uma conta de ${b.CURRENCY_NAME}, não enche...`,
            [ResourceArguments.CURRENCY_NAME]
          ),
        },
        balance: {
          fail: new ResourceValue(
            (b) =>
              `Você ou o usuário mencionado não possui uma conta ${b.CURRENCY_NAME}...`,
            [ResourceArguments.CURRENCY_NAME]
          ),
        },
        error: {
          no_account: new ResourceValue(
            (b) =>
              `Você precisa abrir uma conta ${b.CURRENCY_NAME} para usar este comando!`,
            [ResourceArguments.CURRENCY_NAME]
          ),
        },
      },

      database: {
        guild: {
          xp: {
            channels: {
              whitelisted: new ResourceValue(
                (b) =>
                  `Whitelistei o canal: ${b.CHANNEL} (Ele voltou a dar xp).`,
                [ResourceArguments.CHANNEL]
              ),
              blacklisted: new ResourceValue(
                (b) =>
                  `Blacklistei o canal: ${b.CHANNEL} (Ele não está mais dando xp).`,
                [ResourceArguments.CHANNEL]
              ),
              already: {
                whitelisted: new ResourceValue(
                  (b) => `${b.CHANNEL} já tá na whitelist...`,
                  [ResourceArguments.CHANNEL]
                ),
                blacklisted: new ResourceValue(
                  (b) => `${b.CHANNEL} já tá blacklist...`,
                  [ResourceArguments.CHANNEL]
                ),
              },
            },
            time: {
              changed: new ResourceValue(
                (b) =>
                  `Ok! o cooldown para receber xp é de ${b.TIME} a partir de agora...`,
                [ResourceArguments.TIME]
              ),
            },
          },
        },
        citizen: {
          claims: {
            fail: new ResourceValue(
              (b) =>
                `Voce já fez claim das suas ${b.CURRENCY_NAME}s diárias... Você pode fazer claim novamente em: ${b.TIME}`,
              [ResourceArguments.TIME, ResourceArguments.CURRENCY_NAME]
            ),
            success: new ResourceValue(
              (b) =>
                `Você acaba de receber suas ${b.AMOUNT} ${b.CURRENCY_NAME}s diárias, você agora está em um streak de ${b.STREAK} dias, Você tem um total de ${b.TOTAL} ${b.CURRENCY_NAME}s agora!`,
              [
                ResourceArguments.STREAK,
                ResourceArguments.AMOUNT,
                ResourceArguments.TOTAL,
                ResourceArguments.CURRENCY_NAME,
              ]
            ),
          },
        },
      },

      reminder: {
        error: {
          no_time_frame: new ResourceValue(
            () =>
              'Você precisa ao menos por uma medida de tempo... não sou adivinha.',
            []
          ),
          max_reached: new ResourceValue(
            (b) =>
              `Você só pode ter até ${b.LIMIT} lembretes ao mesmo tempo, desculpa.`,
            [ResourceArguments.LIMIT]
          ),
        },
        remove: {
          success: new ResourceValue(
            (b) => `Removi o lembrete no índice: ${b.INDEX}`,
            [ResourceArguments.INDEX]
          ),
          fail: new ResourceValue(
            (b) => `Não consegui remover o lembrete no índice: ${b.INDEX}`,
            [ResourceArguments.INDEX]
          ),
        },
        reminding: new ResourceValue(
          (b) => `Lembrete: ${b.CONTENT}`,
          [ResourceArguments.CONTENT]
        ),
        will_remind: new ResourceValue(
          () => 'Ok! Irei lembrar você sobre isso!',
          []
        ),
        will_fire: new ResourceValue(
          (b) => `${b.CONTENT} vai ser alarmado em ${b.TIME}`,
          [ResourceArguments.CONTENT, ResourceArguments.TIME]
        ),
        string: new ResourceValue(
          (b) => `Lembretinhos do(a) ${b.USER}`,
          [ResourceArguments.USER]
        ),
      },

      osu: {
        account: {
          added: new ResourceValue(
            (b) =>
              `Adicionei as(a) conta(s) com os nomes de usuário ${b.USERNAME} ao(s) servidor(es) ${b.OSU_SERVER} para você.`,
            [ResourceArguments.USERNAME, ResourceArguments.OSU_SERVER]
          ),
          error: {
            not_found: new ResourceValue(
              () =>
                'Não consegui encontrar um usuário com esse username ou id, no servidor especificado.',
              []
            ),
          },
        },
        preferred_server: {
          changed: new ResourceValue(
            (b) =>
              `Mudei o seu servidor padrão do osu! pro ${b.OSU_SERVER}... :D`,
            [ResourceArguments.OSU_SERVER]
          ),
          already_prefer_this_server: new ResourceValue(
            () =>
              'Você já usa o servidor selecionado como o seu servidor padrão...',
            []
          ),
        },
      },

      errors: {
        nothing_here: new ResourceValue(() => 'Nada para ver aqui...', []),
      },
    });
  }
}
