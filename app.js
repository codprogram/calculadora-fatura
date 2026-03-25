const initialUnits = [
    { id: crypto.randomUUID(), nome: "", media: "" }
];
const STORAGE_KEY = "sunprime-clientes-v1";
const state = {
    abaAtual: "calculadora",
    buscaCliente: "",
    clienteSelecionadoId: null,
    clientesSalvos: [],
    modoPersistencia: "local",
    geracaoTotal: "",
    valorKWh: "1,17",
    consumoReal: "",
    valorOriginalFatura: "",
    valorComServicos: "",
    valorConcessionariaComCreditos: "",
    tarifaSunprime: "0,68891",
    nomeCliente: "",
    codigoCliente: "",
    enderecoUnidade: "",
    vencimentoFatura: "",
    unidades: initialUnits
};
const VALOR_KWH_SEM_CREDITOS = 1.36;

const elements = {
    geracaoTotal: document.querySelector("#geracaoTotal"),
    valorKWh: document.querySelector("#valorKWh"),
    consumoReal: document.querySelector("#consumoReal"),
    valorOriginalFatura: document.querySelector("#valorOriginalFatura"),
    valorComServicos: document.querySelector("#valorComServicos"),
    commercialConsumoReal: document.querySelector("#commercialConsumoReal"),
    commercialValorOriginalFatura: document.querySelector("#commercialValorOriginalFatura"),
    valorConcessionariaComCreditos: document.querySelector("#commercialValorConcessionariaComCreditos"),
    tarifaSunprime: document.querySelector("#commercialTarifaSunprime"),
    buscaCliente: document.querySelector("#buscaCliente"),
    salvarCliente: document.querySelector("#salvarCliente"),
    novoCliente: document.querySelector("#novoCliente"),
    listaClientes: document.querySelector("#listaClientes"),
    modoPersistencia: document.querySelector("#modoPersistencia"),
    nomeCliente: document.querySelector("#nomeCliente"),
    codigoCliente: document.querySelector("#codigoCliente"),
    enderecoUnidade: document.querySelector("#enderecoUnidade"),
    vencimentoFatura: document.querySelector("#vencimentoFatura"),
    adicionarUnidade: document.querySelector("#adicionarUnidade"),
    totalUnidades: document.querySelector("#totalUnidades"),
    totalDistribuido: document.querySelector("#totalDistribuido"),
    energiaFaltante: document.querySelector("#energiaFaltante"),
    percentualDistribuido: document.querySelector("#percentualDistribuido"),
    percentualFaltante: document.querySelector("#percentualFaltante"),
    commercialStatus: document.querySelector("#commercialStatus"),
    commercialSemCreditos: document.querySelector("#commercialSemCreditos"),
    commercialConcessionaria: document.querySelector("#commercialConcessionaria"),
    commercialSunprime: document.querySelector("#commercialSunprime"),
    commercialEconomia: document.querySelector("#commercialEconomia"),
    commercialTarifaSemCreditos: document.querySelector("#commercialTarifaSemCreditos"),
    commercialTarifaSunprime: document.querySelector("#commercialTarifaSunprime"),
    feedbackPanel: document.querySelector(".feedback-panel"),
    feedbackStatus: document.querySelector("#feedbackStatus"),
    feedbackDetalhes: document.querySelector("#feedbackDetalhes"),
    gerarPdf: document.querySelector("#gerarPdf"),
    tabButtons: [...document.querySelectorAll("[data-tab-button]")],
    tabSections: [...document.querySelectorAll("[data-tab-section]")],
    tabControls: [...document.querySelectorAll("[data-tab-control]")],
    reportCliente: document.querySelector("#reportCliente"),
    reportCodigo: document.querySelector("#reportCodigo"),
    reportEndereco: document.querySelector("#reportEndereco"),
    reportEmissao: document.querySelector("#reportEmissao"),
    reportVencimento: document.querySelector("#reportVencimento"),
    reportConsumo: document.querySelector("#reportConsumo"),
    reportSemCreditos: document.querySelector("#reportSemCreditos"),
    reportComCreditos: document.querySelector("#reportComCreditos"),
    reportEconomia: document.querySelector("#reportEconomia"),
    reportLinhaSemCreditos: document.querySelector("#reportLinhaSemCreditos"),
    reportLinhaComCreditos: document.querySelector("#reportLinhaComCreditos"),
    reportLinhaEconomia: document.querySelector("#reportLinhaEconomia"),
    reportPagamentoEmpresa: document.querySelector("#reportPagamentoEmpresa"),
    reportIndicadores: document.querySelector("#reportIndicadores"),
    reportHistorico: document.querySelector("#reportHistorico"),
    relatorioConsumo: document.querySelector("#relatorioConsumo"),
    relatorioSemServicos: document.querySelector("#relatorioSemServicos"),
    relatorioComServicos: document.querySelector("#relatorioComServicos"),
    relatorioEconomia: document.querySelector("#relatorioEconomia"),
    listaUnidades: document.querySelector("#listaUnidades"),
    unidadeTemplate: document.querySelector("#unidadeTemplate")
};

