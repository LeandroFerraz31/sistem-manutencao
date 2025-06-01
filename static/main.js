document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal-editar');
    const closeModal = document.querySelector('.close');
    const formCadastrar = document.getElementById('form-cadastrar');
    const formEditar = document.getElementById('form-editar');
    const formRelatorios = document.getElementById('form-relatorios');
    const colinhaContent = document.getElementById('colinha-content');
    const tabelaManutencoes = document.getElementById('tabela-manutencoes');
    const totalManutencoes = document.getElementById('total-manutencoes');
    const valorTotal = document.getElementById('valor-total');
    const veiculosAtendidos = document.getElementById('veiculos-atendidos');
    const manutencoesMes = document.getElementById('manutencoes-mes');
    const navLinks = document.querySelectorAll('.sidebar ul li a');
    const sections = document.querySelectorAll('.section');

    let manutencoes = [];
    let editIndex = null;
    let grafico = null;
    let relatorioAtual = [];

    // Configuração global do Axios
    axios.defaults.baseURL = 'https://sistem-manutencao.onrender.com/api';
    axios.defaults.timeout = 10000;

    mostrarSecao('dashboard');

    function mostrarSecao(sectionId) {
        sections.forEach(section => section.classList.remove('active'));
        document.getElementById(sectionId).classList.add('active');
        navLinks.forEach(link => link.classList.remove('active'));
        document.querySelector(`a[data-section="${sectionId}"]`).classList.add('active');
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');
            mostrarSecao(sectionId);
        });
    });

    function atualizarDashboard() {
        totalManutencoes.textContent = manutencoes.length;
        const valor = manutencoes.reduce((acc, man) => acc + Number(man.valor || 0), 0);
        valorTotal.textContent = `R$ ${valor.toFixed(2)}`;

        const tiposExcluidos = ['Compra de Corda', 'Madeirite', 'Lona', 'Cinta e Catraca', 'EPIs', 'DIVERSOS'];
        const veiculosAtendidosSet = new Set();
        manutencoes.forEach(man => {
            if (!tiposExcluidos.includes(man.tipo)) {
                veiculosAtendidosSet.add(man.placa);
            }
        });
        veiculosAtendidos.textContent = veiculosAtendidosSet.size;

        const hoje = new Date();
        const mesAtual = hoje.getMonth();
        const anoAtual = hoje.getFullYear();
        const manutencoesMesCount = manutencoes.filter(man => {
            const dataMan = new Date(man.data);
            return dataMan.getMonth() === mesAtual && dataMan.getFullYear() === anoAtual;
        }).length;
        manutencoesMes.textContent = manutencoesMesCount;

        atualizarGrafico();
    }

    function atualizarGrafico() {
        const ctx = document.getElementById('grafico-comparacao').getContext('2d');
        if (grafico) grafico.destroy();

        const hoje = new Date();
        const diaAtual = hoje.toISOString().split('T')[0];
        const semanaInicio = new Date(hoje);
        semanaInicio.setDate(hoje.getDate() - hoje.getDay());
        const semanaFim = new Date(semanaInicio);
        semanaFim.setDate(semanaInicio.getDate() + 6);
        const mesAtual = hoje.getMonth();
        const anoAtual = hoje.getFullYear();

        const atendimentosDia = manutencoes.filter(man => man.data === diaAtual).length;
        const valorDia = manutencoes.filter(man => man.data === diaAtual).reduce((acc, man) => acc + Number(man.valor || 0), 0);
        const atendimentosSemana = manutencoes.filter(man => {
            const dataMan = new Date(man.data);
            return dataMan >= semanaInicio && dataMan <= semanaFim;
        }).length;
        const valorSemana = manutencoes.filter(man => {
            const dataMan = new Date(man.data);
            return dataMan >= semanaInicio && dataMan <= semanaFim;
        }).reduce((acc, man) => acc + Number(man.valor || 0), 0);
        const atendimentosMes = manutencoes.filter(man => {
            const dataMan = new Date(man.data);
            return dataMan.getMonth() === mesAtual && dataMan.getFullYear() === anoAtual;
        }).length;
        const valorMes = manutencoes.filter(man => {
            const dataMan = new Date(man.data);
            return dataMan.getMonth() === mesAtual && dataMan.getFullYear() === anoAtual;
        }).reduce((acc, man) => acc + Number(man.valor || 0), 0);

        grafico = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Dia', 'Semana', 'Mês'],
                datasets: [
                    {
                        label: 'Atendimentos',
                        data: [atendimentosDia, atendimentosSemana, atendimentosMes],
                        backgroundColor: 'rgba(75, 192, 192, 0.5)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Valor Gasto (R$)',
                        data: [valorDia, valorSemana, valorMes],
                        backgroundColor: 'rgba(240, 53, 53, 0.67)',
                        borderColor: 'rgb(202, 16, 3)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: true } }
            }
        });
    }

   // Atualização da função atualizarColinha com melhorias solicitadas
