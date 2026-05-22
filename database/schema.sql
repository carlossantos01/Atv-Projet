CREATE DATABASE IF NOT EXISTS barbearia_vanguard;
USE barbearia_vanguard;


CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    perfil VARCHAR(20) DEFAULT 'profissional'
);


CREATE TABLE profissionais (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    especialidade VARCHAR(100),
    telefone VARCHAR(20),
    ativo TINYINT(1) DEFAULT 1
);


CREATE TABLE servicos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    duracao_min INT NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    profissional_id INT,
    FOREIGN KEY (profissional_id) REFERENCES profissionais(id) ON DELETE SET NULL
);


CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    telefone VARCHAR(20) NOT NULL,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE agendamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT,
    servico_id INT,
    data_hora DATETIME NOT NULL,
    status VARCHAR(20) DEFAULT 'Agendado',
    observacao TEXT,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
    FOREIGN KEY (servico_id) REFERENCES servicos(id) ON DELETE CASCADE
);