let activeField = null;

function parseNumero(texto) {
    if (!texto) return 0;
    const bruto = String(texto).trim().replace(/\s/g, "");
    const normalizado = bruto.includes(",")
        ? bruto.replace(/\./g, "").replace(",", ".")
        : bruto;
    const valor = Number(normalizado);
    return Number.isFinite(valor) ? valor : 0;
}

function formatarNumero(valor) {
    return new Intl.NumberFormat("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(valor);
}

function formatarPercentual(valor) {
    return `${formatarNumero(valor * 100)}%`;
}

function formatarMoeda(valor) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(valor);
}

function uid() {
    return crypto.randomUUID();
}

async function apiRequest(path, options = {}) {
    const response = await fetch(path, {
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        },
        ...options
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        const error = new Error(data.message || "Falha na API");
        error.status = response.status;
        throw error;
    }

    return data;
}

function carregarClientesSalvos() {
    try {
        const bruto = localStorage.getItem(STORAGE_KEY);
        state.clientesSalvos = bruto ? JSON.parse(bruto) : [];
    } catch {
        state.clientesSalvos = [];
    }
}

function persistirClientesSalvos() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.clientesSalvos));
}

async function sincronizarClientesRemotos() {
    const query = state.buscaCliente.trim();
    const suffix = query ? `?q=${encodeURIComponent(query)}` : "";
    const data = await apiRequest(`/api/clients${suffix}`);
    state.clientesSalvos = data.clients || [];
    state.modoPersistencia = "remote";
}

function unidadesCalculadas() {
    return state.unidades.map((unidade) => ({
        id: unidade.id,
        nome: unidade.nome.trim() || "Sem nome",
        media: parseNumero(unidade.media)
    }));
}

function valorKWhAtual() {
    const valor = parseNumero(state.valorKWh);
    return valor > 0 ? valor : 1.17;
}

function tarifaSunprimeAtual() {
    const valor = parseNumero(state.tarifaSunprime);
    return valor > 0 ? valor : 0.68891;
}

function resumoRelatorioMensal() {
    const consumoReal = parseNumero(state.consumoReal);
    const valorOriginal = parseNumero(state.valorOriginalFatura);
    const valorComServicos = parseNumero(state.valorComServicos);
    const economia = Math.max(valorOriginal - valorComServicos, 0);
    const tarifaOriginal = consumoReal > 0 ? valorOriginal / consumoReal : 0;
    const tarifaFinal = consumoReal > 0 ? valorComServicos / consumoReal : 0;

    return {
        consumoReal,
        valorOriginal,
        valorComServicos,
        economia,
        tarifaOriginal,
        tarifaFinal
    };
}

function clientesFiltrados() {
    const termo = state.buscaCliente.trim().toLowerCase();
    if (!termo) return state.clientesSalvos;

    return state.clientesSalvos.filter((cliente) => {
        const nome = (cliente.nomeCliente || "").toLowerCase();
        const codigo = (cliente.codigoCliente || "").toLowerCase();
        return nome.includes(termo) || codigo.includes(termo);
    });
}

