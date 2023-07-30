import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function useFormatDate() {
  const formatDate = (date) => {
    return format(date, 'dd/MM/yyyy HH:mm', { locale: ptBR });
  };
  
  return {
    formatDate
  }
}
