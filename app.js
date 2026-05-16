// =============================================
//   LucroClaro — app.js
// =============================================

const PRODUTOS = {
  peixe: {
    icon: '🐟', nome: 'Peixes', subtitulo: 'Calcule o custo por quilo ou unidade',
    unidades: ['kg', 'un'],
    labelQuantidade: 'Quantidade produzida (kg)',
    labelProducaoMensal: 'Produção mensal total (kg)',
    labelPrecoVenda: 'Preço de venda por kg (R$)',
    custosPadrao: [
      { nome: 'Alevinos / reprodutores', valor: '' },
      { nome: 'Ração', valor: '' },
      { nome: 'Energia elétrica (bomba, aerador)', valor: '' },
      { nome: 'Mão de obra', valor: '' },
      { nome: 'Embalagem', valor: '' },
      { nome: 'Transporte / frete', valor: '' },
    ]
  },
  ovo: {
    icon: '🥚', nome: 'Ovos', subtitulo: 'Calcule o custo por dúzia ou unidade',
    unidades: ['dz', 'un'],
    labelQuantidade: 'Quantidade produzida (dúzias)',
    labelProducaoMensal: 'Produção mensal total (dúzias)',
    labelPrecoVenda: 'Preço de venda por dúzia (R$)',
    custosPadrao: [
      { nome: 'Pintinhos / galinhas poedeiras', valor: '' },
      { nome: 'Ração', valor: '' },
      { nome: 'Vacinas / medicamentos', valor: '' },
      { nome: 'Mão de obra', valor: '' },
      { nome: 'Embalagem (caixinhas/bandejas)', valor: '' },
    ]
  },
  galinha: {
    icon: '🐓', nome: 'Galinhas', subtitulo: 'Calcule o custo por ave ou por quilo',
    unidades: ['un', 'kg'],
    labelQuantidade: 'Quantidade de aves produzidas',
    labelProducaoMensal: 'Total de aves por mês',
    labelPrecoVenda: 'Preço de venda por ave (R$)',
    custosPadrao: [
      { nome: 'Pintinhos / matrizes', valor: '' },
      { nome: 'Ração', valor: '' },
      { nome: 'Vacinas / medicamentos', valor: '' },
      { nome: 'Mão de obra', valor: '' },
      { nome: 'Abate e embalagem', valor: '' },
      { nome: 'Transporte', valor: '' },
    ]
  },
  mel: {
    icon: '🍯', nome: 'Mel', subtitulo: 'Calcule o custo por quilo ou frasco',
    unidades: ['kg', 'un'],
    labelQuantidade: 'Quantidade produzida (kg)',
    labelProducaoMensal: 'Produção mensal total (kg)',
    labelPrecoVenda: 'Preço de venda por kg (R$)',
    custosPadrao: [
      { nome: 'Colmeias e equipamentos (depreciação)', valor: '' },
      { nome: 'Alimentação suplementar', valor: '' },
      { nome: 'EPI e materiais de extração', valor: '' },
      { nome: 'Mão de obra', valor: '' },
      { nome: 'Frascos e embalagem', valor: '' },
    ]
  },
  hortalica: {
    icon: '🥬', nome: 'Hortaliças', subtitulo: 'Calcule o custo por kg ou maço',
    unidades: ['kg', 'un'],
    labelQuantidade: 'Quantidade produzida (kg)',
    labelProducaoMensal: 'Produção mensal total (kg)',
    labelPrecoVenda: 'Preço de venda por kg (R$)',
    custosPadrao: [
      { nome: 'Sementes / mudas', valor: '' },
      { nome: 'Adubo e insumos', valor: '' },
      { nome: 'Irrigação (água e energia)', valor: '' },
      { nome: 'Mão de obra', valor: '' },
      { nome: 'Embalagem', valor: '' },
      { nome: 'Transporte / feira', valor: '' },
    ]
  },
  programador: {
    icon: '💻', nome: 'Programador', subtitulo: 'Calcule o valor justo da sua hora',
    unidades: ['h', 'consulta'],
    labelQuantidade: 'Horas disponíveis para venda/mês',
    labelProducaoMensal: 'Horas totais disponíveis/mês',
    labelPrecoVenda: 'Valor cobrado por hora (R$)',
    custosPadrao: [
      { nome: 'Custo mensal de vida (aluguel, alimentação, etc.)', valor: '' },
      { nome: 'Internet e ferramentas (SaaS, IDE, etc.)', valor: '' },
      { nome: 'Hardware / depreciação equipamentos', valor: '' },
      { nome: 'Impostos / MEI / contador', valor: '' },
      { nome: 'Plano de saúde', valor: '' },
      { nome: 'Cursos e atualização profissional', valor: '' },
    ]
  },
  nutricionista: {
    icon: '🥗', nome: 'Nutricionista', subtitulo: 'Calcule o valor justo da sua consulta',
    unidades: ['consulta', 'h'],
    labelQuantidade: 'Consultas realizadas por mês',
    labelProducaoMensal: 'Total de consultas/mês',
    labelPrecoVenda: 'Valor cobrado por consulta (R$)',
    custosPadrao: [
      { nome: 'Aluguel do consultório', valor: '' },
      { nome: 'Custo mensal pessoal (vida)', valor: '' },
      { nome: 'Material de escritório / softwares', valor: '' },
      { nome: 'Impostos / CRN / anuidade', valor: '' },
      { nome: 'Plano de saúde', valor: '' },
      { nome: 'Cursos e pós-graduação', valor: '' },
    ]
  },
  advogado: {
    icon: '⚖️', nome: 'Advogado', subtitulo: 'Calcule o valor justo por hora ou processo',
    unidades: ['h', 'consulta'],
    labelQuantidade: 'Horas faturáveis por mês',
    labelProducaoMensal: 'Total de horas/mês',
    labelPrecoVenda: 'Valor cobrado por hora (R$)',
    custosPadrao: [
      { nome: 'Aluguel e escritório', valor: '' },
      { nome: 'Custo mensal pessoal (vida)', valor: '' },
      { nome: 'Anuidade OAB e seguros', valor: '' },
      { nome: 'Impostos e contador', valor: '' },
      { nome: 'Softwares jurídicos', valor: '' },
      { nome: 'Cursos / pós / congressos', valor: '' },
    ]
  },
  designer: {
    icon: '🎨', nome: 'Designer', subtitulo: 'Calcule o valor justo do seu projeto ou hora',
    unidades: ['h', 'consulta'],
    labelQuantidade: 'Horas faturáveis por mês',
    labelProducaoMensal: 'Total de horas/mês',
    labelPrecoVenda: 'Valor cobrado por hora (R$)',
    custosPadrao: [
      { nome: 'Custo mensal pessoal (vida)', valor: '' },
      { nome: 'Softwares (Adobe, Figma, etc.)', valor: '' },
      { nome: 'Hardware / depreciação equipamentos', valor: '' },
      { nome: 'Impostos / MEI / contador', valor: '' },
      { nome: 'Cursos e referências', valor: '' },
    ]
  },
  autonomo: {
    icon: '🔧', nome: 'Autônomo geral', subtitulo: 'Calcule o custo da sua hora ou serviço',
    unidades: ['h', 'un'],
    labelQuantidade: 'Horas ou serviços por mês',
    labelProducaoMensal: 'Total de horas/serviços por mês',
    labelPrecoVenda: 'Valor cobrado por hora/serviço (R$)',
    custosPadrao: [
      { nome: 'Custo mensal pessoal (vida)', valor: '' },
      { nome: 'Ferramentas e materiais', valor: '' },
      { nome: 'Transporte', valor: '' },
      { nome: 'Impostos / MEI', valor: '' },
      { nome: 'Celular / internet', valor: '' },
    ]
  },
};