function calcularPercentuais(unidades) {
    const somaMedias = unidades.reduce((acc, unidade) => acc + unidade.media, 0);
    return unidades.map((unidade) => (somaMedias > 0 ? unidade.media / somaMedias : 0));
}

function calcularPercentuaisSobreGeracaoTotal(unidades, geracaoTotal) {
    return unidades.map((unidade) => (geracaoTotal > 0 ? unidade.media / geracaoTotal : 0));
}

function distribuirEnergia(unidades, geracaoTotal) {
    const percentuais = calcularPercentuais(unidades);
    const percentuaisSobreGeracaoTotal = calcularPercentuaisSobreGeracaoTotal(unidades, geracaoTotal);
    const valorKWh = valorKWhAtual();

    return unidades.map((unidade, index) => ({
        id: unidade.id,
        nome: unidade.nome,
        media: unidade.media,
        percentual: percentuais[index],
        percentualGeracaoTotal: percentuaisSobreGeracaoTotal[index],
        energia: percentuais[index] * geracaoTotal,
        valorComCreditos: percentuais[index] * geracaoTotal * valorKWh,
        valorSemCreditos: percentuais[index] * geracaoTotal * VALOR_KWH_SEM_CREDITOS,
        economia: (percentuais[index] * geracaoTotal * VALOR_KWH_SEM_CREDITOS) - (percentuais[index] * geracaoTotal * valorKWh)
    }));
}

function renderResumo(distribuicao) {
    const somaMedias = distribuicao.reduce((acc, item) => acc + item.media, 0);
    const totalDistribuido = somaMedias;
    const geracaoTotal = parseNumero(state.geracaoTotal);
    const energiaFaltante = Math.max(geracaoTotal - totalDistribuido, 0);
    const percentualDistribuido = geracaoTotal > 0 ? totalDistribuido / geracaoTotal : 0;
    const percentualFaltante = Math.max(1 - percentualDistribuido, 0);

    elements.totalUnidades.textContent = String(distribuicao.length);
    elements.totalDistribuido.textContent = formatarNumero(totalDistribuido);
    elements.energiaFaltante.textContent = formatarNumero(energiaFaltante);
    elements.percentualDistribuido.textContent = formatarPercentual(percentualDistribuido);
    elements.percentualFaltante.textContent = formatarPercentual(percentualFaltante);
}

function renderLista(distribuicao) {
    elements.listaUnidades.innerHTML = "";

    distribuicao.forEach((item) => {
        const original = state.unidades.find((unidade) => unidade.id === item.id);
        const fragment = elements.unidadeTemplate.content.cloneNode(true);

        const nomeInput = fragment.querySelector('[data-role="nome"]');
        const mediaInput = fragment.querySelector('[data-role="media"]');
        const removerButton = fragment.querySelector('[data-role="remover"]');

        nomeInput.value = original.nome;
        mediaInput.value = original.media;

        fragment.querySelector('[data-role="metric-media"]').textContent = `${formatarNumero(item.media)} kWh`;
        fragment.querySelector('[data-role="metric-percentual"]').textContent = formatarPercentual(item.percentualGeracaoTotal);
        fragment.querySelector('[data-role="metric-com-creditos"]').textContent = formatarMoeda(item.valorComCreditos);
        fragment.querySelector('[data-role="metric-sem-creditos"]').textContent = formatarMoeda(item.valorSemCreditos);
        fragment.querySelector('[data-role="metric-economia"]').textContent = formatarMoeda(item.economia);

        nomeInput.addEventListener("input", (event) => {
            original.nome = event.target.value;
            activeField = {
                id: item.id,
                role: "nome",
                start: event.target.selectionStart,
                end: event.target.selectionEnd
            };
            render();
        });

        mediaInput.addEventListener("input", (event) => {
            original.media = event.target.value;
            activeField = {
                id: item.id,
                role: "media",
                start: event.target.selectionStart,
                end: event.target.selectionEnd
            };
            render();
        });

        removerButton.addEventListener("click", () => {
            if (state.unidades.length <= 1) return;
            state.unidades = state.unidades.filter((unidade) => unidade.id !== item.id);
            render();
        });

        elements.listaUnidades.appendChild(fragment);
    });

    restoreActiveField();
}

