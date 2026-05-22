const db = require('../config/database');

exports.listarTodos = async (req, res) => {
    try {
        const query = `
            SELECT a.id, c.nome AS cliente, s.nome AS servico, p.nome AS profissional, a.data_hora, a.status
            FROM agendamentos a
            JOIN clientes c ON a.cliente_id = c.id
            JOIN servicos s ON a.servico_id = s.id
            JOIN profissionais p ON s.profissional_id = p.id
            ORDER BY a.data_hora ASC
        `;
        const [linhas] = await db.query(query);
        res.json(linhas);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

exports.criar = async (req, res) => {
    const { cliente_id, servico_id, data_hora, observacao } = req.body;
    try {
        const sql = 'INSERT INTO agendamentos (cliente_id, servico_id, data_hora, observacao) VALUES (?, ?, ?, ?)';
        const [result] = await db.query(sql, [cliente_id, servico_id, data_hora, observacao]);
        res.status(201).json({ id: result.insertId, mensagem: 'Agendado com sucesso!' });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

exports.deletar = async (req, res) => {
    try {
        await db.query('DELETE FROM agendamentos WHERE id = ?', [req.params.id]);
        res.json({ mensagem: 'Agendamento cancelado.' });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};