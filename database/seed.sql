-- Datos de ejemplo para probar la API. Ejecutarlo deja la base en su estado inicial cada vez.
-- Usa la codificación utf8mb4 para guardar bien las tildes y la ñ.
SET NAMES utf8mb4;
USE db_medicita;

-- Vacía todas las tablas. Se desactivan las llaves foráneas para poder vaciarlas en cualquier orden
-- y se reactivan después. TRUNCATE también reinicia los ids desde 1.
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE review;
TRUNCATE TABLE exam;
TRUNCATE TABLE appointment;
TRUNCATE TABLE doctor;
TRUNCATE TABLE patient;
TRUNCATE TABLE admin;
SET FOREIGN_KEY_CHECKS = 1;

-- Contrasena de admin: Admin12345 | Contrasena de pacientes: Paciente123
-- Un administrador (las contraseñas se guardan ya cifradas con bcrypt).
INSERT INTO admin (name, email, password_hash) VALUES
  ('Administrador MediCita', 'admin@medicita.com', '$2b$10$9hHsknxza.kUZPlo2FnMs.F1uAqZxNe/Di5B7/fMIAodCbLqBRoMG');

-- Tres pacientes de ejemplo (ids 1, 2 y 3), todos con la misma contraseña.
INSERT INTO patient (name, email, phone, password_hash) VALUES
  ('Ana Torres', 'ana.torres@correo.com', '3001112233', '$2b$10$oLFr6u0PhUiFqHfeix4xx.uaFSmc6WYpevOJKXycZZaR66D5RAZ5S'),
  ('Luis Pérez', 'luis.perez@correo.com', '3004445566', '$2b$10$oLFr6u0PhUiFqHfeix4xx.uaFSmc6WYpevOJKXycZZaR66D5RAZ5S'),
  ('Marta Ruiz', 'marta.ruiz@correo.com', '3007778899', '$2b$10$oLFr6u0PhUiFqHfeix4xx.uaFSmc6WYpevOJKXycZZaR66D5RAZ5S');

-- Cuatro médicos de ejemplo (ids 1 a 4). La biografía puede ser NULL (vacía).
INSERT INTO doctor (name, specialty, working_hours, consultation_fee, biography) VALUES
  ('Dr. Carlos Rivera', 'Cardiología', 'Lunes a viernes 8:00 - 12:00', 120000.00, 'Cardiólogo con 15 años de experiencia.'),
  ('Dra. Sofía Medina', 'Pediatría', 'Martes y jueves 14:00 - 18:00', 90000.00, 'Pediatra especializada en nutrición infantil.'),
  ('Dr. Andrés Castillo', 'Dermatología', 'Lunes, miércoles y viernes 9:00 - 13:00', 80000.00, NULL),
  ('Dra. Valentina Ortiz', 'Neurología', 'Lunes a jueves 13:00 - 17:00', 150000.00, 'Neuróloga con enfoque en cefaleas y epilepsia.');

-- Cinco citas de ejemplo: dos completadas, dos programadas y una cancelada.
-- Las columnas id_patient e id_doctor se refieren a los ids de las tablas anteriores.
INSERT INTO appointment (id_patient, id_doctor, date_time, price, status) VALUES
  (1, 1, '2026-09-10 09:00:00', 120000.00, 'completada'),
  (1, 2, '2026-09-12 10:30:00', 90000.00, 'completada'),
  (1, 3, '2027-02-10 15:00:00', 80000.00, 'programada'),
  (3, 1, '2027-02-11 08:30:00', 120000.00, 'programada'),
  (2, 4, '2027-02-12 11:00:00', 150000.00, 'cancelada');

-- Dos exámenes: uno cuantitativo (con valor numérico) y uno de imagen (con informe y enlace).
INSERT INTO exam (id_patient, type, numeric_value, reference_range, qualitative_result, image_report, image_url) VALUES
  (1, 'cuantitativo', 92.50, '70 - 100 mg/dL', NULL, NULL, NULL),
  (2, 'imagen', NULL, NULL, NULL, 'Sin hallazgos patológicos.', 'https://ejemplo.com/imagenes/rx-torax.png');

-- Una reseña de la cita 1 (completada). Las etiquetas se guardan como lista JSON.
INSERT INTO review (id_appointment, id_doctor, rating, comment, wait_time_min, tags) VALUES
  (1, 1, 5, 'Excelente atención y muy puntual.', 5, '["puntual", "amable"]');
