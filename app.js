const initialUnits = [
    { id: crypto.randomUUID(), nome: "Geradora", media: "120" },
    { id: crypto.randomUUID(), nome: "Beneficiaria 1", media: "90" },
    { id: crypto.randomUUID(), nome: "Beneficiaria 2", media: "75" }
];

const state = {
    geracaoTotal: "10000",
    unidades: initialUnits
};

const elements = {
    geracaoTotal: document.querySelector("#geracaoTotal"),
    adicionarUnidade: document.querySelector("#adicionarUnidade"),
    totalUnidades: document.querySelector("#totalUnidades"),
    somaMedias: document.querySelector("#somaMedias"),
    totalDistribuido: document.querySelector("#totalDistribuido"),
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

function unidadesCalculadas() {
    return state.unidades.map((unidade) => ({
        id: unidade.id,
        nome: unidade.nome.trim() || "Sem nome",
        media: parseNumero(unidade.media)
    }));
}

function calcularPercentuais(unidades) {
    const somaMedias = unidades.reduce((acc, unidade) => acc + unidade.media, 0);
    return unidades.map((unidade) => (somaMedias > 0 ? unidade.media / somaMedias : 0));
}

function distribuirEnergia(unidades, geracaoTotal) {
    const percentuais = calcularPercentuais(unidades);
    return unidades.map((unidade, index) => ({
        id: unidade.id,
        nome: unidade.nome,
        media: unidade.media,
        percentual: percentuais[index],
        energia: percentuais[index] * geracaoTotal
    }));
}

function renderResumo(distribuicao) {
    const somaMedias = distribuicao.reduce((acc, item) => acc + item.media, 0);
    const totalDistribuido = distribuicao.reduce((acc, item) => acc + item.energia, 0);

    elements.totalUnidades.textContent = String(distribuicao.length);
    elements.somaMedias.textContent = formatarNumero(somaMedias);
    elements.totalDistribuido.textContent = formatarNumero(totalDistribuido);
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

        fragment.querySelector('[data-role="metric-media"]').textContent = formatarNumero(item.media);
        fragment.querySelector('[data-role="metric-percentual"]').textContent = formatarPercentual(item.percentual);
        fragment.querySelector('[data-role="metric-energia"]').textContent = `${formatarNumero(item.energia)} kWh`;

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

    distribuicao.forEach((item) => {
        const article = document.createElement("article");
        article.className = "result-item";

        const top = document.createElement("div");
        top.className = "result-top";

        const nome = document.createElement("span");
        nome.className = "result-name";
        nome.textContent = item.nome;

        const energia = document.createElement("span");
        energia.className = "result-energy";
        energia.textContent = `${formatarNumero(item.energia)} kWh`;

        const meta = document.createElement("div");
        meta.className = "result-meta";
        meta.textContent = `Media: ${formatarNumero(item.media)} | Percentual: ${formatarPercentual(item.percentual)}`;

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

elements.adicionarUnidade.addEventListener("click", () => {
    state.unidades.push({
        id: crypto.randomUUID(),
        nome: "Nova unidade",
        media: "0"
    });
    render();
});

render();
