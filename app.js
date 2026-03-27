const initialUnits = [
    { id: crypto.randomUUID(), nome: "", media: "" }
];
const STORAGE_KEY = "sunprime-clientes-v1";
const TARIFA_RELATORIO_SEM_SUNPRIME = 1.359;
const TARIFA_RELATORIO_COM_SUNPRIME = 0.689;
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
    performanceCliente: "",
    performancePeriodo: "",
    performanceResumo: "",
    performanceEnergiaConsumida: "",
    performanceEnergiaGerada: "",
    performanceEnergiaCompensada: "",
    performanceCreditoAcumulado: "",
    performanceGerJan: "",
    performanceGerFev: "",
    performanceGerMar: "",
    performanceConsJan: "",
    performanceConsFev: "",
    performanceConsMar: "",
    performanceAnalise: "",
    performanceDirecionamento: "",
    performanceConclusao: "",
    spCliente: "",
    spPeriodo: "",
    spEnergiaGerada: "",
    spEnergiaConsumida: "",
    spEnergiaCompensada: "",
    spCreditoAcumulado: "",
    spAnalise: "",
    spLeitura: "",
    spCreditos: "",
    spDirecionamento: "",
    spConclusao: "",
    spTextoCompleto: "",
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
    performanceCliente: document.querySelector("#performanceCliente"),
    performancePeriodo: document.querySelector("#performancePeriodo"),
    performanceResumo: document.querySelector("#performanceResumo"),
    performanceEnergiaConsumida: document.querySelector("#performanceEnergiaConsumida"),
    performanceEnergiaGerada: document.querySelector("#performanceEnergiaGerada"),
    performanceEnergiaCompensada: document.querySelector("#performanceEnergiaCompensada"),
    performanceCreditoAcumulado: document.querySelector("#performanceCreditoAcumulado"),
    performanceGerJan: document.querySelector("#performanceGerJan"),
    performanceGerFev: document.querySelector("#performanceGerFev"),
    performanceGerMar: document.querySelector("#performanceGerMar"),
    performanceConsJan: document.querySelector("#performanceConsJan"),
    performanceConsFev: document.querySelector("#performanceConsFev"),
    performanceConsMar: document.querySelector("#performanceConsMar"),
    performanceAnalise: document.querySelector("#performanceAnalise"),
    performanceDirecionamento: document.querySelector("#performanceDirecionamento"),
    performanceConclusao: document.querySelector("#performanceConclusao"),
    spCliente: document.querySelector("#spCliente"),
    spPeriodo: document.querySelector("#spPeriodo"),
    spEnergiaGerada: document.querySelector("#spEnergiaGerada"),
    spEnergiaConsumida: document.querySelector("#spEnergiaConsumida"),
    spEnergiaCompensada: document.querySelector("#spEnergiaCompensada"),
    spCreditoAcumulado: document.querySelector("#spCreditoAcumulado"),
    spGerarAnalise: document.querySelector("#spGerarAnalise"),
    spCopiarTexto: document.querySelector("#spCopiarTexto"),
    spEnviarPerformance: document.querySelector("#spEnviarPerformance"),
    spCardGerada: document.querySelector("#spCardGerada"),
    spCardConsumida: document.querySelector("#spCardConsumida"),
    spCardCompensada: document.querySelector("#spCardCompensada"),
    spCardCredito: document.querySelector("#spCardCredito"),
    spAnalise: document.querySelector("#spAnalise"),
    spLeitura: document.querySelector("#spLeitura"),
    spCreditos: document.querySelector("#spCreditos"),
    spDirecionamento: document.querySelector("#spDirecionamento"),
    spConclusao: document.querySelector("#spConclusao"),
    spTextoCompleto: document.querySelector("#spTextoCompleto"),
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
    reportAnalisePrincipal: document.querySelector("#reportAnalisePrincipal"),
    reportInsightConsumo: document.querySelector("#reportInsightConsumo"),
    reportInsightTarifaOriginal: document.querySelector("#reportInsightTarifaOriginal"),
    reportInsightTarifaFinal: document.querySelector("#reportInsightTarifaFinal"),
    reportInsightEconomia: document.querySelector("#reportInsightEconomia"),
    reportPagamentoEmpresa: document.querySelector("#reportPagamentoEmpresa"),
    reportHistorico: document.querySelector("#reportHistorico"),
    relatorioConsumo: document.querySelector("#relatorioConsumo"),
    relatorioSemServicos: document.querySelector("#relatorioSemServicos"),
    relatorioComServicos: document.querySelector("#relatorioComServicos"),
    relatorioEconomia: document.querySelector("#relatorioEconomia"),
    performanceReportCliente: document.querySelector("#performanceReportCliente"),
    performanceReportPeriodo: document.querySelector("#performanceReportPeriodo"),
    performanceReportResumo: document.querySelector("#performanceReportResumo"),
    performanceReportEnergiaConsumida: document.querySelector("#performanceReportEnergiaConsumida"),
    performanceReportEnergiaGerada: document.querySelector("#performanceReportEnergiaGerada"),
    performanceReportEnergiaCompensada: document.querySelector("#performanceReportEnergiaCompensada"),
    performanceReportCreditoAcumulado: document.querySelector("#performanceReportCreditoAcumulado"),
    performanceChartResumo: document.querySelector("#performanceChartResumo"),
    performanceReportAnalise: document.querySelector("#performanceReportAnalise"),
    performanceReportDirecionamento: document.querySelector("#performanceReportDirecionamento"),
    performanceReportConclusao: document.querySelector("#performanceReportConclusao"),
    performanceChart: document.querySelector("#performanceChart"),
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

