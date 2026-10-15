SET NAMES utf8mb4;
USE db_medicita;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE review;
TRUNCATE TABLE exam;
TRUNCATE TABLE appointment;
TRUNCATE TABLE doctor;
TRUNCATE TABLE patient;
TRUNCATE TABLE admin;
SET FOREIGN_KEY_CHECKS = 1;

-- Contrasena de admin: Admin12345 | Contrasena de pacientes: Paciente123
INSERT INTO admin (name, email, password_hash) VALUES
  ('Administrador MediCita', 'admin@medicita.com', '$2b$10$9hHsknxza.kUZPlo2FnMs.F1uAqZxNe/Di5B7/fMIAodCbLqBRoMG');

INSERT INTO patient (name, email, phone, password_hash) VALUES
  ('Ana Torres', 'ana.torres@correo.com', '3001112233', '$2b$10$oLFr6u0PhUiFqHfeix4xx.uaFSmc6WYpevOJKXycZZaR66D5RAZ5S'),
  ('Luis Pérez', 'luis.perez@correo.com', '3004445566', '$2b$10$oLFr6u0PhUiFqHfeix4xx.uaFSmc6WYpevOJKXycZZaR66D5RAZ5S'),
  ('Marta Ruiz', 'marta.ruiz@correo.com', '3007778899', '$2b$10$oLFr6u0PhUiFqHfeix4xx.uaFSmc6WYpevOJKXycZZaR66D5RAZ5S');

INSERT INTO doctor (name, specialty, working_hours, consultation_fee, biography) VALUES
  ('Dr. Carlos Rivera', 'Cardiología', 'Lunes a viernes 8:00 - 12:00', 120000.00, 'Cardiólogo con 15 años de experiencia.'),
  ('Dra. Sofía Medina', 'Pediatría', 'Martes y jueves 14:00 - 18:00', 90000.00, 'Pediatra especializada en nutrición infantil.'),
  ('Dr. Andrés Castillo', 'Dermatología', 'Lunes, miércoles y viernes 9:00 - 13:00', 80000.00, NULL),
  ('Dra. Valentina Ortiz', 'Neurología', 'Lunes a jueves 13:00 - 17:00', 150000.00, 'Neuróloga con enfoque en cefaleas y epilepsia.');

INSERT INTO appointment (id_patient, id_doctor, date_time, price, status) VALUES
  (1, 1, '2026-09-10 09:00:00', 120000.00, 'completada'),
  (1, 2, '2026-09-12 10:30:00', 90000.00, 'completada'),
  (1, 3, '2027-02-10 15:00:00', 80000.00, 'programada'),
  (3, 1, '2027-02-11 08:30:00', 120000.00, 'programada'),
  (2, 4, '2027-02-12 11:00:00', 150000.00, 'cancelada');

INSERT INTO exam (id_patient, type, numeric_value, reference_range, qualitative_result, image_report, image_url) VALUES
  (1, 'cuantitativo', 92.50, '70 - 100 mg/dL', NULL, NULL, NULL),
  (2, 'imagen', NULL, NULL, NULL, 'Sin hallazgos patológicos.', 'https://ejemplo.com/imagenes/rx-torax.png');

INSERT INTO review (id_appointment, id_doctor, rating, comment, wait_time_min, tags) VALUES
  (1, 1, 5, 'Excelente atención y muy puntual.', 5, '["puntual", "amable"]');
