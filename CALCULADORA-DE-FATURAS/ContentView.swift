import SwiftUI

struct Unidade: Identifiable {
    let id = UUID()
    var nome: String
    var media: Double
}

private struct UnidadeEditavel: Identifiable {
    let id = UUID()
    var nome: String
    var mediaTexto: String

    init(nome: String, mediaTexto: String = "") {
        self.nome = nome
        self.mediaTexto = mediaTexto
    }

    var unidadeCalculada: Unidade {
        Unidade(
            nome: nome.isEmpty ? "Sem nome" : nome,
            media: parseNumero(mediaTexto)
        )
    }

    private func parseNumero(_ texto: String) -> Double {
        let textoNormalizado = texto.replacingOccurrences(of: ",", with: ".")
        return Double(textoNormalizado) ?? 0
    }
}

struct ContentView: View {
    @State private var unidades: [UnidadeEditavel] = [
        UnidadeEditavel(nome: "", mediaTexto: "")
    ]
    @State private var geracaoTotalTexto = ""
    @State private var valorKWhTexto = "1,17"
    @State private var nomeCliente = ""
    @State private var codigoCliente = ""
    @State private var enderecoUnidade = ""
    @State private var vencimentoFatura = Date()
    private let corTitulo = Color(red: 0.09, green: 0.15, blue: 0.22)
    private let corTexto = Color(red: 0.18, green: 0.24, blue: 0.31)
    private let corSecundaria = Color(red: 0.38, green: 0.46, blue: 0.56)
    private let corCampo = Color(red: 0.08, green: 0.13, blue: 0.19)

    var unidadesCalculadas: [Unidade] {
        unidades.map(\.unidadeCalculada)
    }

    var geracaoTotal: Double {
        parseNumero(geracaoTotalTexto)
    }

    var valorKWh: Double {
        let valor = parseNumero(valorKWhTexto)
        return valor > 0 ? valor : 1.17
    }

    var percentuais: [Double] {
        calcularPercentuais(unidades: unidadesCalculadas)
    }

    var percentuaisSobreGeracaoTotal: [Double] {
        calcularPercentuaisSobreGeracaoTotal(unidades: unidadesCalculadas, geracaoTotal: geracaoTotal)
    }

    var distribuicao: [(nome: String, energia: Double)] {
        distribuirEnergia(unidades: unidadesCalculadas, geracaoTotal: geracaoTotal)
    }

    var rankingRateio: [(nome: String, media: Double, percentual: Double, valorFatura: Double)] {
        unidadesCalculadas.map { unidade in
            let percentual = geracaoTotal > 0 ? unidade.media / geracaoTotal : 0
            let valorFatura = unidade.media * valorKWh
            return (
                nome: unidade.nome,
                media: unidade.media,
                percentual: percentual,
                valorFatura: valorFatura
            )
        }
        .sorted { $0.percentual > $1.percentual }
    }

    var somaMedias: Double {
        unidadesCalculadas.reduce(0) { $0 + $1.media }
    }

    var somaDistribuida: Double {
        somaMedias
    }

    var energiaFaltante: Double {
        max(geracaoTotal - somaDistribuida, 0)
    }

    var percentualDistribuido: Double {
        guard geracaoTotal > 0 else { return 0 }
        return somaDistribuida / geracaoTotal
    }

