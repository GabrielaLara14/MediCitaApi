// Convierte una fecha o un mes en un rango [inicio, fin) en UTC para filtrar consultas por período.

// Rango de un día: desde las 00:00 de esa fecha hasta las 00:00 del día siguiente.
function getDayRange(dateText) {
  const start = new Date(`${dateText}T00:00:00.000Z`);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);
  return { start, end };
}

// Rango de un mes: desde el día 1 de ese mes hasta el día 1 del mes siguiente.
function getMonthRange(monthText) {
  const start = new Date(`${monthText}-01T00:00:00.000Z`);
  const end = new Date(start);
  end.setUTCMonth(end.getUTCMonth() + 1);
  return { start, end };
}

module.exports = { getDayRange, getMonthRange };