function snapshotAtual(distribuicao) {
    const relatorioMensal = resumoRelatorioMensal();
    return {
        nomeCliente: state.nomeCliente.trim(),
        codigoCliente: state.codigoCliente.trim(),
        enderecoUnidade: state.enderecoUnidade.trim(),
        vencimentoFatura: state.vencimentoFatura,
        geracaoTotal: state.geracaoTotal,
        valorKWh: state.valorKWh,
        consumoReal: state.consumoReal,
        valorOriginalFatura: state.valorOriginalFatura,
        valorComServicos: state.valorComServicos,
        valorConcessionariaComCreditos: state.valorConcessionariaComCreditos,
        tarifaSunprime: state.tarifaSunprime,
        unidades: state.unidades.map((unidade) => ({ ...unidade })),
        resumo: {
            consumoReal: relatorioMensal.consumoReal,
            valorComServicos: relatorioMensal.valorComServicos,
            valorOriginal: relatorioMensal.valorOriginal,
            economia: relatorioMensal.economia
        }
    };
}

function preencherCliente(cliente) {
    const snapshot = cliente.ultimoSnapshot;
    state.clienteSelecionadoId = cliente.id;
    state.nomeCliente = snapshot.nomeCliente || "";
    state.codigoCliente = snapshot.codigoCliente || "";
    state.enderecoUnidade = snapshot.enderecoUnidade || "";
    state.vencimentoFatura = snapshot.vencimentoFatura || "";
    state.geracaoTotal = snapshot.geracaoTotal || "";
    state.valorKWh = snapshot.valorKWh || "1,17";
    state.consumoReal = snapshot.consumoReal || "";
    state.valorOriginalFatura = snapshot.valorOriginalFatura || "";
    state.valorComServicos = snapshot.valorComServicos || "";
    state.valorConcessionariaComCreditos = snapshot.valorConcessionariaComCreditos || "";
    state.tarifaSunprime = snapshot.tarifaSunprime || "0,68891";
    state.unidades = snapshot.unidades?.length ? snapshot.unidades.map((unidade) => ({ ...unidade })) : [{ id: uid(), nome: "", media: "" }];
    render();
}

function salvarClienteAtual() {
    const distribuicao = distribuirEnergia(unidadesCalculadas(), parseNumero(state.geracaoTotal));
    const snapshot = snapshotAtual(distribuicao);

    if (!snapshot.nomeCliente) {
        alert("Informe o nome do cliente antes de salvar.");
        return;
    }

    const historicoItem = {
        id: uid(),
        createdAt: new Date().toISOString(),
        snapshot
    };

    const index = state.clientesSalvos.findIndex((cliente) => cliente.id === state.clienteSelecionadoId);
    if (index >= 0) {
        const atual = state.clientesSalvos[index];
        state.clientesSalvos[index] = {
            ...atual,
            nomeCliente: snapshot.nomeCliente,
            codigoCliente: snapshot.codigoCliente,
            ultimoSnapshot: snapshot,
            updatedAt: historicoItem.createdAt,
            historico: [...(atual.historico || []), historicoItem]
        };
    } else {
        const novo = {
            id: uid(),
            nomeCliente: snapshot.nomeCliente,
            codigoCliente: snapshot.codigoCliente,
            createdAt: historicoItem.createdAt,
            updatedAt: historicoItem.createdAt,
            ultimoSnapshot: snapshot,
            historico: [historicoItem]
        };
        state.clientesSalvos.unshift(novo);
        state.clienteSelecionadoId = novo.id;
    }

    persistirClientesSalvos();
    render();
}

async function salvarClienteAtualRemoto() {
    const distribuicao = distribuirEnergia(unidadesCalculadas(), parseNumero(state.geracaoTotal));
    const snapshot = snapshotAtual(distribuicao);

    if (!snapshot.nomeCliente) {
        alert("Informe o nome do cliente antes de salvar.");
        return;
    }

    const data = await apiRequest("/api/clients", {
        method: "POST",
        body: JSON.stringify({
            clientId: state.clienteSelecionadoId,
            snapshot
        })
    });

    state.clienteSelecionadoId = data.client.id;
    await sincronizarClientesRemotos();
    render();
}

