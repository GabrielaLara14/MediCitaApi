// DAO genérico: construye las consultas SQL del CRUD a partir de la tabla y las columnas de cada recurso.
const db = require('../services/mysql.service');

class BaseDao {
  // table: nombre de la tabla. idColumn: llave primaria.
  // columns: propiedad de la API -> columna. secretColumns: columnas que se escriben pero no se devuelven.
  constructor({ table, idColumn, columns, secretColumns = {} }) {
    this.table = table;
    this.idColumn = idColumn;
    // Columnas permitidas para escribir (las normales más las secretas).
    this.writableColumns = { ...columns, ...secretColumns };
    // Fragmento SELECT con alias, por ejemplo "id_patient AS patientId", para devolver los nombres de la API.
    this.selectClause = [
      `${idColumn} AS id`,
      ...Object.entries(columns).map(([property, column]) => `${column} AS ${property}`),
    ].join(', ');
  }

  // Lista los registros que cumplan los filtros, ordenados por id.
  async findAll(filters = {}) {
    const { clauses, values } = this.buildFilters(filters);
    // Si no hay filtros, no se agrega WHERE.
    const whereClause = clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '';

    const [rows] = await db.execute(
      `SELECT ${this.selectClause} FROM ${this.table} ${whereClause} ORDER BY ${this.idColumn}`,
      values,
    );
    return rows;
  }

  // Busca un registro por su id; devuelve null si no existe.
  async findById(id) {
    const [rows] = await db.execute(
      `SELECT ${this.selectClause} FROM ${this.table} WHERE ${this.idColumn} = ?`,
      [id],
    );
    return rows[0] ?? null;
  }

  // Inserta una fila con los datos recibidos y devuelve el registro recién creado.
  async create(data) {
    const entries = this.toColumnEntries(data);
    const columnNames = entries.map(([column]) => column);
    const values = entries.map(([, value]) => value);
    // Un "?" por cada valor, para usar parámetros preparados.
    const placeholders = columnNames.map(() => '?');

    const [result] = await db.execute(
      `INSERT INTO ${this.table} (${columnNames.join(', ')}) VALUES (${placeholders.join(', ')})`,
      values,
    );
    return this.findById(result.insertId);
  }

  // Actualiza solo las columnas recibidas y devuelve el registro ya actualizado.
  async update(id, data) {
    const entries = this.toColumnEntries(data);
    // Genera "columna = ?" por cada dato, por ejemplo "name = ?, phone = ?".
    const assignments = entries.map(([column]) => `${column} = ?`);
    const values = entries.map(([, value]) => value);

    await db.execute(`UPDATE ${this.table} SET ${assignments.join(', ')} WHERE ${this.idColumn} = ?`, [
      ...values,
      id,
    ]);
    return this.findById(id);
  }

  // Elimina por id; devuelve true si se borró alguna fila.
  async remove(id) {
    const [result] = await db.execute(`DELETE FROM ${this.table} WHERE ${this.idColumn} = ?`, [id]);
    return result.affectedRows > 0;
  }

  // Convierte los filtros en condiciones "columna = ?" unidas luego con AND.
  buildFilters(filters) {
    const entries = this.toColumnEntries(filters);
    return {
      clauses: entries.map(([column]) => `${column} = ?`),
      values: entries.map(([, value]) => value),
    };
  }

  // Traduce {propiedad: valor} a [columna, valor], descartando propiedades desconocidas o sin valor.
  // Así solo se pueden usar columnas declaradas, lo que protege la consulta.
  toColumnEntries(data) {
    return Object.entries(data)
      .filter(([property, value]) => property in this.writableColumns && value !== undefined)
      .map(([property, value]) => [this.writableColumns[property], value]);
  }
}

module.exports = BaseDao;
