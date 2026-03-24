import { hasDatabase, sql } from "../lib/db.js";

function send(res, status, body) {
    res.status(status).setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(body));
}

function mapClient(row) {
    return {
        id: row.id,
        nomeCliente: row.name,
        codigoCliente: row.code ?? "",
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        ultimoSnapshot: row.latest_snapshot,
        historico: row.historico ?? [],
        reportCount: row.report_count ?? 0
    };
}

async function listClients(query) {
    const q = query?.trim();

    if (q) {
        const term = `%${q}%`;
        return sql`
            SELECT
                c.id,
                c.name,
                c.code,
                c.latest_snapshot,
                c.created_at,
                c.updated_at,
                (
                    SELECT COUNT(*)::int
                    FROM reports r
                    WHERE r.client_id = c.id
                ) AS report_count,
                COALESCE((
                    SELECT json_agg(
                        json_build_object(
                            'id', x.id,
                            'createdAt', x.created_at,
                            'snapshot', x.snapshot
                        )
                        ORDER BY x.created_at DESC
                    )
                    FROM (
                        SELECT id, created_at, snapshot
                        FROM reports
                        WHERE client_id = c.id
                        ORDER BY created_at DESC
                        LIMIT 10
                    ) x
                ), '[]'::json) AS historico
            FROM clients c
            WHERE c.name ILIKE ${term} OR COALESCE(c.code, '') ILIKE ${term}
            ORDER BY c.updated_at DESC
            LIMIT 20
        `;
    }

    return sql`
        SELECT
            c.id,
            c.name,
            c.code,
            c.latest_snapshot,
            c.created_at,
            c.updated_at,
            (
                SELECT COUNT(*)::int
                FROM reports r
                WHERE r.client_id = c.id
            ) AS report_count,
            COALESCE((
                SELECT json_agg(
                    json_build_object(
                        'id', x.id,
                        'createdAt', x.created_at,
                        'snapshot', x.snapshot
                    )
                    ORDER BY x.created_at DESC
                )
                FROM (
                    SELECT id, created_at, snapshot
                    FROM reports
                    WHERE client_id = c.id
                    ORDER BY created_at DESC
                    LIMIT 10
                ) x
            ), '[]'::json) AS historico
        FROM clients c
        ORDER BY c.updated_at DESC
        LIMIT 20
    `;
}

async function saveClient(clientId, snapshot) {
    const dueDate = snapshot.vencimentoFatura || null;
    let clientRow;

    if (clientId) {
        const updated = await sql`
            UPDATE clients
            SET
                name = ${snapshot.nomeCliente},
                code = ${snapshot.codigoCliente || null},
                address = ${snapshot.enderecoUnidade || null},
                due_date = ${dueDate},
                latest_snapshot = ${JSON.stringify(snapshot)}::jsonb,
                updated_at = NOW()
            WHERE id = ${clientId}
            RETURNING id
        `;
        clientRow = updated[0];
    }

    if (!clientRow) {
        const inserted = await sql`
            INSERT INTO clients (
                name,
                code,
                address,
                due_date,
                latest_snapshot
            ) VALUES (
                ${snapshot.nomeCliente},
                ${snapshot.codigoCliente || null},
                ${snapshot.enderecoUnidade || null},
                ${dueDate},
                ${JSON.stringify(snapshot)}::jsonb
            )
            RETURNING id
        `;
        clientRow = inserted[0];
    }

    await sql`
        INSERT INTO reports (client_id, snapshot)
        VALUES (${clientRow.id}, ${JSON.stringify(snapshot)}::jsonb)
    `;

    const rows = await listClients(snapshot.nomeCliente);
    return rows.find((row) => row.id === clientRow.id);
}

export default async function handler(req, res) {
    if (!hasDatabase || !sql) {
        return send(res, 503, {
            error: "DATABASE_NOT_CONFIGURED",
            message: "Configure DATABASE_URL para usar sincronizacao real."
        });
    }

    try {
        if (req.method === "GET") {
            const rows = await listClients(req.query.q ?? "");
            return send(res, 200, { clients: rows.map(mapClient) });
        }

        if (req.method === "POST") {
            const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
            const snapshot = body?.snapshot;
            if (!snapshot?.nomeCliente) {
                return send(res, 400, { error: "INVALID_PAYLOAD" });
            }

            const row = await saveClient(body?.clientId ?? null, snapshot);
            return send(res, 200, { client: mapClient(row) });
        }

        return send(res, 405, { error: "METHOD_NOT_ALLOWED" });
    } catch (error) {
        return send(res, 500, {
            error: "INTERNAL_ERROR",
            message: error instanceof Error ? error.message : "Erro desconhecido"
        });
    }
}