function novoCliente() {
    state.clienteSelecionadoId = null;
    state.buscaCliente = "";
    state.nomeCliente = "";
    state.codigoCliente = "";
    state.enderecoUnidade = "";
    state.vencimentoFatura = "";
    state.geracaoTotal = "";
    state.valorKWh = "1,17";
    state.consumoReal = "";
    state.valorOriginalFatura = "";
    state.valorComServicos = "";
    state.valorConcessionariaComCreditos = "";
    state.tarifaSunprime = "0,68891";
    state.unidades = [{ id: uid(), nome: "", media: "" }];
    render();
}

function renderClientesSalvos() {
    if (!elements.listaClientes || !elements.buscaCliente) return;
    elements.buscaCliente.value = state.buscaCliente;
    if (elements.modoPersistencia) {
        elements.modoPersistencia.textContent = state.modoPersistencia === "remote" ? "Modo banco sincronizado" : "Modo local";
    }
    elements.listaClientes.innerHTML = "";

    const lista = clientesFiltrados().slice(0, 8);
    if (!lista.length) {
        elements.listaClientes.innerHTML = '<div class="empty-state">Nenhum cliente salvo encontrado.</div>';
        return;
    }

    lista.forEach((cliente) => {
        const item = document.createElement("div");
        item.className = "saved-client-item";
        item.innerHTML = `
            <div class="saved-client-meta">
                <strong>${cliente.nomeCliente}</strong>
                <span>Codigo: ${cliente.codigoCliente || "-"} | Relatorios: ${(cliente.historico || []).length} | ${state.modoPersistencia === "remote" ? "Banco real" : "Local"}</span>
            </div>
            <button type="button">Selecionar</button>
        `;
        item.querySelector("button").addEventListener("click", () => preencherCliente(cliente));
        elements.listaClientes.appendChild(item);
    });
}

function renderFeedback(distribuicao) {
    const unidadesValidas = state.unidades.filter((unidade) => unidade.nome.trim() && parseNumero(unidade.media) > 0).length;
    const geracaoTotal = parseNumero(state.geracaoTotal);
    const distribuido = distribuicao.reduce((acc, item) => acc + item.media, 0);
    const faltante = Math.max(geracaoTotal - distribuido, 0);
    const percentualDistribuido = geracaoTotal > 0 ? distribuido / geracaoTotal : 0;
    const percentualFaltante = Math.max(1 - percentualDistribuido, 0);

    let status = "Informe a geracao total para validar a distribuicao.";
    let mode = "is-warning";

    if (geracaoTotal > 0 && unidadesValidas === 0) {
        status = "Cadastre ao menos uma unidade com nome e media para iniciar o rateio.";
    } else if (geracaoTotal > 0 && faltante === 0) {
        status = "Distribuicao concluida. Toda a geracao informada ja foi coberta pelas medias cadastradas.";
        mode = "is-success";
    } else if (geracaoTotal > 0) {
        status = `Distribuicao em andamento. Ainda faltam ${formatarNumero(faltante)} kWh para atingir 100% da geracao.`;
        mode = "is-progress";
    }

    elements.feedbackPanel.classList.remove("is-warning", "is-progress", "is-success");
    elements.feedbackPanel.classList.add(mode);
    elements.feedbackStatus.textContent = status;
    elements.feedbackDetalhes.textContent = `Unidades validas: ${unidadesValidas} de ${state.unidades.length} | Distribuido: ${formatarPercentual(percentualDistribuido)} | Faltante: ${formatarPercentual(percentualFaltante)}`;
}

function formatarData(dataIso) {
    if (!dataIso) return "-";
    const data = new Date(`${dataIso}T12:00:00`);
    if (Number.isNaN(data.getTime())) return "-";
    return new Intl.DateTimeFormat("pt-BR").format(data);
}

