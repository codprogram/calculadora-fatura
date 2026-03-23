const initialUnits = [
    { id: crypto.randomUUID(), nome: "", media: "" }
];
const state = {
    geracaoTotal: "",
    valorKWh: "1,17",
    unidades: initialUnits
};

const elements = {
    geracaoTotal: document.querySelector("#geracaoTotal"),
    valorKWh: document.querySelector("#valorKWh"),
    adicionarUnidade: document.querySelector("#adicionarUnidade"),
    totalUnidades: document.querySelector("#totalUnidades"),
    totalDistribuido: document.querySelector("#totalDistribuido"),
    energiaFaltante: document.querySelector("#energiaFaltante"),
    percentualDistribuido: document.querySelector("#percentualDistribuido"),
    percentualFaltante: document.querySelector("#percentualFaltante"),
    listaUnidades: document.querySelector("#listaUnidades"),
    resultadoRateio: document.querySelector("#resultadoRateio"),
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
        valorFatura: percentuais[index] * geracaoTotal * valorKWh
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
        fragment.querySelector('[data-role="metric-energia"]').textContent = formatarMoeda(item.valorFatura);

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

function renderResultado(distribuicao) {
    elements.resultadoRateio.innerHTML = "";

    if (!distribuicao.length) {
        elements.resultadoRateio.innerHTML = '<div class="empty-state">Nenhuma unidade cadastrada.</div>';
        return;
    }

    const ranking = [...distribuicao].sort((a, b) => b.percentualGeracaoTotal - a.percentualGeracaoTotal);

    ranking.forEach((item, index) => {
        const article = document.createElement("article");
        article.className = "result-item";

        const top = document.createElement("div");
        top.className = "result-top";

        const nome = document.createElement("span");
        nome.className = "result-name";
        nome.textContent = `${index + 1}. ${item.nome}`;

        const energia = document.createElement("span");
        energia.className = "result-energy";
        energia.textContent = formatarPercentual(item.percentualGeracaoTotal);

        const meta = document.createElement("div");
        meta.className = "result-meta";
        meta.textContent = `Media: ${formatarNumero(item.media)} kWh | Fatura estimada: ${formatarMoeda(item.valorFatura)}`;

        top.append(nome, energia);
        article.append(top, meta);
        elements.resultadoRateio.appendChild(article);
    });
}

function render() {
    const geracaoTotal = parseNumero(state.geracaoTotal);
    const unidades = unidadesCalculadas();
    const distribuicao = distribuirEnergia(unidades, geracaoTotal);

    elements.geracaoTotal.value = state.geracaoTotal;
    elements.valorKWh.value = state.valorKWh;

    renderResumo(distribuicao);
    renderLista(distribuicao);
    renderResultado(distribuicao);
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

elements.adicionarUnidade.addEventListener("click", () => {
    state.unidades.push({
        id: crypto.randomUUID(),
        nome: "",
        media: ""
    });
    render();
});

render();