// =============================================
// State
// =============================================
let produtoAtual = 'peixe';
let historico = [];
let custoExtras = [];

// =============================================
// DOM refs
// =============================================
const $ = id => document.getElementById(id);

// =============================================
// Init
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  carregarProduto('peixe');

  // Product buttons
  document.querySelectorAll('.product-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.product-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      carregarProduto(btn.dataset.product);
    });
  });

  $('btnCalcular').addEventListener('click', calcular);
  $('btnLimpar').addEventListener('click', limpar);
  $('btnAddCusto').addEventListener('click', adicionarCustoExtra);
  $('btnClearHist').addEventListener('click', limparHistorico);

  // Mobile menu (basic toggle)
  $('btnMenu').addEventListener('click', () => {
    const nav = document.querySelector('.nav');
    nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
    nav.style.flexDirection = 'column';
    nav.style.position = 'absolute';
    nav.style.top = '62px';
    nav.style.left = '0';
    nav.style.right = '0';
    nav.style.background = 'var(--paper)';
    nav.style.padding = '1rem 1.25rem';
    nav.style.borderBottom = '1px solid var(--gray-100)';
    nav.style.zIndex = '99';
  });
});

// =============================================
// Carrega produto
// =============================================
function carregarProduto(key) {
  produtoAtual = key;
  const p = PRODUTOS[key];
  custoExtras = [];

  $('calcIcon').textContent = p.icon;
  $('calcTitle').textContent = p.nome;
  $('calcSubtitle').textContent = p.subtitulo;
  $('labelQuantidade').textContent = p.labelQuantidade;
  $('labelProducaoMensal').textContent = p.labelProducaoMensal;
  $('labelPrecoVenda').textContent = p.labelPrecoVenda;

  // Render custos padrão
  renderCustos(p.custosPadrao);

  // Reset campos numéricos
  $('quantidade').value = '';
  $('custoFixo').value = '';
  $('producaoMensal').value = '';
  $('precoVenda').value = '';
  $('margemDesejada').value = '';

  // Esconder resultado
  $('resultado').style.display = 'none';
}