function valorOuPadrao(texto, padrao) {
    return String(texto || "").trim() || padrao;
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
    const valorOriginal = consumoReal * TARIFA_RELATORIO_SEM_SUNPRIME;
    const valorComServicos = consumoReal * TARIFA_RELATORIO_COM_SUNPRIME;
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
        valorOriginalFatura: `${relatorioMensal.valorOriginal}`,
        valorComServicos: `${relatorioMensal.valorComServicos}`,
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

function resumoDoSnapshot(snapshot) {
    const consumoReal = snapshot?.resumo?.consumoReal ?? parseNumero(snapshot?.consumoReal);
    const valorOriginal = snapshot?.resumo?.valorOriginal ?? (consumoReal * TARIFA_RELATORIO_SEM_SUNPRIME);
    const valorComServicos = snapshot?.resumo?.valorComServicos ?? (consumoReal * TARIFA_RELATORIO_COM_SUNPRIME);
    const economia = snapshot?.resumo?.economia ?? Math.max(valorOriginal - valorComServicos, 0);
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

function atualizarHistoricoPorVencimento(historico = [], historicoItem) {
    const vencimentoAtual = historicoItem.snapshot.vencimentoFatura || "";
    const indexExistente = historico.findIndex((item) => (item.snapshot?.vencimentoFatura || "") === vencimentoAtual);

    if (indexExistente === -1) {
        return [...historico, historicoItem];
    }

    return historico.map((item, index) => (
        index === indexExistente
            ? { ...item, createdAt: historicoItem.createdAt, snapshot: historicoItem.snapshot }
            : item
    ));
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

    if (!snapshot.vencimentoFatura) {
        alert("Informe o vencimento da fatura para incluir esse periodo no historico.");
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
            historico: atualizarHistoricoPorVencimento(atual.historico || [], historicoItem)
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

    if (!snapshot.vencimentoFatura) {
        alert("Informe o vencimento da fatura para incluir esse periodo no historico.");
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
    elements.reportAnalisePrincipal.textContent = `Neste periodo, o cliente teria um custo original de ${formatarMoeda(relatorioMensal.valorOriginal)} e passa a ter um fechamento de ${formatarMoeda(relatorioMensal.valorComServicos)} com os servicos da Sunprime, gerando economia estimada de ${formatarMoeda(relatorioMensal.economia)}.`;
    elements.reportInsightConsumo.textContent = `${formatarNumero(relatorioMensal.consumoReal)} kWh`;
    elements.reportInsightTarifaOriginal.textContent = `${formatarMoeda(relatorioMensal.tarifaOriginal)}/kWh`;
    elements.reportInsightTarifaFinal.textContent = `${formatarMoeda(relatorioMensal.tarifaFinal)}/kWh`;
    elements.reportInsightEconomia.textContent = formatarMoeda(relatorioMensal.economia);
    elements.reportPagamentoEmpresa.textContent = formatarMoeda(relatorioMensal.valorComServicos);
    elements.reportHistorico.innerHTML = "";

    const clienteAtual = state.clientesSalvos.find((cliente) => cliente.id === state.clienteSelecionadoId);
    if (!clienteAtual || !(clienteAtual.historico || []).length) {
        elements.reportHistorico.innerHTML = '<div class="empty-state">Nenhum relatorio salvo para este cliente.</div>';
        return;
    }

    [...clienteAtual.historico]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 6)
        .forEach((item, index) => {
            const resumo = resumoDoSnapshot(item.snapshot);
            const row = document.createElement("div");
            row.className = "report-ranking-row";
            row.innerHTML = `
                <div class="report-ranking-pos">${index + 1}</div>
                <div class="report-ranking-meta">
                    <strong>Vencimento ${formatarData(item.snapshot?.vencimentoFatura)}</strong>
                    <span>Salvo em ${new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(item.createdAt))}</span>
                    <span>Sem servicos: ${formatarMoeda(resumo.valorOriginal)} | Tarifa original: ${formatarMoeda(resumo.tarifaOriginal)}/kWh</span>
                    <span>Com servicos: ${formatarMoeda(resumo.valorComServicos)} | Tarifa final: ${formatarMoeda(resumo.tarifaFinal)}/kWh</span>
                </div>
                <div class="report-ranking-value">${formatarMoeda(resumo.valorComServicos)}</div>
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
    if (elements.valorOriginalFatura) elements.valorOriginalFatura.value = relatorioMensal.consumoReal > 0 ? formatarNumero(relatorioMensal.valorOriginal) : "";
    if (elements.valorComServicos) elements.valorComServicos.value = relatorioMensal.consumoReal > 0 ? formatarNumero(relatorioMensal.valorComServicos) : "";

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

function performanceBullets() {
    return String(state.performanceAnalise || "")
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);
}

function renderPerformanceChart() {
    const canvas = elements.performanceChart;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    context.clearRect(0, 0, width, height);

    const padding = { top: 18, right: 18, bottom: 34, left: 44 };
    const labels = ["JAN", "FEV", "MAR"];
    const geracao = [
        parseNumero(state.performanceGerJan),
        parseNumero(state.performanceGerFev),
        parseNumero(state.performanceGerMar)
    ];
    const consumo = [
        parseNumero(state.performanceConsJan),
        parseNumero(state.performanceConsFev),
        parseNumero(state.performanceConsMar)
    ];
    const maiorValor = Math.max(...geracao, ...consumo, 100);
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;

    context.strokeStyle = "rgba(80, 88, 98, 0.2)";
    context.lineWidth = 1;
    for (let i = 0; i <= 4; i += 1) {
        const y = padding.top + (plotHeight / 4) * i;
        context.beginPath();
        context.moveTo(padding.left, y);
        context.lineTo(width - padding.right, y);
        context.stroke();
    }

    context.strokeStyle = "#b8791e";
    context.lineWidth = 3;
    context.beginPath();
    geracao.forEach((valor, index) => {
        const x = padding.left + (plotWidth / (labels.length - 1 || 1)) * index;
        const y = padding.top + plotHeight - (valor / maiorValor) * plotHeight;
        if (index === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
    });
    context.stroke();

    context.strokeStyle = "#6b7280";
    context.beginPath();
    consumo.forEach((valor, index) => {
        const x = padding.left + (plotWidth / (labels.length - 1 || 1)) * index;
        const y = padding.top + plotHeight - (valor / maiorValor) * plotHeight;
        if (index === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
    });
    context.stroke();

    context.fillStyle = "#5b6773";
    context.font = "12px system-ui";
    labels.forEach((label, index) => {
        const x = padding.left + (plotWidth / (labels.length - 1 || 1)) * index;
        context.fillText(label, x - 12, height - 10);
    });
}

function renderPerformance() {
    if (!elements.performanceCliente) return;

    elements.performanceCliente.value = state.performanceCliente;
    elements.performancePeriodo.value = state.performancePeriodo;
    elements.performanceResumo.value = state.performanceResumo;
    elements.performanceEnergiaConsumida.value = state.performanceEnergiaConsumida;
    elements.performanceEnergiaGerada.value = state.performanceEnergiaGerada;
    elements.performanceEnergiaCompensada.value = state.performanceEnergiaCompensada;
    elements.performanceCreditoAcumulado.value = state.performanceCreditoAcumulado;
    elements.performanceGerJan.value = state.performanceGerJan;
    elements.performanceGerFev.value = state.performanceGerFev;
    elements.performanceGerMar.value = state.performanceGerMar;
    elements.performanceConsJan.value = state.performanceConsJan;
    elements.performanceConsFev.value = state.performanceConsFev;
    elements.performanceConsMar.value = state.performanceConsMar;
    elements.performanceAnalise.value = state.performanceAnalise;
    elements.performanceDirecionamento.value = state.performanceDirecionamento;
    elements.performanceConclusao.value = state.performanceConclusao;

    elements.performanceReportCliente.textContent = `Cliente: ${valorOuPadrao(state.performanceCliente, "Nao informado")}`;
    elements.performanceReportPeriodo.textContent = `Periodo: ${valorOuPadrao(state.performancePeriodo, "Nao informado")}`;
    elements.performanceReportResumo.textContent = valorOuPadrao(state.performanceResumo, "Preencha os dados para montar o resumo do periodo.");
    elements.performanceReportEnergiaConsumida.textContent = `${valorOuPadrao(state.performanceEnergiaConsumida, "0")} kWh`;
    elements.performanceReportEnergiaGerada.textContent = `${valorOuPadrao(state.performanceEnergiaGerada, "0")} kWh`;
    elements.performanceReportEnergiaCompensada.textContent = `${valorOuPadrao(state.performanceEnergiaCompensada, "0")} kWh`;
    elements.performanceReportCreditoAcumulado.textContent = `${valorOuPadrao(state.performanceCreditoAcumulado, "0")} kWh`;
    elements.performanceChartResumo.textContent = "A geracao apresentou comportamento comparado ao consumo ao longo do trimestre analisado.";
    elements.performanceReportDirecionamento.textContent = valorOuPadrao(state.performanceDirecionamento, "Descreva o direcionamento estrategico para este cliente.");
    elements.performanceReportConclusao.textContent = valorOuPadrao(state.performanceConclusao, "Inclua a mensagem final do relatorio.");

    elements.performanceReportAnalise.innerHTML = "";
    const bullets = performanceBullets();
    if (!bullets.length) {
        const item = document.createElement("li");
        item.textContent = "Inclua pontos de analise para compor o relatorio.";
        elements.performanceReportAnalise.appendChild(item);
    } else {
        bullets.forEach((bullet) => {
            const item = document.createElement("li");
            item.textContent = bullet;
            elements.performanceReportAnalise.appendChild(item);
        });
    }

    renderPerformanceChart();
}

function gerarAnaliseSunPrime() {
    const energiaGerada = parseNumero(state.spEnergiaGerada);
    const energiaConsumida = parseNumero(state.spEnergiaConsumida);
    const energiaCompensada = parseNumero(state.spEnergiaCompensada);
    const creditoAcumulado = parseNumero(state.spCreditoAcumulado);

    let analise = "O sistema apresentou comportamento operacional consistente no período, com dados suficientes para uma leitura estratégica do desempenho energético da unidade.";
    let leitura = "A leitura operacional evidencia estabilidade na relação entre geração, consumo e compensação energética, favorecendo o acompanhamento executivo do ativo.";
    let direcionamento = "Recomenda-se manter o acompanhamento mensal e consolidar a base histórica do sistema para ampliar a previsibilidade energética e a tomada de decisão.";

    if (energiaGerada > energiaConsumida) {
        analise = "O sistema operou com geração superior ao consumo, evidenciando desempenho eficiente, aderência técnica favorável e formação de excedente energético no período.";
        leitura = "A leitura operacional confirma um cenário de sobra energética, no qual a unidade não apenas atende sua demanda, mas também amplia a capacidade de geração de valor com energia excedente.";
        direcionamento = "O direcionamento estratégico recomenda avaliar redistribuição de créditos, expansão do benefício para outras unidades ou otimização do aproveitamento energético já disponível.";
    } else if (energiaGerada === energiaConsumida && energiaGerada > 0) {
        analise = "O sistema mostrou aderência à demanda atual, com operação estável e compensação energética compatível com o perfil de consumo observado na unidade.";
        leitura = "O cenário operacional demonstra equilíbrio entre geração e consumo, sustentando um padrão saudável de atendimento energético e previsibilidade operacional.";
        direcionamento = "O direcionamento estratégico recomenda manutenção do monitoramento contínuo, acompanhando crescimento de carga e eventuais variações de consumo para preservar esse equilíbrio.";
    } else if (energiaGerada < energiaConsumida) {
        analise = "A demanda da unidade permaneceu superior à capacidade atual de geração, indicando maior dependência complementar da rede elétrica ao longo do período.";
        leitura = "A leitura operacional aponta cenário de equilíbrio pressionado, em que a geração segue relevante, porém abaixo do necessário para cobertura integral do consumo.";
        direcionamento = "O direcionamento estratégico recomenda avaliar ampliação do sistema, rebalanceamento de créditos energéticos ou readequação do perfil de consumo para elevar a eficiência global.";
    }

    const creditos = creditoAcumulado > 0
        ? "Há saldo energético acumulado disponível para compensações futuras, fortalecendo a flexibilidade operacional e ampliando o potencial de gestão de consumo da unidade."
        : "Não há saldo acumulado relevante no período, indicando que o volume energético compensado foi direcionado majoritariamente para atendimento imediato da demanda.";

    const conclusao = "Conclui-se que o sistema permanece como ativo energético estratégico, com potencial para ampliar eficiência operacional, previsibilidade energética e inteligência de gestão quando acompanhado continuamente ao longo dos ciclos mensais.";

    state.spAnalise = analise;
    state.spLeitura = leitura;
    state.spCreditos = creditos;
    state.spDirecionamento = direcionamento;
    state.spConclusao = conclusao;
    state.spTextoCompleto = `## INDICADORES ENERGÉTICOS

* Energia Gerada: ${formatarNumero(energiaGerada)} kWh
* Energia Consumida: ${formatarNumero(energiaConsumida)} kWh
* Energia Compensada: ${formatarNumero(energiaCompensada)} kWh
* Crédito Acumulado: ${formatarNumero(creditoAcumulado)} kWh

## ANÁLISE DE DESEMPENHO

${analise}

## LEITURA OPERACIONAL

${leitura}

## CRÉDITOS ENERGÉTICOS

${creditos}

## DIRECIONAMENTO ESTRATÉGICO

${direcionamento}

## CONCLUSÃO

${conclusao}`;
}

function renderSunPrimeAuto() {
    if (!elements.spCliente) return;

    elements.spCliente.value = state.spCliente;
    elements.spPeriodo.value = state.spPeriodo;
    elements.spEnergiaGerada.value = state.spEnergiaGerada;
    elements.spEnergiaConsumida.value = state.spEnergiaConsumida;
    elements.spEnergiaCompensada.value = state.spEnergiaCompensada;
    elements.spCreditoAcumulado.value = state.spCreditoAcumulado;

    elements.spCardGerada.textContent = `${formatarNumero(parseNumero(state.spEnergiaGerada))} kWh`;
    elements.spCardConsumida.textContent = `${formatarNumero(parseNumero(state.spEnergiaConsumida))} kWh`;
    elements.spCardCompensada.textContent = `${formatarNumero(parseNumero(state.spEnergiaCompensada))} kWh`;
    elements.spCardCredito.textContent = `${formatarNumero(parseNumero(state.spCreditoAcumulado))} kWh`;

    elements.spAnalise.textContent = valorOuPadrao(state.spAnalise, "A análise de desempenho será gerada automaticamente a partir dos indicadores energéticos informados.");
    elements.spLeitura.textContent = valorOuPadrao(state.spLeitura, "A leitura operacional consolidará o comportamento do sistema com linguagem técnica e corporativa.");
    elements.spCreditos.textContent = valorOuPadrao(state.spCreditos, "O bloco de créditos energéticos mostrará a interpretação do saldo disponível para períodos futuros.");
    elements.spDirecionamento.textContent = valorOuPadrao(state.spDirecionamento, "O direcionamento estratégico apontará recomendações de expansão, redistribuição ou monitoramento.");
    elements.spConclusao.textContent = valorOuPadrao(state.spConclusao, "A conclusão executiva fechará o relatório destacando o sistema como ativo energético estratégico.");
    elements.spTextoCompleto.value = valorOuPadrao(state.spTextoCompleto, `## INDICADORES ENERGÉTICOS

Preencha os dados e clique em "Gerar análise" para montar automaticamente o texto completo do relatório.`);
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
    renderPerformance();
    renderSunPrimeAuto();
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

[
    "performanceCliente",
    "performancePeriodo",
    "performanceResumo",
    "performanceEnergiaConsumida",
    "performanceEnergiaGerada",
    "performanceEnergiaCompensada",
    "performanceCreditoAcumulado",
    "performanceGerJan",
    "performanceGerFev",
    "performanceGerMar",
    "performanceConsJan",
    "performanceConsFev",
    "performanceConsMar",
    "performanceAnalise",
    "performanceDirecionamento",
    "performanceConclusao"
].forEach((key) => {
    if (!elements[key]) return;
    elements[key].addEventListener("input", (event) => {
        state[key] = event.target.value;
        render();
    });
});

[
    "spCliente",
    "spPeriodo",
    "spEnergiaGerada",
    "spEnergiaConsumida",
    "spEnergiaCompensada",
    "spCreditoAcumulado"
].forEach((key) => {
    if (!elements[key]) return;
    elements[key].addEventListener("input", (event) => {
        state[key] = event.target.value;
        render();
    });
});

if (elements.spGerarAnalise) {
    elements.spGerarAnalise.addEventListener("click", () => {
        gerarAnaliseSunPrime();
        render();
    });
}

if (elements.spCopiarTexto) {
    elements.spCopiarTexto.addEventListener("click", async () => {
        const texto = state.spTextoCompleto.trim();
        if (!texto) return;
        try {
            await navigator.clipboard.writeText(texto);
        } catch {
            const area = document.createElement("textarea");
            area.value = texto;
            document.body.appendChild(area);
            area.select();
            document.execCommand("copy");
            area.remove();
        }
    });
}

if (elements.spEnviarPerformance) {
    elements.spEnviarPerformance.addEventListener("click", () => {
        if (!state.spAnalise.trim()) {
            gerarAnaliseSunPrime();
        }

        state.performanceCliente = state.spCliente;
        state.performancePeriodo = state.spPeriodo;
        state.performanceResumo = state.spLeitura;
        state.performanceEnergiaConsumida = state.spEnergiaConsumida;
        state.performanceEnergiaGerada = state.spEnergiaGerada;
        state.performanceEnergiaCompensada = state.spEnergiaCompensada;
        state.performanceCreditoAcumulado = state.spCreditoAcumulado;
        state.performanceAnalise = state.spAnalise;
        state.performanceDirecionamento = state.spDirecionamento;
        state.performanceConclusao = state.spConclusao;
        state.abaAtual = "performance";
        render();
    });
}

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
