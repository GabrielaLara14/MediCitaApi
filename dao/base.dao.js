const db = require('../services/mysql.service');

class BaseDao {
  constructor({ table, idColumn, columns, secretColumns = {} }) {
    this.table = table;
    this.idColumn = idColumn;
    this.writableColumns = { ...columns, ...secretColumns };
    this.selectClause = [
      `${idColumn} AS id`,
      ...Object.entries(columns).map(([property, column]) => `${column} AS ${property}`),
    ].join(', ');
  }

  async findAll(filters = {}) {
    const { clauses, values } = this.buildFilters(filters);
    const whereClause = clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '';

    const [rows] = await db.execute(
      `SELECT ${this.selectClause} FROM ${this.table} ${whereClause} ORDER BY ${this.idColumn}`,
      values,
    );
    return rows;
  }

  async findById(id) {
    const [rows] = await db.execute(
      `SELECT ${this.selectClause} FROM ${this.table} WHERE ${this.idColumn} = ?`,
      [id],
    );
    return rows[0] ?? null;
  }

  async create(data) {
    const entries = this.toColumnEntries(data);
    const columnNames = entries.map(([column]) => column);
    const values = entries.map(([, value]) => value);
    const placeholders = columnNames.map(() => '?');

    const [result] = await db.execute(
      `INSERT INTO ${this.table} (${columnNames.join(', ')}) VALUES (${placeholders.join(', ')})`,
      values,
    );
    return this.findById(result.insertId);
  }

  async update(id, data) {
    const entries = this.toColumnEntries(data);
    const assignments = entries.map(([column]) => `${column} = ?`);
    const values = entries.map(([, value]) => value);

    await db.execute(`UPDATE ${this.table} SET ${assignments.join(', ')} WHERE ${this.idColumn} = ?`, [
      ...values,
      id,
    ]);
    return this.findById(id);
  }

  async remove(id) {
    const [result] = await db.execute(`DELETE FROM ${this.table} WHERE ${this.idColumn} = ?`, [id]);
    return result.affectedRows > 0;
  }

  buildFilters(filters) {
    const entries = this.toColumnEntries(filters);
    return {
      clauses: entries.map(([column]) => `${column} = ?`),
      values: entries.map(([, value]) => value),
    };
  }

  toColumnEntries(data) {
    return Object.entries(data)
      .filter(([property, value]) => property in this.writableColumns && value !== undefined)
      .map(([property, value]) => [this.writableColumns[property], value]);
  }
}

module.exports = BaseDao;