function renderReport(distribuicao) {
    const hoje = new Intl.DateTimeFormat("pt-BR").format(new Date());
    const relatorioMensal = resumoRelatorioMensal();

    elements.reportCliente.textContent = state.nomeCliente.trim() || "Cliente nao informado";
    elements.reportCodigo.textContent = `Codigo do cliente: ${state.codigoCliente.trim() || "-"}`;
    elements.reportEndereco.textContent = `Endereco da unidade consumidora: ${state.enderecoUnidade.trim() || "-"}`;
    elements.reportEmissao.textContent = hoje;
    elements.reportVencimento.textContent = formatarData(state.vencimentoFatura);
    elements.reportConsumo.textContent = `${formatarNumero(relatorioMensal.consumoReal)} kWh`;
    elements.reportSemCreditos.textContent = formatarMoeda(relatorioMensal.valorOriginal);
    elements.reportComCreditos.textContent = formatarMoeda(relatorioMensal.valorComServicos);
    elements.reportEconomia.textContent = formatarMoeda(relatorioMensal.economia);
    elements.reportLinhaSemCreditos.textContent = formatarMoeda(relatorioMensal.valorOriginal);
    elements.reportLinhaComCreditos.textContent = formatarMoeda(relatorioMensal.valorComServicos);
    elements.reportLinhaEconomia.textContent = formatarMoeda(relatorioMensal.economia);
    elements.reportPagamentoEmpresa.textContent = formatarMoeda(relatorioMensal.valorComServicos);
    elements.reportIndicadores.innerHTML = "";
    elements.reportHistorico.innerHTML = "";

    const indicadores = [
        ["Consumo real", `${formatarNumero(relatorioMensal.consumoReal)} kWh`],
        ["Tarifa original", `${formatarMoeda(relatorioMensal.tarifaOriginal)}/kWh`],
        ["Tarifa final", `${formatarMoeda(relatorioMensal.tarifaFinal)}/kWh`]
    ];

    indicadores.forEach(([titulo, valor], index) => {
        const row = document.createElement("div");
        row.className = "report-ranking-row";
        row.innerHTML = `
            <div class="report-ranking-pos">${index + 1}</div>
            <div class="report-ranking-meta">
                <strong>${titulo}</strong>
                <span>Indicador automatico do periodo salvo</span>
            </div>
            <div class="report-ranking-value">${valor}</div>
        `;
        elements.reportIndicadores.appendChild(row);
    });

    const clienteAtual = state.clientesSalvos.find((cliente) => cliente.id === state.clienteSelecionadoId);
    if (!clienteAtual || !(clienteAtual.historico || []).length) {
        elements.reportHistorico.innerHTML = '<div class="empty-state">Nenhum relatorio salvo para este cliente.</div>';
        return;
    }

    [...clienteAtual.historico]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 6)
        .forEach((item, index) => {
            const row = document.createElement("div");
            row.className = "report-ranking-row";
            row.innerHTML = `
                <div class="report-ranking-pos">${index + 1}</div>
                <div class="report-ranking-meta">
                    <strong>${new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(item.createdAt))}</strong>
                    <span>Com servicos: ${formatarMoeda(item.snapshot.resumo.valorComServicos || 0)} | Sem servicos: ${formatarMoeda(item.snapshot.resumo.valorOriginal || 0)}</span>
                </div>
                <div class="report-ranking-value">${formatarMoeda(item.snapshot.resumo.economia)}</div>
            `;
            elements.reportHistorico.appendChild(row);
        });
}

function renderTabs() {
    elements.tabButtons.forEach((button) => {
        button.classList.toggle("is-active", button.dataset.tabButton === state.abaAtual);
    });

    elements.tabSections.forEach((section) => {
        section.hidden = section.dataset.tabSection !== state.abaAtual;
    });

    elements.tabControls.forEach((control) => {
        control.hidden = control.dataset.tabControl !== state.abaAtual;
    });
}