function atualizarColinha() {
    colinhaContent.innerHTML = '';
    manutencoes.forEach(manutencao => {
        const entryText = `Placa: ${manutencao.placa}
Motorista: ${manutencao.motorista} - Tipo: ${manutencao.tipo}
Valor total: R$ ${Number(manutencao.valor || 0).toFixed(2)}
CHAVE PIX: ${manutencao.pix || 'N/A'} ${manutencao.favorecido || ''}
OC: ${manutencao.oc || 'N/A'}
Local: ${manutencao.local}
Defeito: ${manutencao.defeito}`.trim().replace(/"/g, '&quot;');

        const entry = `
            <div style="border: 1px solid #ddd; padding: 10px; text-align: left; margin-bottom: 10px; border-radius: 5px; position: relative;">
                <div>
                    <p><strong>Placa:</strong> ${manutencao.placa}</p>
                    <p><strong>Motorista:</strong> ${manutencao.motorista} - <strong>Tipo:</strong> ${manutencao.tipo}</p>
                    <p><strong>Valor total:</strong> R$ ${Number(manutencao.valor || 0).toFixed(2)}</p>
                    <p><strong>CHAVE PIX:</strong> ${manutencao.pix || 'N/A'} ${manutencao.favorecido || ''}</p>
                    <p><strong>OC:</strong> ${manutencao.oc || 'N/A'}</p>
                    <p><strong>Local:</strong> ${manutencao.local}</p>
                    <p><strong>Defeito:</strong> ${manutencao.defeito}</p>
                </div>
                <button class="botao-copiar" data-texto="${entryText}" style="position: absolute; top: 5px; right: 5px; background-color: #f0f0f0; border: 1px solid #ccc; border-radius: 3px; padding: 2px 6px; cursor: pointer;">📋</button>
            </div>
        `;

        colinhaContent.innerHTML = entry + colinhaContent.innerHTML;
    });

    if (manutencoes.length === 0) {
        colinhaContent.innerHTML = '<p>Aqui aparecerão as informações salvas...</p>';
    }
}

// Delegação para copiar texto da colinha

document.addEventListener('click', function (e) {
    if (e.target.classList.contains('botao-copiar')) {
        const texto = e.target.getAttribute('data-texto');
        navigator.clipboard.writeText(texto).then(() => {
            e.target.textContent = '✅';
            setTimeout(() => {
                e.target.textContent = '📋';
            }, 2000);
        }).catch(err => {
            console.error('Erro ao copiar:', err);
            alert('Erro ao copiar o texto.');
        });
    }
});

// Filtro da colinha
const filtroColinhaInput = document.getElementById('filtro-colinha');
if (filtroColinhaInput) {
    filtroColinhaInput.addEventListener('input', function () {
        const termo = this.value.toLowerCase();
        const blocos = colinhaContent.querySelectorAll('div');
        blocos.forEach(bloco => {
            const texto = bloco.innerText.toLowerCase();
            bloco.style.display = texto.includes(termo) ? 'block' : 'none';
        });
    });
}



    function atualizarTabela() {
        tabelaManutencoes.innerHTML = '';
        manutencoes.forEach((manutencao, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${manutencao.data}</td>
                <td>${manutencao.placa}</td>
                <td>${manutencao.motorista}</td>
                <td>${manutencao.tipo}</td>
                <td>${manutencao.oc || 'N/A'}</td>
                <td>R$ ${Number(manutencao.valor || 0).toFixed(2)}</td>
                <td>${manutencao.pix || 'N/A'}</td>
                <td>${manutencao.favorecido || 'N/A'}</td>
                <td>${manutencao.local}</td>
                <td>${manutencao.defeito}</td>
                <td>
                    <button class="editar" data-index="${index}">✏️ Editar</button>
                    <button class="excluir" data-index="${index}">🗑️ Excluir</button>
                </td>
            `;
            tabelaManutencoes.appendChild(row);
        });

        document.querySelectorAll('.editar').forEach(button => {
            button.addEventListener('click', () => {
                const index = button.getAttribute('data-index');
                editarManutencao(index);
            });
        });

        document.querySelectorAll('.excluir').forEach(button => {
            button.addEventListener('click', () => {
                const index = button.getAttribute('data-index');
                excluirManutencao(index);
            });
        });
    }

    async function carregarManutencoes() {
        try {
            const response = await axios.get('/manutencoes');

            manutencoes = response.data;
            relatorioAtual = response.data; // Inicializa com todos os dados
            atualizarTabela();
            atualizarColinha();
            atualizarDashboard();
        } catch (error) {
            console.error('Erro ao carregar manutenções:', error);
            alert(`Erro ao carregar manutenções: ${error.response?.data?.error || error.message}`);
        }
    }

    function validarDadosManutencao(dados) {
        const requiredFields = ['data', 'placa', 'motorista', 'tipo', 'valor', 'local', 'defeito'];
        const missingFields = requiredFields.filter(field => !dados[field] || dados[field].toString().trim() === '');
        if (missingFields.length > 0) {
            throw new Error(`Campos obrigatórios não preenchidos: ${missingFields.join(', ')}`);
        }
        if (isNaN(parseFloat(dados.valor)) || parseFloat(dados.valor) < 0) {
            throw new Error('Valor deve ser um número válido maior ou igual a zero');
        }
        return true;
    }

    formCadastrar.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(formCadastrar);
        const manutencao = {
            data: formData.get('data'),
            placa: formData.get('placa').toUpperCase().trim(),
            motorista: formData.get('motorista').trim(),
            tipo: formData.get('tipo'),
            oc: formData.get('oc') || '',
            valor: parseFloat(formData.get('valor')),
            pix: formData.get('pix') || '',
            favorecido: formData.get('favorecido') || '',
            local: formData.get('local').trim(),
            defeito: formData.get('defeito').trim()
        };

        try {
            validarDadosManutencao(manutencao);
            await axios.post('/manutencoes', manutencao);
            await carregarManutencoes();
            formCadastrar.reset();
            alert('Manutenção cadastrada com sucesso!');
        } catch (error) {
            console.error('Erro ao adicionar manutenção:', error);
            alert(`Erro ao adicionar manutenção: ${error.message || error.response?.data?.error || 'Erro desconhecido'}`);
        }
    });

    function editarManutencao(index) {
        editIndex = index;
        const manutencao = manutencoes[index];
        document.getElementById('edit-data').value = manutencao.data;
        document.getElementById('edit-placa').value = manutencao.placa;
        document.getElementById('edit-motorista').value = manutencao.motorista;
        document.getElementById('edit-tipo').value = manutencao.tipo;
        document.getElementById('edit-oc').value = manutencao.oc || '';
        document.getElementById('edit-valor').value = manutencao.valor;
        document.getElementById('edit-pix').value = manutencao.pix || '';
        document.getElementById('edit-favorecido').value = manutencao.favorecido || '';
        document.getElementById('edit-local').value = manutencao.local;
        document.getElementById('edit-defeito').value = manutencao.defeito;
        modal.style.display = 'flex';
    }

    async function excluirManutencao(index) {
        if (confirm('Tem certeza que deseja excluir esta manutenção?')) {
            try {
                await axios.delete(`/manutencoes/${manutencoes[index].id}`);
                await carregarManutencoes();
                alert('Manutenção excluída com sucesso!');
            } catch (error) {
                console.error('Erro ao excluir manutenção:', error);
                alert(`Erro ao excluir manutenção: ${error.response?.data?.error || error.message}`);
            }
        }
    }

    formEditar.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(formEditar);
        const manutencao = {
            data: formData.get('data'),
            placa: formData.get('placa').toUpperCase().trim(),
            motorista: formData.get('motorista').trim(),
            tipo: formData.get('tipo'),
            oc: formData.get('oc') || '',
            valor: parseFloat(formData.get('valor')),
            pix: formData.get('pix') || '',
            favorecido: formData.get('favorecido') || '',
            local: formData.get('local').trim(),
            defeito: formData.get('defeito').trim()
        };

        try {
            validarDadosManutencao(manutencao);
            await axios.put(`/manutencoes/${manutencoes[editIndex].id}`, manutencao);
            await carregarManutencoes();
            modal.style.display = 'none';
            alert('Manutenção atualizada com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar manutenção:', error);
            alert(`Erro ao atualizar manutenção: ${error.message || error.response?.data?.error || 'Erro desconhecido'}`);
        }
    });

    closeModal.addEventListener('click', () => modal.style.display = 'none');
    document.querySelector('.cancelar').addEventListener('click', () => modal.style.display = 'none');

    // GERAR RELATÓRIO
    formRelatorios.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(formRelatorios);
        const dataInicio = formData.get('data_inicio');
        const dataFim = formData.get('data_fim');
        const placa = formData.get('placa')?.trim().toUpperCase() || '';

        if (!dataInicio || !dataFim) {
            alert('Por favor, preencha as datas de início e fim.');
            return;
        }

        if (new Date(dataInicio) > new Date(dataFim)) {
            alert('A data de início não pode ser maior que a data de fim.');
            return;
        }

        try {
            const response = await axios.post('/relatorios', {
                data_inicio: dataInicio,
                data_fim: dataFim,
                placa: placa
            });

            relatorioAtual = response.data;
            manutencoes = response.data;
            atualizarTabela();
            atualizarColinha();
            atualizarDashboard();

            if (relatorioAtual.length === 0) {
                alert('Nenhuma manutenção encontrada para os critérios especificados.');
            } else {
                alert(`Relatório gerado com sucesso! ${relatorioAtual.length} registro(s) encontrado(s).`);
            }
        } catch (error) {
            console.error('Erro ao gerar relatório:', error);
            alert(`Erro ao gerar relatório: ${error.response?.data?.error || error.message}`);
        }
    });

    // EXPORTAR RELATÓRIO
    document.querySelector('#relatorios .form-actions button[type="button"]').addEventListener('click', async () => {
        if (typeof XLSX === 'undefined') {
            alert('Erro: Biblioteca SheetJS não está carregada. Verifique a conexão com a internet.');
            return;
        }

        const formData = new FormData(formRelatorios);
        const dataInicio = formData.get('data_inicio');
        const dataFim = formData.get('data_fim');
        const placa = formData.get('placa')?.trim().toUpperCase() || '';

        if (!dataInicio || !dataFim) {
            alert('Por favor, preencha as datas de início e fim antes de exportar.');
            return;
        }

        try {
            const response = await axios.post('/relatorios', {
                data_inicio: dataInicio,
                data_fim: dataFim,
                placa: placa
            });

            const data = response.data;
            if (data.length === 0) {
                alert('Nenhum dado encontrado para exportar no período selecionado.');
                return;
            }

            const dadosExportacao = data.map(item => ({
                'Data': item.data,
                'Placa': item.placa,
                'Motorista': item.motorista,
                'Tipo': item.tipo,
                'OC': item.oc || '',
                'Valor': parseFloat(item.valor || 0),
                'PIX': item.pix || '',
                'Favorecido': item.favorecido || '',
                'Local': item.local,
                'Defeito/Serviço': item.defeito
            }));

            const worksheet = XLSX.utils.json_to_sheet(dadosExportacao);
            const workbook = XLSX.utils.book_new();
            const wscols = [
                {wch: 12}, {wch: 10}, {wch: 20}, {wch: 15}, {wch: 15},
                {wch: 12}, {wch: 25}, {wch: 20}, {wch: 20}, {wch: 30}
            ];
            worksheet['!cols'] = wscols;
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatório Manutenções');

            const nomeArquivo = placa 
                ? `relatorio_manutencoes_${placa}_${dataInicio}_a_${dataFim}.xlsx`
                : `relatorio_manutencoes_${dataInicio}_a_${dataFim}.xlsx`;
            XLSX.writeFile(workbook, nomeArquivo);
            alert(`Relatório exportado com sucesso! ${data.length} registro(s) exportado(s).`);
        } catch (error) {
            console.error('Erro ao exportar relatório:', error);
            alert(`Erro ao exportar relatório: ${error.response?.data?.error || error.message}`);
        }
    });
const filtroListagemInput = document.getElementById('filtro-listagem');
if (filtroListagemInput) {
    filtroListagemInput.addEventListener('input', function () {
        const termo = this.value.toLowerCase();
        const linhas = document.getElementById('tabela-manutencoes').querySelectorAll('tr');
        linhas.forEach(linha => {
            const texto = linha.innerText.toLowerCase();
            linha.style.display = texto.includes(termo) ? '' : 'none';
        });
    });
}
    // EXPORTAR EXCEL (LISTAGEM COMPLETA)
    document.querySelector('#listagem .actions button:first-child').addEventListener('click', async () => {
        if (typeof XLSX === 'undefined') {
            alert('Erro: Biblioteca SheetJS não está carregada. Verifique a conexão com a internet.');
            return;
        }

        try {
            const response = await axios.get('/exportar_excel');
            const base64Data = response.data.excel_data;
            const binaryString = atob(base64Data);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            const blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const hoje = new Date().toISOString().split('T')[0];
            a.download = `manutencoes_completo_${hoje}.xlsx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            alert(`Dados exportados com sucesso! ${manutencoes.length} registro(s) exportado(s).`);
        } catch (error) {
            console.error('Erro ao exportar Excel:', error);
            alert(`Erro ao exportar Excel: ${error.response?.data?.error || error.message}`);
        }
    });


/* Remover filtro duplicado da colinha (já existe filtroColinhaInput acima) */
// Remover qualquer declaração duplicada de filtroInput ou filtroColinhaInput aqui.
    // IMPORTAR EXCEL
    document.querySelector('#listagem .actions button:last-child').addEventListener('click', () => {
        if (typeof XLSX === 'undefined') {
            alert('Erro: Biblioteca SheetJS não está carregada. Verifique a conexão com a internet.');
            return;
        }

        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.xlsx,.xls';
        input.style.display = 'none';

        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) {
                alert('Nenhum arquivo selecionado.');
                return;
            }

            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const data = new Uint8Array(event.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet);

                    if (jsonData.length === 0) {
                        alert('O arquivo Excel está vazio ou não contém dados válidos.');
                        return;
                    }

                    const requiredFields = ['data', 'placa', 'motorista', 'tipo', 'valor', 'local', 'defeito'];
                    const firstRow = jsonData[0];
                    const missingFields = requiredFields.filter(field => {
                        return !Object.keys(firstRow).some(key => key.toLowerCase().includes(field));
                    });

                    if (missingFields.length > 0) {
                        alert(`Erro: O arquivo Excel deve conter as seguintes colunas obrigatórias: ${requiredFields.join(', ')}\n\nColunas não encontradas: ${missingFields.join(', ')}`);
                        return;
                    }

                    let errosValidacao = [];
                    jsonData.forEach((item, index) => {
                        const linha = index + 2;
                        requiredFields.forEach(campo => {
                            let valor = null;
                            Object.keys(item).forEach(key => {
                                if (key.toLowerCase().includes(campo)) {
                                    valor = item[key];
                                }
                            });
                            if (!valor || valor.toString().trim() === '') {
                                errosValidacao.push(`Linha ${linha}: Campo '${campo}' está vazio`);
                            }
                        });

                        let valorCampo;
                        Object.keys(item).forEach(key => {
                            if (key.toLowerCase().includes('valor')) {
                                valorCampo = item[key];
                            }
                        });
                        if (valorCampo && (isNaN(parseFloat(valorCampo)) || parseFloat(valorCampo) < 0)) {
                            errosValidacao.push(`Linha ${linha}: Valor deve ser um número válido maior ou igual a zero`);
                        }
                    });

                    if (errosValidacao.length > 0) {
                        alert(`Erros de validação encontrados:\n\n${errosValidacao.slice(0, 10).join('\n')}${errosValidacao.length > 10 ? `\n... e mais ${errosValidacao.length - 10} erro(s)` : ''}`);
                        return;
                    }

                    if (!confirm(`Deseja importar ${jsonData.length} registro(s)? Esta operação adicionará os dados ao sistema.`)) {
                        return;
                    }

                    const fileData = btoa(String.fromCharCode.apply(null, data));
                    await axios.post('/importar_excel', {
                        file_data: `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${fileData}`
                    });

                    await carregarManutencoes();
                    alert(`Dados importados com sucesso! ${jsonData.length} registro(s) importado(s).`);
                } catch (error) {
                    console.error('Erro ao importar Excel:', error);
                    alert(`Erro ao importar Excel: ${error.response?.data?.error || error.message}`);
                }
            };
            reader.readAsArrayBuffer(file);
        };
        input.click();
    });

    

    window.copiarColinha = function(text, button) {
    navigator.clipboard.writeText(text).then(() => {
        button.textContent = '✅';
        setTimeout(() => {
            button.textContent = '📋';
        }, 2000); // Volta ao ícone original após 2 segundos
        alert('Texto copiado para a área de transferência!');
    }).catch(err => {
        console.error('Erro ao copiar para a área de transferência:', err);
        alert('Erro ao copiar o texto.');
    });
};

    carregarManutencoes();
});
