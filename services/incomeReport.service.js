const { MONEY_DECIMALS } = require('../env/constants');
const { getDayRange, getMonthRange } = require('../utils/period');

class IncomeReportService {
  constructor(appointmentDao) {
    this.appointmentDao = appointmentDao;
  }

  async generate({ date, month }) {
    const { start, end } = date ? getDayRange(date) : getMonthRange(month);
    const appointments = await this.appointmentDao.findActiveBetween(start, end);
    const totalIncome = appointments.reduce((total, appointment) => total + appointment.price, 0);

    return {
      period: { from: start, to: end },
      totalAppointments: appointments.length,
      totalIncome: Number(totalIncome.toFixed(MONEY_DECIMALS)),
      appointments,
    };
  }
}

module.exports = IncomeReportService;