// =============================================
// Renderiza custos
// =============================================
function renderCustos(custosPadrao) {
  const container = $('custosDinamicos');
  container.innerHTML = '';

  const todos = [...custosPadrao, ...custoExtras];
  todos.forEach((c, i) => {
    const div = document.createElement('div');
    div.className = 'custo-item';
    div.innerHTML = `
      <input type="text" class="form-input custo-nome" placeholder="Nome do custo" value="${c.nome}" data-index="${i}">
      <input type="number" class="form-input custo-valor" placeholder="R$ 0,00" value="${c.valor}" min="0" step="0.01" data-index="${i}">
      <button type="button" class="custo-remove" data-index="${i}" aria-label="Remover custo">✕</button>
    `;
    container.appendChild(div);
  });

  // Listeners remover
  container.querySelectorAll('.custo-remove').forEach(btn => {
    btn.addEventListener('click', () => removerCusto(parseInt(btn.dataset.index)));
  });
}

function removerCusto(index) {
  const p = PRODUTOS[produtoAtual];
  const padraoLen = p.custosPadrao.length;
  if (index < padraoLen) {
    p.custosPadrao.splice(index, 1);
  } else {
    custoExtras.splice(index - padraoLen, 1);
  }
  renderCustos(p.custosPadrao);
}

function adicionarCustoExtra() {
  custoExtras.push({ nome: '', valor: '' });
  renderCustos(PRODUTOS[produtoAtual].custosPadrao);
  // Focus no novo campo
  const inputs = document.querySelectorAll('.custo-nome');
  if (inputs.length) inputs[inputs.length - 1].focus();
}

// =============================================
// Coleta valores dos custos do DOM
// =============================================
function coletarCustos() {
  const nomes = document.querySelectorAll('.custo-nome');
  const valores = document.querySelectorAll('.custo-valor');
  let total = 0;
  const detalhes = [];
  nomes.forEach((n, i) => {
    const v = parseFloat(valores[i].value) || 0;
    total += v;
    if (v > 0) detalhes.push({ nome: n.value || 'Custo', valor: v });
  });
  return { total, detalhes };
}

