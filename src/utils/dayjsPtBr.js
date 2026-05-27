import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';
import 'dayjs/locale/pt-br';

dayjs.extend(updateLocale);

// O locale pt-br padrão usa "2ª", "3ª"... em weekdaysMin; o DatePicker do MUI
// exibe só o 1º caractere, gerando números. Usamos abreviações com letras.
dayjs.updateLocale('pt-br', {
  weekdaysMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
  weekdaysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
});

dayjs.locale('pt-br');

export default dayjs;