function renderRelatorioMensal() {
    const relatorioMensal = resumoRelatorioMensal();

    if (elements.consumoReal) elements.consumoReal.value = state.consumoReal;
    if (elements.valorOriginalFatura) elements.valorOriginalFatura.value = state.valorOriginalFatura;
    if (elements.valorComServicos) elements.valorComServicos.value = state.valorComServicos;

    elements.relatorioConsumo.textContent = `${formatarNumero(relatorioMensal.consumoReal)} kWh`;
    elements.relatorioSemServicos.textContent = formatarMoeda(relatorioMensal.valorOriginal);
    elements.relatorioComServicos.textContent = formatarMoeda(relatorioMensal.valorComServicos);
    elements.relatorioEconomia.textContent = formatarMoeda(relatorioMensal.economia);
}

function renderCommercial() {
    if (!elements.commercialConsumoReal) return;

    const consumoReal = parseNumero(state.consumoReal);
    const valorOriginal = parseNumero(state.valorOriginalFatura);
    const valorConcessionaria = parseNumero(state.valorConcessionariaComCreditos);
    const tarifaSunprime = tarifaSunprimeAtual();
    const valorSunprime = consumoReal * tarifaSunprime;
    const economia = Math.max(valorOriginal - (valorConcessionaria + valorSunprime), 0);
    const tarifaSemCreditos = consumoReal > 0 ? valorOriginal / consumoReal : 0;

    elements.commercialConsumoReal.value = state.consumoReal;
    elements.commercialValorOriginalFatura.value = state.valorOriginalFatura;
    elements.valorConcessionariaComCreditos.value = state.valorConcessionariaComCreditos;
    elements.tarifaSunprime.value = state.tarifaSunprime;
    elements.commercialSemCreditos.textContent = formatarMoeda(valorOriginal);
    elements.commercialConcessionaria.textContent = formatarMoeda(valorConcessionaria);
    elements.commercialSunprime.textContent = formatarMoeda(valorSunprime);
    elements.commercialEconomia.textContent = formatarMoeda(economia);
    elements.commercialTarifaSemCreditos.textContent = `${formatarMoeda(tarifaSemCreditos)}/kWh`;
    elements.commercialTarifaSunprime.textContent = `${formatarMoeda(tarifaSunprime)}/kWh`;

    if (consumoReal <= 0 || valorOriginal <= 0) {
        elements.commercialStatus.textContent = "Informe consumo real e valor original da fatura para montar o relatorio comercial.";
    } else if (valorConcessionaria <= 0) {
        elements.commercialStatus.textContent = "Informe o valor residual da concessionaria com creditos para concluir o comparativo.";
    } else {
        elements.commercialStatus.textContent = "Relatorio comercial pronto. Os valores ja refletem o cenario sem creditos, o residual na concessionaria e o valor devido a Sunprime.";
    }
}

function render() {
    const geracaoTotal = parseNumero(state.geracaoTotal);
    const unidades = unidadesCalculadas();
    const distribuicao = distribuirEnergia(unidades, geracaoTotal);

    elements.geracaoTotal.value = state.geracaoTotal;
    elements.valorKWh.value = state.valorKWh;
    if (elements.buscaCliente) elements.buscaCliente.value = state.buscaCliente;
    elements.nomeCliente.value = state.nomeCliente;
    elements.codigoCliente.value = state.codigoCliente;
    elements.enderecoUnidade.value = state.enderecoUnidade;
    elements.vencimentoFatura.value = state.vencimentoFatura;

    renderResumo(distribuicao);
    renderClientesSalvos();
    renderLista(distribuicao);
    renderFeedback(distribuicao);
    renderRelatorioMensal();
    renderReport(distribuicao);
    renderCommercial();
    renderTabs();
}

function restoreActiveField() {
    if (!activeField) return;

    if (activeField.id === "geracao-total") {
        elements.geracaoTotal.focus();
        if (typeof activeField.start === "number" && typeof activeField.end === "number") {
            elements.geracaoTotal.setSelectionRange(activeField.start, activeField.end);
        }
        return;
    }

    if (activeField.id === "valor-kwh") {
        elements.valorKWh.focus();
        if (typeof activeField.start === "number" && typeof activeField.end === "number") {
            elements.valorKWh.setSelectionRange(activeField.start, activeField.end);
        }
        return;
    }

    const unitCards = [...elements.listaUnidades.children];
    const index = state.unidades.findIndex((unidade) => unidade.id === activeField.id);
    if (index === -1) {
        activeField = null;
        return;
    }

    const target = unitCards[index]?.querySelector(`[data-role="${activeField.role}"]`);
    if (!target) {
        activeField = null;
        return;
    }

    target.focus();

    if (typeof activeField.start === "number" && typeof activeField.end === "number") {
        target.setSelectionRange(activeField.start, activeField.end);
    }
}