// =============================================
// Calcular
// =============================================
function calcular() {
  const quantidade = parseFloat($('quantidade').value);
  const custoFixoMensal = parseFloat($('custoFixo').value) || 0;
  const producaoMensal = parseFloat($('producaoMensal').value) || 1;
  const precoVenda = parseFloat($('precoVenda').value);
  const margemDesejada = parseFloat($('margemDesejada').value) || 0;

  if (!quantidade || quantidade <= 0) {
    alertaErro('Por favor, informe a quantidade produzida.');
    return;
  }

  const { total: custoDireto } = coletarCustos();

  // Rateio do custo fixo por unidade
  const custoFixoPorUnidade = producaoMensal > 0 ? (custoFixoMensal / producaoMensal) * quantidade / quantidade : 0;

  const custoTotalUnidade = (custoDireto / quantidade) + custoFixoPorUnidade;

  // Resultado
  $('resultado').style.display = 'block';
  $('rcCustoUnit').textContent = formatBRL(custoTotalUnidade);

  let veredictoClass, veredictoIcon, veredictoTitulo, veredictoMsg;

  if (!precoVenda || precoVenda <= 0) {
    // Modo: só calcula custo, sugere preço
    $('rcPrecoVenda').textContent = 'Não informado';
    $('rcDestaqueLabel').textContent = 'Custo unitário';
    $('rcDestaqueValue').textContent = formatBRL(custoTotalUnidade);
    $('rcDestaque').className = 'resultado-card resultado-card-destaque';
    $('rcMargem').textContent = '— %';

    veredictoClass = 'equilibrio';
    veredictoIcon = '📊';
    veredictoTitulo = 'Custo calculado!';
    veredictoMsg = `Seu custo unitário é <strong>${formatBRL(custoTotalUnidade)}</strong>. Informe um preço de venda para ver se você terá lucro ou prejuízo.`;

    // Sugerir preço com margem desejada
    if (margemDesejada > 0) {
      const precoSug = custoTotalUnidade / (1 - margemDesejada / 100);
      mostrarPrecoSugerido(precoSug, margemDesejada);
    } else {
      $('precoSugerido').style.display = 'none';
    }

  } else {
    const lucroUnit = precoVenda - custoTotalUnidade;
    const margemReal = precoVenda > 0 ? (lucroUnit / precoVenda) * 100 : 0;

    $('rcPrecoVenda').textContent = formatBRL(precoVenda);
    $('rcDestaqueLabel').textContent = lucroUnit >= 0 ? 'Lucro por unidade' : 'Prejuízo por unidade';
    $('rcDestaqueValue').textContent = formatBRL(Math.abs(lucroUnit));
    $('rcMargem').textContent = margemReal.toFixed(1) + '%';

    if (lucroUnit > 0.005) {
      $('rcDestaque').className = 'resultado-card resultado-card-destaque lucro';
      veredictoClass = 'lucro';
      veredictoIcon = '✅';
      veredictoTitulo = 'Você está no lucro!';
      veredictoMsg = `Com o preço de venda de <strong>${formatBRL(precoVenda)}</strong>, você ganha <strong>${formatBRL(lucroUnit)}</strong> por unidade, uma margem real de <strong>${margemReal.toFixed(1)}%</strong>.`;
    } else if (lucroUnit < -0.005) {
      $('rcDestaque').className = 'resultado-card resultado-card-destaque prejuizo';
      veredictoClass = 'prejuizo';
      veredictoIcon = '⚠️';
      veredictoTitulo = 'Atenção: você está no prejuízo!';
      veredictoMsg = `Com o preço de venda de <strong>${formatBRL(precoVenda)}</strong>, você perde <strong>${formatBRL(Math.abs(lucroUnit))}</strong> por unidade. Seu custo real é <strong>${formatBRL(custoTotalUnidade)}</strong>.`;
    } else {
      $('rcDestaque').className = 'resultado-card resultado-card-destaque';
      veredictoClass = 'equilibrio';
      veredictoIcon = '⚖️';
      veredictoTitulo = 'Você está no equilíbrio';
      veredictoMsg = `Seu preço de venda cobre exatamente os custos, mas não gera lucro. Para prosperar, considere aumentar o preço.`;
    }

    // Preço sugerido se houver margem desejada
    if (margemDesejada > 0) {
      const precoSug = custoTotalUnidade / (1 - margemDesejada / 100);
      if (Math.abs(precoSug - precoVenda) > 0.01) {
        mostrarPrecoSugerido(precoSug, margemDesejada);
      } else {
        $('precoSugerido').style.display = 'none';
      }
    } else {
      $('precoSugerido').style.display = 'none';
    }

    // Adicionar ao histórico
    adicionarHistorico({
      produto: produtoAtual,
      lucro: lucroUnit,
      margem: margemReal,
      custo: custoTotalUnidade,
      preco: precoVenda,
    });
  }

  // Veredicto
  const v = $('veredicto');
  v.className = `resultado-veredicto ${veredictoClass}`;
  v.innerHTML = `
    <span class="veredicto-icon">${veredictoIcon}</span>
    <div class="veredicto-texto">
      <strong>${veredictoTitulo}</strong>
      <p>${veredictoMsg}</p>
    </div>
  `;

  // Premium card (ponto de equilíbrio desbloqueado fake)
  if (precoVenda > 0 && custoFixoMensal > 0) {
    $('premiumCard').style.display = 'block';
    // Calcular valores borrados
    const pe = Math.ceil(custoFixoMensal / Math.max(precoVenda - custoTotalUnidade, 0.01));
    const fatMin = (pe * precoVenda).toFixed(0);
    const fatMensal = (producaoMensal * precoVenda).toFixed(0);
    $('premiumCard').querySelector('.premium-blur-values').innerHTML = `
      <div class="premium-blur-item">
        <span>Ponto de equilíbrio</span>
        <span class="blur-value">${pe} unid.</span>
      </div>
      <div class="premium-blur-item">
        <span>Faturamento mínimo</span>
        <span class="blur-value">R$ ${Number(fatMin).toLocaleString('pt-BR')}</span>
      </div>
      <div class="premium-blur-item">
        <span>Projeção mensal (${producaoMensal} unid.)</span>
        <span class="blur-value">R$ ${Number(fatMensal).toLocaleString('pt-BR')}</span>
      </div>
    `;
  } else {
    $('premiumCard').style.display = 'none';
  }

  // Scroll suave para resultado
  setTimeout(() => {
    $('resultado').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);
}

// =============================================
// Preço sugerido
// =============================================
function mostrarPrecoSugerido(preco, margem) {
  const el = $('precoSugerido');
  el.style.display = 'block';
  el.innerHTML = `
    💡 Para atingir sua margem desejada de <strong>${margem}%</strong>, o preço de venda sugerido é <strong>${formatBRL(preco)}</strong>.
  `;
}

// =============================================
// Histórico
// =============================================
function adicionarHistorico(item) {
  const p = PRODUTOS[item.produto];
  historico.unshift({
    ...item,
    icon: p.icon,
    nome: p.nome,
    hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
  });

  if (historico.length > 10) historico.pop();

  renderHistorico();
  $('historicoSection').style.display = 'block';
}

function renderHistorico() {
  const list = $('historicoList');
  list.innerHTML = historico.map(h => `
    <div class="hist-item">
      <span class="hist-icon">${h.icon}</span>
      <div class="hist-name">${h.nome} — custo ${formatBRL(h.custo)} · venda ${formatBRL(h.preco)}</div>
      <span class="hist-margem ${h.lucro >= 0 ? 'lucro' : 'prejuizo'}">
        ${h.lucro >= 0 ? '+' : ''}${h.margem.toFixed(1)}%
      </span>
      <span class="hist-date">${h.hora}</span>
    </div>
  `).join('');
}

function limparHistorico() {
  historico = [];
  $('historicoList').innerHTML = '';
  $('historicoSection').style.display = 'none';
}

// =============================================
// Limpar
// =============================================
function limpar() {
  $('quantidade').value = '';
  $('custoFixo').value = '';
  $('producaoMensal').value = '';
  $('precoVenda').value = '';
  $('margemDesejada').value = '';
  document.querySelectorAll('.custo-valor').forEach(i => i.value = '');
  $('resultado').style.display = 'none';
}

// =============================================
// Alerta erro
// =============================================
function alertaErro(msg) {
  const el = document.createElement('div');
  el.style.cssText = `
    position: fixed; top: 80px; left: 50%; transform: translateX(-50%);
    background: var(--red-50); color: var(--red-800); border: 1.5px solid var(--red-100);
    padding: .75rem 1.5rem; border-radius: var(--radius-md); font-size: .9rem;
    font-weight: 500; z-index: 999; box-shadow: var(--shadow-lg);
    font-family: var(--font-body);
  `;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

// =============================================
// Format
// =============================================
function formatBRL(v) {
  return (v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
