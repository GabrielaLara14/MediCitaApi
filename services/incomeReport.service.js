// Reporte de ingresos: suma el precio de las citas no canceladas de un día o de un mes.
const { MONEY_DECIMALS } = require('../env/constants');
const { getDayRange, getMonthRange } = require('../utils/period');

class IncomeReportService {
  constructor(appointmentDao) {
    this.appointmentDao = appointmentDao;
  }

  // Recibe "date" (un día) o "month" (un mes); el validador garantiza que llegue solo uno.
  async generate({ date, month }) {
    const { start, end } = date ? getDayRange(date) : getMonthRange(month);
    const appointments = await this.appointmentDao.findActiveBetween(start, end);
    // Suma los precios de todas las citas encontradas.
    const totalIncome = appointments.reduce((total, appointment) => total + appointment.price, 0);

    return {
      period: { from: start, to: end },
      totalAppointments: appointments.length,
      // toFixed redondea a 2 decimales para evitar errores de coma flotante (0.1 + 0.2).
      totalIncome: Number(totalIncome.toFixed(MONEY_DECIMALS)),
      appointments,
    };
  }
}

module.exports = IncomeReportService;