elements.geracaoTotal.addEventListener("input", (event) => {
    state.geracaoTotal = event.target.value;
    activeField = {
        id: "geracao-total",
        role: "geracaoTotal",
        start: event.target.selectionStart,
        end: event.target.selectionEnd
    };
    render();
});

elements.valorKWh.addEventListener("input", (event) => {
    state.valorKWh = event.target.value;
    activeField = {
        id: "valor-kwh",
        role: "valorKWh",
        start: event.target.selectionStart,
        end: event.target.selectionEnd
    };
    render();
});

if (elements.commercialConsumoReal) {
    elements.commercialConsumoReal.addEventListener("input", (event) => {
        state.consumoReal = event.target.value;
        render();
    });
}

if (elements.consumoReal) {
    elements.consumoReal.addEventListener("input", (event) => {
        state.consumoReal = event.target.value;
        render();
    });
}

if (elements.commercialValorOriginalFatura) {
    elements.commercialValorOriginalFatura.addEventListener("input", (event) => {
        state.valorOriginalFatura = event.target.value;
        render();
    });
}

if (elements.valorOriginalFatura) {
    elements.valorOriginalFatura.addEventListener("input", (event) => {
        state.valorOriginalFatura = event.target.value;
        render();
    });
}

if (elements.valorComServicos) {
    elements.valorComServicos.addEventListener("input", (event) => {
        state.valorComServicos = event.target.value;
        render();
    });
}

if (elements.valorConcessionariaComCreditos) {
    elements.valorConcessionariaComCreditos.addEventListener("input", (event) => {
        state.valorConcessionariaComCreditos = event.target.value;
        render();
    });
}

if (elements.tarifaSunprime) {
    elements.tarifaSunprime.addEventListener("input", (event) => {
        state.tarifaSunprime = event.target.value;
        render();
    });
}

elements.nomeCliente.addEventListener("input", (event) => {
    state.nomeCliente = event.target.value;
    render();
});

elements.codigoCliente.addEventListener("input", (event) => {
    state.codigoCliente = event.target.value;
    render();
});

elements.enderecoUnidade.addEventListener("input", (event) => {
    state.enderecoUnidade = event.target.value;
    render();
});

elements.vencimentoFatura.addEventListener("input", (event) => {
    state.vencimentoFatura = event.target.value;
    render();
});

if (elements.buscaCliente) {
    elements.buscaCliente.addEventListener("input", (event) => {
        state.buscaCliente = event.target.value;
        if (state.modoPersistencia === "remote") {
            sincronizarClientesRemotos()
                .then(() => render())
                .catch(() => {
                    state.modoPersistencia = "local";
                    carregarClientesSalvos();
                    render();
                });
            return;
        }

        renderClientesSalvos();
    });
}

if (elements.salvarCliente) {
    elements.salvarCliente.addEventListener("click", () => {
        if (state.modoPersistencia === "remote") {
            salvarClienteAtualRemoto().catch(() => {
                state.modoPersistencia = "local";
                salvarClienteAtual();
            });
            return;
        }

        salvarClienteAtual();
    });
}

if (elements.novoCliente) {
    elements.novoCliente.addEventListener("click", () => {
        novoCliente();
    });
}

elements.gerarPdf.addEventListener("click", () => {
    window.print();
});

elements.tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
        state.abaAtual = button.dataset.tabButton;
        render();
    });
});

elements.adicionarUnidade.addEventListener("click", () => {
    state.unidades.push({
        id: uid(),
        nome: "",
        media: ""
    });
    render();
});

async function inicializarPersistencia() {
    carregarClientesSalvos();
    render();

    try {
        await sincronizarClientesRemotos();
        render();
    } catch {
        state.modoPersistencia = "local";
        render();
    }
}

inicializarPersistencia();
