-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: db_medicita
-- ------------------------------------------------------
-- Server version	8.0.46

-- Crea la base de datos del proyecto (si no existe) y la selecciona para los comandos siguientes.
-- Las líneas /*!40101 ... */ siguientes las genera MySQL Workbench: guardan la configuración actual
-- (codificación, zona horaria, validación de llaves) para restaurarla al final del script.
CREATE DATABASE IF NOT EXISTS db_medicita;
USE db_medicita;

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
-- Desactiva temporalmente la validación de llaves foráneas para poder crear las tablas en cualquier orden.
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
-- Administradores del sistema. Inician sesión con correo y contraseña cifrada.
CREATE TABLE `admin` (
  -- Identificador único, se genera solo (AUTO_INCREMENT).
  `id_admin` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  -- Contraseña cifrada con bcrypt (nunca en texto plano).
  `password_hash` varchar(255) NOT NULL,
  PRIMARY KEY (`id_admin`),
  -- No permite dos administradores con el mismo correo.
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `appointment`
--

DROP TABLE IF EXISTS `appointment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
-- Citas médicas: une a un paciente con un médico en una fecha y hora, con el precio acordado y su estado.
CREATE TABLE `appointment` (
  -- Identificador único, se genera solo.
  `id_appointment` int unsigned NOT NULL AUTO_INCREMENT,
  -- Paciente que pidió la cita.
  `id_patient` int unsigned NOT NULL,
  -- Médico que la atenderá.
  `id_doctor` int unsigned NOT NULL,
  -- Fecha y hora de la cita (en UTC).
  `date_time` datetime NOT NULL,
  -- Precio cobrado: copia de la tarifa del médico al agendar.
  `price` decimal(10,2) unsigned NOT NULL,
  -- Estado: programada, completada o cancelada.
  `status` varchar(30) NOT NULL DEFAULT 'programada',
  PRIMARY KEY (`id_appointment`),
  -- Índices de las llaves foráneas, para consultar más rápido por paciente o por médico.
  KEY `fk_appointment_patient` (`id_patient`),
  KEY `fk_appointment_doctor` (`id_doctor`),
  -- Llaves foráneas: la cita debe referirse a un médico y un paciente existentes.
  -- ON DELETE RESTRICT impide borrar un médico o paciente que tenga citas.
  CONSTRAINT `fk_appointment_doctor` FOREIGN KEY (`id_doctor`) REFERENCES `doctor` (`id_doctor`) ON DELETE RESTRICT,
  CONSTRAINT `fk_appointment_patient` FOREIGN KEY (`id_patient`) REFERENCES `patient` (`id_patient`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointment`
--

LOCK TABLES `appointment` WRITE;
/*!40000 ALTER TABLE `appointment` DISABLE KEYS */;
/*!40000 ALTER TABLE `appointment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exam`
--

DROP TABLE IF EXISTS `exam`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
-- Exámenes de los pacientes. Según el tipo se llena el valor numérico, el resultado cualitativo o el informe con imagen.
CREATE TABLE `exam` (
  -- Identificador único, se genera solo.
  `id_exam` int unsigned NOT NULL AUTO_INCREMENT,
  -- Paciente al que pertenece el examen.
  `id_patient` int unsigned NOT NULL,
  -- Tipo: cuantitativo, cualitativo o imagen.
  `type` varchar(30) NOT NULL,
  -- Resultado numérico (exámenes cuantitativos).
  `numeric_value` decimal(10,2) DEFAULT NULL,
  -- Rango normal de referencia, por ejemplo "70 - 100 mg/dL".
  `reference_range` varchar(50) DEFAULT NULL,
  -- Resultado en texto, como "Negativo" (exámenes cualitativos).
  `qualitative_result` varchar(100) DEFAULT NULL,
  -- Informe escrito del examen de imagen.
  `image_report` text,
  -- Enlace a la imagen (exámenes de imagen).
  `image_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_exam`),
  KEY `fk_exam_patient` (`id_patient`),
  -- ON DELETE CASCADE: si se elimina el paciente, también se eliminan sus exámenes.
  CONSTRAINT `fk_exam_patient` FOREIGN KEY (`id_patient`) REFERENCES `patient` (`id_patient`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exam`
--

LOCK TABLES `exam` WRITE;
/*!40000 ALTER TABLE `exam` DISABLE KEYS */;
/*!40000 ALTER TABLE `exam` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctor`
--

DROP TABLE IF EXISTS `doctor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
-- Médicos disponibles, con su especialidad, horario de atención y tarifa de consulta.
CREATE TABLE `doctor` (
  -- Identificador único, se genera solo.
  `id_doctor` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  -- Especialidad médica.
  `specialty` varchar(100) NOT NULL,
  -- Horario de atención en texto.
  `working_hours` varchar(100) NOT NULL,
  -- Tarifa de la consulta (no puede ser negativa).
  `consultation_fee` decimal(10,2) unsigned NOT NULL,
  -- Descripción del médico (opcional).
  `biography` text,
  PRIMARY KEY (`id_doctor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctor`
--

LOCK TABLES `doctor` WRITE;
/*!40000 ALTER TABLE `doctor` DISABLE KEYS */;
/*!40000 ALTER TABLE `doctor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patient`
--

DROP TABLE IF EXISTS `patient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
-- Pacientes registrados. Inician sesión con correo y contraseña cifrada.
CREATE TABLE `patient` (
  -- Identificador único, se genera solo.
  `id_patient` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  -- Teléfono de contacto.
  `phone` varchar(30) NOT NULL,
  -- Contraseña cifrada con bcrypt (nunca en texto plano).
  `password_hash` varchar(255) NOT NULL,
  PRIMARY KEY (`id_patient`),
  -- No permite dos pacientes con el mismo correo.
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patient`
--

LOCK TABLES `patient` WRITE;
/*!40000 ALTER TABLE `patient` DISABLE KEYS */;
/*!40000 ALTER TABLE `patient` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review`
--

DROP TABLE IF EXISTS `review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
-- Reseñas que los pacientes dejan sobre una cita completada (una reseña por cita).
CREATE TABLE `review` (
  -- Identificador único, se genera solo.
  `id_review` int unsigned NOT NULL AUTO_INCREMENT,
  -- Cita reseñada.
  `id_appointment` int unsigned NOT NULL,
  -- Médico reseñado (se toma de la cita).
  `id_doctor` int unsigned NOT NULL,
  -- Calificación de 1 a 5.
  `rating` tinyint unsigned NOT NULL,
  `comment` text,
  -- Minutos que esperó el paciente (opcional).
  `wait_time_min` int unsigned DEFAULT NULL,
  -- Etiquetas como lista JSON, por ejemplo ["puntual", "amable"].
  `tags` json DEFAULT NULL,
  PRIMARY KEY (`id_review`),
  -- UNIQUE: cada cita solo puede tener una reseña.
  UNIQUE KEY `id_appointment` (`id_appointment`),
  KEY `fk_review_doctor` (`id_doctor`),
  -- ON DELETE CASCADE: si se elimina la cita o el médico, también se eliminan sus reseñas.
  CONSTRAINT `fk_review_appointment` FOREIGN KEY (`id_appointment`) REFERENCES `appointment` (`id_appointment`) ON DELETE CASCADE,
  CONSTRAINT `fk_review_doctor` FOREIGN KEY (`id_doctor`) REFERENCES `doctor` (`id_doctor`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review`
--

LOCK TABLES `review` WRITE;
/*!40000 ALTER TABLE `review` DISABLE KEYS */;
/*!40000 ALTER TABLE `review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'db_medicita'
--
-- Restaura la configuración original que se guardó al inicio del script.
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-13 17:49:15