    var percentualFaltante: Double {
        max(1 - percentualDistribuido, 0)
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 16) {
                    cabecalho
                    resumo
                    dadosCliente
                    listaUnidades
                    painelResultado
                }
                .padding(16)
            }
            .background(backgroundGradient)
            .navigationTitle("Rateio de Geracao")
        }
    }

    private var backgroundGradient: some View {
        LinearGradient(
            colors: [
                Color(red: 0.95, green: 0.97, blue: 0.98),
                Color(red: 0.89, green: 0.93, blue: 0.95),
                Color(red: 0.83, green: 0.89, blue: 0.93)
            ],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
        .ignoresSafeArea()
    }

    private var cabecalho: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Distribuicao por media de consumo")
                .font(.system(size: 26, weight: .bold, design: .rounded))
                .foregroundStyle(corTitulo)

            Text("Informe diretamente a media de consumo de cada unidade. O sistema calcula o percentual de participacao e distribui a geracao total em kWh.")
                .font(.system(size: 13, weight: .medium, design: .rounded))
                .foregroundStyle(corSecundaria)

            HStack(spacing: 12) {
                VStack(alignment: .leading, spacing: 6) {
                    Text("Geracao total (kWh)")
                        .font(.system(size: 12, weight: .semibold, design: .rounded))
                        .foregroundStyle(corSecundaria)

                    TextField("0", text: $geracaoTotalTexto)
                        .textFieldStyle(.plain)
                        .font(.system(size: 18, weight: .bold, design: .rounded))
                        .foregroundStyle(corCampo)
                        .padding(.horizontal, 12)
                        .padding(.vertical, 10)
                        .background(
                            RoundedRectangle(cornerRadius: 14, style: .continuous)
                                .fill(Color.white.opacity(0.92))
                        )
                }

                VStack(alignment: .leading, spacing: 6) {
                    Text("Valor do kWh (R$)")
                        .font(.system(size: 12, weight: .semibold, design: .rounded))
                        .foregroundStyle(corSecundaria)

                    TextField("1,17", text: $valorKWhTexto)
                        .textFieldStyle(.plain)
                        .font(.system(size: 18, weight: .bold, design: .rounded))
                        .foregroundStyle(corCampo)
                        .padding(.horizontal, 12)
                        .padding(.vertical, 10)
                        .background(
                            RoundedRectangle(cornerRadius: 14, style: .continuous)
                                .fill(Color.white.opacity(0.92))
                        )
                }

                Button(action: adicionarUnidade) {
                    Label("Adicionar unidade", systemImage: "plus.circle.fill")
                        .font(.system(size: 14, weight: .bold, design: .rounded))
                        .foregroundStyle(.white)
                        .padding(.horizontal, 14)
                        .padding(.vertical, 12)
                        .background(
                            RoundedRectangle(cornerRadius: 14, style: .continuous)
                                .fill(Color(red: 0.13, green: 0.47, blue: 0.64))
                        )
                }
                .buttonStyle(.plain)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(18)
        .background(cardBackground)
    }

    private var resumo: some View {
        HStack(spacing: 12) {
            resumoCard(titulo: "Unidades", valor: "\(unidades.count)", cor: Color(red: 0.19, green: 0.42, blue: 0.54))
            resumoCard(titulo: "Distribuido (kWh)", valor: "\(formatarNumero(somaDistribuida)) kWh", cor: Color(red: 0.70, green: 0.46, blue: 0.18))
            resumoCard(titulo: "Faltante (kWh)", valor: "\(formatarNumero(energiaFaltante)) kWh", cor: Color(red: 0.68, green: 0.39, blue: 0.12))
            resumoCard(titulo: "% Distribuido", valor: formatarPercentual(percentualDistribuido), cor: Color(red: 0.11, green: 0.47, blue: 0.38))
            resumoCard(titulo: "% Faltante", valor: formatarPercentual(percentualFaltante), cor: Color(red: 0.62, green: 0.28, blue: 0.18))
        }
    }

    private var dadosCliente: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Dados do Cliente")
                .font(.system(size: 18, weight: .bold, design: .rounded))
                .foregroundStyle(corTitulo)

            VStack(spacing: 10) {
                HStack(spacing: 12) {
                    campoTexto(titulo: "Nome do cliente", texto: $nomeCliente, placeholder: "Digite o nome")
                    campoTexto(titulo: "Codigo do cliente", texto: $codigoCliente, placeholder: "Digite o codigo")
                }

                HStack(spacing: 12) {
                    campoTexto(titulo: "Endereco da unidade consumidora", texto: $enderecoUnidade, placeholder: "Digite o endereco")

                    VStack(alignment: .leading, spacing: 6) {
                        Text("Vencimento da fatura")
                            .font(.system(size: 12, weight: .semibold, design: .rounded))
                            .foregroundStyle(corSecundaria)

                        DatePicker(
                            "",
                            selection: $vencimentoFatura,
                            displayedComponents: .date
                        )
                        .labelsHidden()
                        .padding(.horizontal, 12)
                        .padding(.vertical, 10)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(
                            RoundedRectangle(cornerRadius: 14, style: .continuous)
                                .fill(Color.white.opacity(0.92))
                        )
                    }
                }
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(18)
        .background(cardBackground)
    }

    private func resumoCard(titulo: String, valor: String, cor: Color) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(titulo)
                .font(.system(size: 11, weight: .semibold, design: .rounded))
                .foregroundStyle(corSecundaria)

            Text(valor)
                .font(.system(size: 22, weight: .bold, design: .rounded))
                .foregroundStyle(cor)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(14)
        .background(cardBackground)
    }

    private func campoTexto(titulo: String, texto: Binding<String>, placeholder: String) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(titulo)
                .font(.system(size: 12, weight: .semibold, design: .rounded))
                .foregroundStyle(corSecundaria)

            TextField(placeholder, text: texto)
                .textFieldStyle(.plain)
                .font(.system(size: 16, weight: .bold, design: .rounded))
                .foregroundStyle(corCampo)
                .padding(.horizontal, 12)
                .padding(.vertical, 10)
                .background(
                    RoundedRectangle(cornerRadius: 14, style: .continuous)
                        .fill(Color.white.opacity(0.92))
                )
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    private var listaUnidades: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Unidades")
                .font(.system(size: 18, weight: .bold, design: .rounded))
                .foregroundStyle(corTitulo)

            ForEach(unidades.indices, id: \.self) { index in
                unidadeCard(index: index)
            }
        }
    }

    private func unidadeCard(index: Int) -> some View {
        let unidade = unidadesCalculadas[index]
        let percentual = percentuaisSobreGeracaoTotal.indices.contains(index) ? percentuaisSobreGeracaoTotal[index] : 0
        let energia = distribuicao.indices.contains(index) ? distribuicao[index].energia : 0
        let valorFatura = energia * valorKWh

        return VStack(alignment: .leading, spacing: 12) {
            HStack {
                TextField("Nome da unidade", text: $unidades[index].nome)
                    .textFieldStyle(.plain)
                    .font(.system(size: 18, weight: .bold, design: .rounded))
                    .foregroundStyle(corTitulo)

                Spacer()

                Button(role: .destructive) {
                    excluirUnidade(at: index)
                } label: {
                    Image(systemName: "trash")
                        .font(.system(size: 13, weight: .bold))
                        .padding(8)
                        .background(Color.red.opacity(0.10), in: Circle())
                }
                .buttonStyle(.plain)
            }

            campoMedia(index: index)

            HStack(spacing: 10) {
                metricaCard(titulo: "Media (kWh)", valor: "\(formatarNumero(unidade.media)) kWh")
                metricaCard(titulo: "Percentual", valor: formatarPercentual(percentual))
                metricaCard(titulo: "Valor da fatura", valor: formatarMoeda(valorFatura))
            }
        }
        .padding(16)
        .background(cardBackground)
    }

    private func campoMedia(index: Int) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            Text("Media de consumo")
                .font(.system(size: 11, weight: .semibold, design: .rounded))
                .foregroundStyle(corSecundaria)

            TextField("0", text: $unidades[index].mediaTexto)
                .textFieldStyle(.plain)
                .font(.system(size: 16, weight: .bold, design: .rounded))
                .foregroundStyle(corCampo)
                .padding(.horizontal, 10)
                .padding(.vertical, 8)
                .background(
                    RoundedRectangle(cornerRadius: 12, style: .continuous)
                        .fill(Color(red: 0.97, green: 0.98, blue: 0.99))
                )
                .overlay(
                    RoundedRectangle(cornerRadius: 12, style: .continuous)
                        .stroke(Color(red: 0.80, green: 0.85, blue: 0.90), lineWidth: 1)
                )
        }
    }

    private func metricaCard(titulo: String, valor: String) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(titulo)
                .font(.system(size: 10, weight: .semibold, design: .rounded))
                .foregroundStyle(corSecundaria)

            Text(valor)
                .font(.system(size: 15, weight: .bold, design: .rounded))
                .foregroundStyle(corTexto)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(12)
        .background(
            RoundedRectangle(cornerRadius: 12, style: .continuous)
                .fill(Color(red: 0.96, green: 0.98, blue: 1.0))
        )
    }

    private var painelResultado: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Ranking do Rateio")
                .font(.system(size: 18, weight: .bold, design: .rounded))
                .foregroundStyle(corTitulo)

            ForEach(Array(rankingRateio.enumerated()), id: \.offset) { index, item in
                HStack {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("\(index + 1). \(item.nome)")
                            .font(.system(size: 15, weight: .bold, design: .rounded))
                            .foregroundStyle(corTitulo)

                        Text("Media: \(formatarNumero(item.media)) kWh | Fatura estimada: \(formatarMoeda(item.valorFatura))")
                            .font(.system(size: 12, weight: .medium, design: .rounded))
                            .foregroundStyle(corSecundaria)
                    }

                    Spacer()

                    Text(formatarPercentual(item.percentual))
                        .font(.system(size: 16, weight: .bold, design: .rounded))
                        .foregroundStyle(Color(red: 0.13, green: 0.47, blue: 0.64))
                }
                .padding(.vertical, 6)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(16)
        .background(cardBackground)
    }

    private var cardBackground: some View {
        RoundedRectangle(cornerRadius: 20, style: .continuous)
            .fill(Color.white.opacity(0.88))
            .shadow(color: Color.black.opacity(0.05), radius: 8, x: 0, y: 4)
    }

    private func adicionarUnidade() {
        unidades.append(UnidadeEditavel(nome: "", mediaTexto: ""))
    }

    private func excluirUnidade(at index: Int) {
        guard unidades.indices.contains(index), unidades.count > 1 else { return }
        unidades.remove(at: index)
    }

    private func calcularPercentuais(unidades: [Unidade]) -> [Double] {
        let somaMedias = unidades.reduce(0) { $0 + $1.media }

        return unidades.map { unidade in
            guard somaMedias > 0 else { return 0 }
            return unidade.media / somaMedias
        }
    }

    private func calcularPercentuaisSobreGeracaoTotal(unidades: [Unidade], geracaoTotal: Double) -> [Double] {
        unidades.map { unidade in
            guard geracaoTotal > 0 else { return 0 }
            return unidade.media / geracaoTotal
        }
    }

    private func distribuirEnergia(unidades: [Unidade], geracaoTotal: Double) -> [(nome: String, energia: Double)] {
        let percentuais = calcularPercentuais(unidades: unidades)

        return unidades.enumerated().map { index, unidade in
            (nome: unidade.nome, energia: percentuais[index] * geracaoTotal)
        }
    }

    private func parseNumero(_ texto: String) -> Double {
        let textoBruto = texto.replacingOccurrences(of: " ", with: "")
        let textoNormalizado: String

        if textoBruto.contains(",") {
            textoNormalizado = textoBruto
                .replacingOccurrences(of: ".", with: "")
                .replacingOccurrences(of: ",", with: ".")
        } else {
            textoNormalizado = textoBruto
        }

        return Double(textoNormalizado) ?? 0
    }

    private func formatarNumero(_ valor: Double) -> String {
        let formatador = NumberFormatter()
        formatador.locale = Locale(identifier: "pt_BR")
        formatador.numberStyle = .decimal
        formatador.minimumFractionDigits = 2
        formatador.maximumFractionDigits = 2
        return formatador.string(from: NSNumber(value: valor)) ?? "0,00"
    }

    private func formatarPercentual(_ valor: Double) -> String {
        let percentual = valor * 100
        return "\(formatarNumero(percentual))%"
    }

    private func formatarMoeda(_ valor: Double) -> String {
        let formatador = NumberFormatter()
        formatador.locale = Locale(identifier: "pt_BR")
        formatador.numberStyle = .currency
        formatador.currencyCode = "BRL"
        return formatador.string(from: NSNumber(value: valor)) ?? "R$ 0,00"
    }
}

#Preview {
    ContentView()
        .frame(width: 850, height: 750)
}
