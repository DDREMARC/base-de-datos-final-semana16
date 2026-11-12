-- Ejecutar UNA vez, conectado como SYSTEM (o SYS as SYSDBA) en Oracle XE.
-- Crea el usuario que usa api/conexion.php. Luego ejecutar tio_sam_oracle_11g.sql como TIOSAM.
CREATE USER tiosam IDENTIFIED BY tiosam123
  DEFAULT TABLESPACE users QUOTA UNLIMITED ON users;
GRANT CREATE SESSION, CREATE TABLE, CREATE VIEW, CREATE SEQUENCE, CREATE TRIGGER TO tiosam;
