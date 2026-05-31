// =============================================
//   LucroClaro Premium — premium.js
// =============================================

// ---- Access Gate ----
const ACCESS_CODE = 'PREMIUM2025'; // Substituir por verificação real de backend

const gate = document.getElementById('accessGate');
const app  = document.getElementById('premiumApp');

document.getElementById('gateBtn').addEventListener('click', tentarAcesso);
document.getElementById('accessCode').addEventListener('keydown', e => {
  if (e.key === 'Enter') tentarAcesso();
});

function tentarAcesso() {
  const code = document.getElementById('accessCode').value.trim().toUpperCase();
  const errEl = document.getElementById('gateError');

  if (code === ACCESS_CODE) {
    gate.style.opacity = '0';
    gate.style.transition = 'opacity .4s';
    setTimeout(() => {
      gate.style.display = 'none';
      app.style.display = 'block';
      app.style.opacity = '0';
      app.style.transition = 'opacity .4s';
      requestAnimationFrame(() => { app.style.opacity = '1'; });
    }, 400);
    sessionStorage.setItem('lc_premium', '1');
  } else {
    errEl.style.display = 'block';
    document.getElementById('accessCode').value = '';
    document.getElementById('accessCode').focus();
    setTimeout(() => { errEl.style.display = 'none'; }, 3000);
  }
}

// Se já tem sessão ativa
if (sessionStorage.getItem('lc_premium') === '1') {
  gate.style.display = 'none';
  app.style.display = 'block';
}

document.getElementById('btnLogout').addEventListener('click', () => {
  sessionStorage.removeItem('lc_premium');
  location.reload();
});

// ---- Tab navigation ----
document.querySelectorAll('.pnav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.pnav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.ptab-content').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
  });
});

// ---- Chart defaults ----
const CHART_DEFAULTS = {
  color: 'rgba(255,255,255,.9)',
  gridColor: 'rgba(255,255,255,.06)',
  tooltipBg: '#1C1C16',
  gold: '#EF9F27',
  green: '#97C459',
  red: '#F09595',
  teal: '#5DCAA5',
  blue: '#85B7EB',
};

Chart.defaults.color = CHART_DEFAULTS.color;
Chart.defaults.font.family = "'DM Sans', sans-serif";

function chartBaseOptions() {
  return {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { labels: { color: 'rgba(255,255,255,.55)', font: { size: 12 } } },
      tooltip: {
        backgroundColor: CHART_DEFAULTS.tooltipBg,
        borderColor: 'rgba(255,255,255,.12)',
        borderWidth: 1,
        titleColor: '#fff',
        bodyColor: 'rgba(255,255,255,.7)',
        padding: 10,
        callbacks: {
          label: ctx => {
            const v = ctx.parsed.y ?? ctx.parsed;
            return typeof v === 'number' ? ' ' + formatBRL(v) : ' ' + v;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: { color: 'rgba(255,255,255,.4)', font: { size: 11 } },
        grid: { color: CHART_DEFAULTS.gridColor },
      },
      y: {
        ticks: { color: 'rgba(255,255,255,.4)', font: { size: 11 }, callback: v => formatBRLShort(v) },
        grid: { color: CHART_DEFAULTS.gridColor },
      }
    }
  };
}

// ---- State ----
let estado = {
  nome: '', custoDireto: 0, quantidade: 1,
  custoFixo: 0, producaoMensal: 1, precoVenda: 0,
  custoUnitario: 0, lucroUnit: 0, margemReal: 0,
};
let produtosComparados = [];
let charts = {};

// ---- Destroy & recreate chart safely ----
function destroyChart(id) {
  if (charts[id]) { charts[id].destroy(); delete charts[id]; }
}

// ===== CALCULAR TUDO =====
document.getElementById('btnCalcTudo').addEventListener('click', calcularTudo);

function calcularTudo() {
  const nome         = document.getElementById('pNome').value || 'Produto';
  const custoDireto  = parseFloat(document.getElementById('pCustoDireto').value) || 0;
  const quantidade   = parseFloat(document.getElementById('pQuantidade').value) || 1;
  const custoFixo    = parseFloat(document.getElementById('pCustoFixo').value) || 0;
  const prodMensal   = parseFloat(document.getElementById('pProducaoMensal').value) || quantidade;
  const precoVenda   = parseFloat(document.getElementById('pPrecoVenda').value) || 0;

  if (custoDireto <= 0 && precoVenda <= 0) {
    alertaPremium('Preencha pelo menos os custos e o preço de venda antes de calcular.');
    return;
  }

  const custoFixed   = prodMensal > 0 ? custoFixo / prodMensal : 0;
  const custoUnit    = (custoDireto / Math.max(quantidade, 1)) + custoFixed;
  const lucroUnit    = precoVenda - custoUnit;
  const margemReal   = precoVenda > 0 ? (lucroUnit / precoVenda) * 100 : 0;
  const lucroMensal  = lucroUnit * prodMensal;

  estado = { nome, custoDireto, quantidade, custoFixo, producaoMensal: prodMensal, precoVenda, custoUnitario: custoUnit, lucroUnit, margemReal, lucroMensal };

  renderEquilibrio();
  renderProjecao();
  renderCenarios();
  renderRelatorio();
}

// =========================================
// PONTO DE EQUILÍBRIO
// =========================================
function renderEquilibrio() {
  const { custoFixo, precoVenda, custoUnitario, producaoMensal, lucroUnit } = estado;

  const margemContrib = precoVenda - (custoUnitario - (custoFixo / Math.max(producaoMensal, 1)));
  const pe = margemContrib > 0 ? Math.ceil(custoFixo / margemContrib) : 0;
  const fatMin = pe * precoVenda;
  const porcProd = producaoMensal > 0 ? (pe / producaoMensal * 100).toFixed(1) : 0;

  document.getElementById('peUnidades').textContent  = pe > 0 ? pe.toLocaleString('pt-BR') : '—';
  document.getElementById('peFaturamento').textContent = pe > 0 ? formatBRL(fatMin) : '—';
  document.getElementById('peMargemContrib').textContent = formatBRL(margemContrib);
  document.getElementById('pePorcProd').textContent  = pe > 0 ? porcProd + '%' : '—';

  // Insight
  const insight = document.getElementById('peInsight');
  insight.classList.add('visible');
  if (pe <= 0) {
    insight.innerHTML = `⚠️ Não foi possível calcular o ponto de equilíbrio. Verifique se os custos fixos e a margem de contribuição estão corretos.`;
  } else if (pe <= producaoMensal) {
    const sobra = producaoMensal - pe;
    insight.innerHTML = `✅ Com a produção atual de <strong>${producaoMensal.toLocaleString('pt-BR')} unidades/mês</strong>, você atinge o equilíbrio vendendo <span class="highlight">${pe.toLocaleString('pt-BR')} unidades</span>. As <strong>${sobra.toLocaleString('pt-BR')} restantes</strong> geram lucro de <span class="highlight">${formatBRL(sobra * lucroUnit)}/mês</span>.`;
  } else {
    const falta = pe - producaoMensal;
    insight.innerHTML = `⚠️ Para atingir o equilíbrio você precisa vender <span class="highlight">${pe.toLocaleString('pt-BR')} unidades</span>, mas produz apenas <strong>${producaoMensal.toLocaleString('pt-BR')}/mês</strong>. Faltam <strong>${falta.toLocaleString('pt-BR')} unidades</strong>. Considere reduzir custos fixos ou aumentar o preço.`;
  }

  // Gráfico
  destroyChart('chartEquilibrio');
  const maxX = Math.max(pe * 2, producaoMensal * 1.5, 10);
  const pontos = Array.from({ length: 21 }, (_, i) => Math.round(i * maxX / 20));
  const receita = pontos.map(x => x * precoVenda);
  const custosT  = pontos.map(x => custoFixo + (custoUnitario - custoFixo / Math.max(producaoMensal,1)) * x);

  const ctx = document.getElementById('chartEquilibrio').getContext('2d');
  charts.chartEquilibrio = new Chart(ctx, {
    type: 'line',
    data: {
      labels: pontos.map(x => x.toLocaleString('pt-BR') + ' un.'),
      datasets: [
        { label: 'Receita', data: receita, borderColor: CHART_DEFAULTS.green, backgroundColor: 'rgba(151,196,89,.1)', tension: .3, fill: false, borderWidth: 2.5, pointRadius: 0 },
        { label: 'Custos totais', data: custosT, borderColor: CHART_DEFAULTS.red, backgroundColor: 'rgba(240,149,149,.1)', tension: .3, fill: false, borderWidth: 2.5, pointRadius: 0 },
      ]
    },
    options: {
      ...chartBaseOptions(),
      plugins: {
        ...chartBaseOptions().plugins,
        annotation: undefined,
        tooltip: { ...chartBaseOptions().plugins.tooltip, mode: 'index', intersect: false },
      }
    }
  });
}

// =========================================
// PROJEÇÃO
// =========================================
document.getElementById('btnProjetar').addEventListener('click', renderProjecao);

function renderProjecao() {
  const { lucroUnit, precoVenda, custoUnitario, producaoMensal, custoFixo, nome } = estado;
  const crescimento = (parseFloat(document.getElementById('projCrescimento').value) || 5) / 100;
  const meses       = parseInt(document.getElementById('projMeses').value) || 12;

  let rows = [];
  let qtdAtual = producaoMensal;
  let lucroAcum = 0;

  for (let m = 1; m <= meses; m++) {
    const faturamento = qtdAtual * precoVenda;
    const custoTotal  = custoFixo + (custoUnitario - custoFixo / Math.max(producaoMensal, 1)) * qtdAtual;
    const lucro       = faturamento - custoTotal;
    lucroAcum += lucro;
    rows.push({ mes: m, qtd: Math.round(qtdAtual), faturamento, custoTotal, lucro, lucroAcum });
    qtdAtual *= (1 + crescimento);
  }

  // Summary cards
  const totalFat  = rows.reduce((a, r) => a + r.faturamento, 0);
  const totalLucro= rows.reduce((a, r) => a + r.lucro, 0);
  const melhorMes = rows.reduce((a, r) => r.lucro > a.lucro ? r : a, rows[0]);

  const sumEl = document.getElementById('projSummary');
  sumEl.innerHTML = `
    <div class="metric-card"><span class="mc-label">Faturamento total (${meses}m)</span><span class="mc-value">${formatBRL(totalFat)}</span><span class="mc-sub">acumulado</span></div>
    <div class="metric-card"><span class="mc-label">Lucro total (${meses}m)</span><span class="mc-value ${totalLucro >= 0 ? 'accent' : ''}" style="${totalLucro < 0 ? 'color:#F09595' : ''}">${formatBRL(totalLucro)}</span><span class="mc-sub">acumulado</span></div>
    <div class="metric-card"><span class="mc-label">Melhor mês projetado</span><span class="mc-value">${formatBRL(melhorMes.lucro)}</span><span class="mc-sub">Mês ${melhorMes.mes}</span></div>
    <div class="metric-card"><span class="mc-label">Média mensal de lucro</span><span class="mc-value">${formatBRL(totalLucro / meses)}</span><span class="mc-sub">por mês</span></div>
  `;

  // Gráfico
  destroyChart('chartProjecao');
  const ctx = document.getElementById('chartProjecao').getContext('2d');
  charts.chartProjecao = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: rows.map(r => 'Mês ' + r.mes),
      datasets: [
        {
          label: 'Lucro mensal',
          data: rows.map(r => r.lucro),
          backgroundColor: rows.map(r => r.lucro >= 0 ? 'rgba(151,196,89,.7)' : 'rgba(240,149,149,.7)'),
          borderRadius: 4,
        },
        {
          label: 'Lucro acumulado',
          data: rows.map(r => r.lucroAcum),
          type: 'line',
          borderColor: CHART_DEFAULTS.gold,
          backgroundColor: 'transparent',
          tension: .3,
          borderWidth: 2.5,
          pointRadius: 0,
          yAxisID: 'y',
        }
      ]
    },
    options: {
      ...chartBaseOptions(),
      plugins: { ...chartBaseOptions().plugins, tooltip: { ...chartBaseOptions().plugins.tooltip, mode: 'index', intersect: false } }
    }
  });

  // Tabela
  const wrap = document.getElementById('projTableWrap');
  wrap.innerHTML = `
    <table class="proj-table">
      <thead><tr>
        <th>Mês</th><th>Qtd. Vendida</th><th>Faturamento</th><th>Custo Total</th><th>Lucro Mensal</th><th>Lucro Acum.</th>
      </tr></thead>
      <tbody>
        ${rows.map(r => `
          <tr>
            <td>Mês ${r.mes}</td>
            <td>${r.qtd.toLocaleString('pt-BR')}</td>
            <td>${formatBRL(r.faturamento)}</td>
            <td>${formatBRL(r.custoTotal)}</td>
            <td class="${r.lucro >= 0 ? 'td-lucro' : 'td-pej'}">${formatBRL(r.lucro)}</td>
            <td class="${r.lucroAcum >= 0 ? 'td-lucro' : 'td-pej'}">${formatBRL(r.lucroAcum)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

// =========================================
// COMPARAÇÃO
// =========================================
document.getElementById('btnAddComp').addEventListener('click', () => {
  const nome  = document.getElementById('compNome').value.trim();
  const custo = parseFloat(document.getElementById('compCusto').value);
  const preco = parseFloat(document.getElementById('compPreco').value);
  const qtd   = parseFloat(document.getElementById('compQtd').value) || 1;

  if (!nome || isNaN(custo) || isNaN(preco)) {
    alertaPremium('Preencha nome, custo unitário e preço de venda.'); return;
  }
  if (produtosComparados.length >= 5) {
    alertaPremium('Máximo de 5 produtos para comparação.'); return;
  }

  produtosComparados.push({ nome, custo, preco, qtd });
  document.getElementById('compNome').value = '';
  document.getElementById('compCusto').value = '';
  document.getElementById('compPreco').value = '';
  document.getElementById('compQtd').value = '';
  renderComparacao();
});

function renderComparacao() {
  const list = document.getElementById('compList');
  list.innerHTML = produtosComparados.map((p, i) => {
    const lucro  = p.preco - p.custo;
    const margem = p.preco > 0 ? (lucro / p.preco * 100).toFixed(1) : 0;
    const lucroMes = lucro * p.qtd;
    return `
      <div class="comp-item">
        <span class="comp-item-name">${p.nome}</span>
        <span class="comp-item-val">Custo: ${formatBRL(p.custo)}</span>
        <span class="comp-item-val">Venda: ${formatBRL(p.preco)}</span>
        <span class="comp-item-val">Lucro/mês: ${formatBRL(lucroMes)}</span>
        <span class="comp-margem-badge ${lucro >= 0 ? 'pos' : 'neg'}">${margem}%</span>
        <button class="comp-remove" data-i="${i}">✕</button>
      </div>
    `;
  }).join('');

  list.querySelectorAll('.comp-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      produtosComparados.splice(parseInt(btn.dataset.i), 1);
      renderComparacao();
    });
  });

  const area = document.getElementById('compChartArea');
  if (produtosComparados.length < 2) { area.style.display = 'none'; return; }
  area.style.display = 'block';

  const nomes   = produtosComparados.map(p => p.nome);
  const margens = produtosComparados.map(p => p.preco > 0 ? +((p.preco - p.custo) / p.preco * 100).toFixed(1) : 0);
  const lucros  = produtosComparados.map(p => (p.preco - p.custo) * p.qtd);
  const cores   = [CHART_DEFAULTS.gold, CHART_DEFAULTS.green, CHART_DEFAULTS.teal, CHART_DEFAULTS.blue, CHART_DEFAULTS.red];

  destroyChart('chartCompMargem');
  destroyChart('chartCompLucro');

  const ctx1 = document.getElementById('chartCompMargem').getContext('2d');
  charts.chartCompMargem = new Chart(ctx1, {
    type: 'bar',
    data: {
      labels: nomes,
      datasets: [{ label: 'Margem (%)', data: margens, backgroundColor: cores.slice(0, nomes.length), borderRadius: 6 }]
    },
    options: {
      ...chartBaseOptions(),
      plugins: {
        ...chartBaseOptions().plugins,
        tooltip: { ...chartBaseOptions().plugins.tooltip, callbacks: { label: ctx => ' ' + ctx.parsed.y.toFixed(1) + '%' } }
      },
      scales: {
        ...chartBaseOptions().scales,
        y: { ...chartBaseOptions().scales.y, ticks: { ...chartBaseOptions().scales.y.ticks, callback: v => v + '%' } }
      }
    }
  });

  const ctx2 = document.getElementById('chartCompLucro').getContext('2d');
  charts.chartCompLucro = new Chart(ctx2, {
    type: 'bar',
    data: {
      labels: nomes,
      datasets: [{ label: 'Lucro mensal (R$)', data: lucros, backgroundColor: cores.slice(0, nomes.length), borderRadius: 6 }]
    },
    options: chartBaseOptions()
  });

  // Ranking
  const ranked = [...produtosComparados].map(p => ({
    nome: p.nome,
    lucroMes: (p.preco - p.custo) * p.qtd,
    margem: p.preco > 0 ? (p.preco - p.custo) / p.preco * 100 : 0,
  })).sort((a, b) => b.lucroMes - a.lucroMes);

  document.getElementById('compRanking').innerHTML = `
    <p class="comp-ranking-title">🏆 Ranking por lucro mensal</p>
    ${ranked.map((p, i) => `
      <div class="rank-item">
        <span class="rank-num">#${i + 1}</span>
        <span class="rank-name">${p.nome}</span>
        <span class="rank-val">${formatBRL(p.lucroMes)}/mês</span>
      </div>
    `).join('')}
  `;
}

// =========================================
// CENÁRIOS
// =========================================
const sliders = ['sliderCustoPess', 'sliderPrecoOtim', 'sliderVolOtim'];
const labels  = ['labelCustoPess', 'labelPrecoOtim', 'labelVolOtim'];
const prefix  = ['+', '+', '+'];

sliders.forEach((id, i) => {
  document.getElementById(id).addEventListener('input', () => {
    document.getElementById(labels[i]).textContent = prefix[i] + document.getElementById(id).value + '%';
    renderCenarios();
  });
});

function renderCenarios() {
  const { custoUnitario, precoVenda, producaoMensal, custoFixo } = estado;
  if (!precoVenda) return;

  const varCustoPess = parseFloat(document.getElementById('sliderCustoPess').value) / 100;
  const varPrecoOtim = parseFloat(document.getElementById('sliderPrecoOtim').value) / 100;
  const varVolOtim   = parseFloat(document.getElementById('sliderVolOtim').value) / 100;

  const custoVar = custoUnitario - custoFixo / Math.max(producaoMensal, 1);

  const calcLucro = (custo, preco, vol) => (preco - custo - custoFixo / Math.max(vol, 1)) * vol;

  const cenarios = [
    {
      id: 'optimistic', label: '🚀 Otimista', emoji: '🟢',
      lucro: calcLucro(custoVar, precoVenda * (1 + varPrecoOtim), producaoMensal * (1 + varVolOtim)),
      desc: `Preço +${(varPrecoOtim*100).toFixed(0)}%, volume +${(varVolOtim*100).toFixed(0)}%`,
    },
    {
      id: 'realistic', label: '⚖️ Realista', emoji: '🟡',
      lucro: calcLucro(custoVar, precoVenda, producaoMensal),
      desc: `Manutenção do cenário atual`,
    },
    {
      id: 'pessimistic', label: '⚠️ Pessimista', emoji: '🔴',
      lucro: calcLucro(custoVar * (1 + varCustoPess), precoVenda, producaoMensal * (1 - varCustoPess / 2)),
      desc: `Custo +${(varCustoPess*100).toFixed(0)}%, volume -${(varCustoPess/2*100).toFixed(0)}%`,
    },
  ];

  document.getElementById('cenCards').innerHTML = cenarios.map(c => `
    <div class="cen-card ${c.id}">
      <div class="cen-card-label">${c.label}</div>
      <span class="cen-card-emoji">${c.emoji}</span>
      <div class="cen-card-lucro">${formatBRL(c.lucro)}/mês</div>
      <div class="cen-card-desc">${c.desc}</div>
    </div>
  `).join('');

  destroyChart('chartCenarios');
  const ctx = document.getElementById('chartCenarios').getContext('2d');
  charts.chartCenarios = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: cenarios.map(c => c.label),
      datasets: [{
        label: 'Lucro mensal (R$)',
        data: cenarios.map(c => c.lucro),
        backgroundColor: [CHART_DEFAULTS.green, CHART_DEFAULTS.gold, CHART_DEFAULTS.red],
        borderRadius: 8,
        borderSkipped: false,
      }]
    },
    options: {
      ...chartBaseOptions(),
      indexAxis: 'y',
      scales: {
        x: { ...chartBaseOptions().scales.x },
        y: { ticks: { color: 'rgba(255,255,255,.6)', font: { size: 12 } }, grid: { display: false } }
      }
    }
  });
}

// =========================================
// RELATÓRIO
// =========================================
function renderRelatorio() {
  const { nome, custoUnitario, precoVenda, producaoMensal, custoFixo, lucroUnit, margemReal, lucroMensal } = estado;

  const now = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  const hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  // Equilíbrio
  const custoVar    = custoUnitario - custoFixo / Math.max(producaoMensal, 1);
  const margemContrib = precoVenda - custoVar;
  const pe          = margemContrib > 0 ? Math.ceil(custoFixo / margemContrib) : 0;

  // Cenários
  const varPess = parseFloat(document.getElementById('sliderCustoPess').value) / 100;
  const varOtim = parseFloat(document.getElementById('sliderPrecoOtim').value) / 100;
  const varVol  = parseFloat(document.getElementById('sliderVolOtim').value) / 100;
  const calcLucro = (custo, preco, vol) => (preco - custo - custoFixo / Math.max(vol, 1)) * vol;

  const lucroOtim = calcLucro(custoVar, precoVenda * (1 + varOtim), producaoMensal * (1 + varVol));
  const lucroReal = calcLucro(custoVar, precoVenda, producaoMensal);
  const lucroPess = calcLucro(custoVar * (1 + varPess), precoVenda, producaoMensal * (1 - varPess / 2));

  const html = `
    <div class="rel-doc">
      <div class="rel-doc-header">
        <div>
          <div class="rel-doc-logo">◈ LucroClaro Premium</div>
          <div style="font-size:.8rem;color:var(--text-muted);margin-top:.25rem">Relatório de análise financeira</div>
        </div>
        <div class="rel-doc-meta">
          Gerado em ${now} às ${hora}<br>
          Produto: <strong style="color:var(--text-light)">${nome}</strong>
        </div>
      </div>

      <p class="rel-section-title">Resumo do produto</p>
      <table class="rel-table">
        <tbody>
          <tr><td class="td-label">Custo unitário</td><td>${formatBRL(custoUnitario)}</td></tr>
          <tr><td class="td-label">Preço de venda</td><td>${formatBRL(precoVenda)}</td></tr>
          <tr><td class="td-label">Lucro por unidade</td><td class="${lucroUnit >= 0 ? 'td-pos' : 'td-neg'}">${formatBRL(lucroUnit)}</td></tr>
          <tr><td class="td-label">Margem de lucro real</td><td class="${margemReal >= 0 ? 'td-pos' : 'td-neg'}">${margemReal.toFixed(1)}%</td></tr>
          <tr><td class="td-label">Produção mensal</td><td>${producaoMensal.toLocaleString('pt-BR')} unidades</td></tr>
          <tr><td class="td-label">Lucro mensal</td><td class="${lucroMensal >= 0 ? 'td-pos' : 'td-neg'}">${formatBRL(lucroMensal)}</td></tr>
        </tbody>
      </table>

      <p class="rel-section-title">Ponto de equilíbrio</p>
      <table class="rel-table">
        <tbody>
          <tr><td class="td-label">Margem de contribuição unitária</td><td class="td-gold">${formatBRL(margemContrib)}</td></tr>
          <tr><td class="td-label">Ponto de equilíbrio</td><td class="td-gold">${pe > 0 ? pe.toLocaleString('pt-BR') + ' unidades' : 'Não calculável'}</td></tr>
          <tr><td class="td-label">Faturamento mínimo necessário</td><td>${formatBRL(pe * precoVenda)}</td></tr>
          <tr><td class="td-label">% da produção necessária</td><td>${producaoMensal > 0 ? (pe / producaoMensal * 100).toFixed(1) + '%' : '—'}</td></tr>
        </tbody>
      </table>

      <p class="rel-section-title">Simulação de cenários (lucro mensal)</p>
      <table class="rel-table">
        <thead><tr><th>Cenário</th><th>Parâmetros</th><th>Lucro Mensal</th><th>Lucro Anual Projetado</th></tr></thead>
        <tbody>
          <tr><td>🚀 Otimista</td><td>Preço +${(varOtim*100).toFixed(0)}%, volume +${(varVol*100).toFixed(0)}%</td><td class="td-pos">${formatBRL(lucroOtim)}</td><td class="td-pos">${formatBRL(lucroOtim * 12)}</td></tr>
          <tr><td>⚖️ Realista</td><td>Cenário atual mantido</td><td class="${lucroReal >= 0 ? 'td-pos' : 'td-neg'}">${formatBRL(lucroReal)}</td><td class="${lucroReal >= 0 ? 'td-pos' : 'td-neg'}">${formatBRL(lucroReal * 12)}</td></tr>
          <tr><td>⚠️ Pessimista</td><td>Custo +${(varPess*100).toFixed(0)}%, volume -${(varPess/2*100).toFixed(0)}%</td><td class="td-neg">${formatBRL(lucroPess)}</td><td class="td-neg">${formatBRL(lucroPess * 12)}</td></tr>
        </tbody>
      </table>

      <div style="margin-top:2rem;padding-top:1rem;border-top:1px solid var(--dark-border-2);font-size:.75rem;color:var(--text-faint)">
        Relatório gerado automaticamente pelo LucroClaro Premium. Os valores são baseados nos dados inseridos pelo usuário e devem ser usados como referência, não como garantia financeira.
      </div>
    </div>
  `;

  document.getElementById('relContent').innerHTML = html;
}

// =========================================
// EXPORTAR PDF
// =========================================
document.getElementById('btnExportPDF').addEventListener('click', () => {
  const { nome, custoUnitario, precoVenda, producaoMensal, custoFixo, lucroUnit, margemReal, lucroMensal } = estado;
  if (!precoVenda) { alertaPremium('Calcule os dados antes de exportar.'); return; }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const W = 210; const M = 18;
  let y = 20;

  // Background
  doc.setFillColor(13, 13, 8);
  doc.rect(0, 0, W, 297, 'F');

  // Header bar
  doc.setFillColor(186, 117, 23);
  doc.rect(0, 0, W, 12, 'F');

  // Logo
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('◈ LUCROCLARO PREMIUM', M, 8);

  const now = new Date().toLocaleDateString('pt-BR');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(now, W - M, 8, { align: 'right' });

  y = 26;
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(239, 159, 39);
  doc.text('Relatório de Análise', M, y);
  y += 7;
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text(nome, M, y);
  y += 12;

  // Divider
  doc.setDrawColor(50, 50, 40);
  doc.line(M, y, W - M, y);
  y += 8;

  function sectionTitle(title) {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(186, 117, 23);
    doc.text(title.toUpperCase(), M, y);
    y += 6;
  }

  function row(label, value, colorHex) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(140, 135, 128);
    doc.text(label, M, y);
    doc.setFont('helvetica', 'bold');
    if (colorHex) { const r = parseInt(colorHex.slice(1,3),16), g = parseInt(colorHex.slice(3,5),16), b = parseInt(colorHex.slice(5,7),16); doc.setTextColor(r,g,b); }
    else doc.setTextColor(255, 255, 255);
    doc.text(value, W - M, y, { align: 'right' });
    y += 6;
  }

  sectionTitle('Resumo do produto');
  row('Custo unitário', formatBRL(custoUnitario));
  row('Preço de venda', formatBRL(precoVenda));
  row('Lucro por unidade', formatBRL(lucroUnit), lucroUnit >= 0 ? '#97C459' : '#F09595');
  row('Margem real', margemReal.toFixed(1) + '%', margemReal >= 0 ? '#97C459' : '#F09595');
  row('Produção mensal', producaoMensal.toLocaleString('pt-BR') + ' unidades');
  row('Lucro mensal', formatBRL(lucroMensal), lucroMensal >= 0 ? '#97C459' : '#F09595');
  y += 4;

  // Equilíbrio
  const custoVar = custoUnitario - custoFixo / Math.max(producaoMensal, 1);
  const mc = precoVenda - custoVar;
  const pe = mc > 0 ? Math.ceil(custoFixo / mc) : 0;

  doc.setDrawColor(50, 50, 40);
  doc.line(M, y, W - M, y);
  y += 8;
  sectionTitle('Ponto de equilíbrio');
  row('Margem de contribuição', formatBRL(mc), '#EF9F27');
  row('Ponto de equilíbrio', pe > 0 ? pe + ' unidades' : '—', '#EF9F27');
  row('Faturamento mínimo', formatBRL(pe * precoVenda));
  y += 4;

  // Cenários
  const vP = parseFloat(document.getElementById('sliderCustoPess').value) / 100;
  const vO = parseFloat(document.getElementById('sliderPrecoOtim').value) / 100;
  const vV = parseFloat(document.getElementById('sliderVolOtim').value) / 100;
  const cL = (cu, pr, vol) => (pr - cu - custoFixo / Math.max(vol, 1)) * vol;

  doc.line(M, y, W - M, y); y += 8;
  sectionTitle('Simulação de cenários');
  row('🚀 Otimista (lucro/mês)', formatBRL(cL(custoVar, precoVenda*(1+vO), producaoMensal*(1+vV))), '#97C459');
  row('⚖️  Realista (lucro/mês)', formatBRL(cL(custoVar, precoVenda, producaoMensal)), lucroMensal >= 0 ? '#EF9F27' : '#F09595');
  row('⚠️  Pessimista (lucro/mês)', formatBRL(cL(custoVar*(1+vP), precoVenda, producaoMensal*(1-vP/2))), '#F09595');

  // Footer
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 55);
  doc.text('Gerado pelo LucroClaro Premium · Uso exclusivo do assinante · Os dados são baseados nas informações inseridas pelo usuário.', W / 2, 290, { align: 'center' });

  doc.save(`LucroClaro_${nome.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.pdf`);
});

// =========================================
// EXPORTAR EXCEL
// =========================================
document.getElementById('btnExportExcel').addEventListener('click', () => {
  const { nome, custoUnitario, precoVenda, producaoMensal, custoFixo, lucroUnit, margemReal, lucroMensal } = estado;
  if (!precoVenda) { alertaPremium('Calcule os dados antes de exportar.'); return; }

  const wb = XLSX.utils.book_new();

  // Aba 1: Resumo
  const resumoData = [
    ['LucroClaro Premium — Relatório de Análise'],
    ['Produto:', nome],
    ['Gerado em:', new Date().toLocaleDateString('pt-BR')],
    [],
    ['RESUMO DO PRODUTO'],
    ['Métrica', 'Valor'],
    ['Custo unitário', custoUnitario],
    ['Preço de venda', precoVenda],
    ['Lucro por unidade', lucroUnit],
    ['Margem real (%)', +(margemReal.toFixed(2))],
    ['Produção mensal (unidades)', producaoMensal],
    ['Lucro mensal', lucroMensal],
    [],
    ['PONTO DE EQUILÍBRIO'],
    ['Margem de contribuição', precoVenda - (custoUnitario - custoFixo / Math.max(producaoMensal, 1))],
    ['Ponto de equilíbrio (unidades)', (() => { const mc = precoVenda - (custoUnitario - custoFixo / Math.max(producaoMensal, 1)); return mc > 0 ? Math.ceil(custoFixo / mc) : 0; })()],
    ['Faturamento mínimo necessário', (() => { const mc = precoVenda - (custoUnitario - custoFixo / Math.max(producaoMensal, 1)); return mc > 0 ? Math.ceil(custoFixo / mc) * precoVenda : 0; })()],
  ];

  const wsResumo = XLSX.utils.aoa_to_sheet(resumoData);
  XLSX.utils.book_append_sheet(wb, wsResumo, 'Resumo');

  // Aba 2: Projeção 12 meses
  const crescimento = (parseFloat(document.getElementById('projCrescimento').value) || 5) / 100;
  const projRows = [['Mês', 'Quantidade', 'Faturamento (R$)', 'Custo Total (R$)', 'Lucro Mensal (R$)', 'Lucro Acumulado (R$)']];
  let qtd = producaoMensal, acum = 0;
  for (let m = 1; m <= 12; m++) {
    const fat = qtd * precoVenda;
    const ct  = custoFixo + (custoUnitario - custoFixo / Math.max(producaoMensal,1)) * qtd;
    const lm  = fat - ct;
    acum += lm;
    projRows.push([`Mês ${m}`, Math.round(qtd), +fat.toFixed(2), +ct.toFixed(2), +lm.toFixed(2), +acum.toFixed(2)]);
    qtd *= (1 + crescimento);
  }
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(projRows), 'Projeção 12 meses');

  // Aba 3: Cenários
  const vP = parseFloat(document.getElementById('sliderCustoPess').value) / 100;
  const vO = parseFloat(document.getElementById('sliderPrecoOtim').value) / 100;
  const vV = parseFloat(document.getElementById('sliderVolOtim').value) / 100;
  const cv = custoUnitario - custoFixo / Math.max(producaoMensal, 1);
  const cL = (cu, pr, vol) => (pr - cu - custoFixo / Math.max(vol, 1)) * vol;
  const cenariosData = [
    ['Cenário', 'Preço Utilizado', 'Volume', 'Lucro Mensal (R$)', 'Lucro Anual (R$)'],
    ['Otimista',  precoVenda*(1+vO), Math.round(producaoMensal*(1+vV)), +cL(cv,precoVenda*(1+vO),producaoMensal*(1+vV)).toFixed(2), +(cL(cv,precoVenda*(1+vO),producaoMensal*(1+vV))*12).toFixed(2)],
    ['Realista',  precoVenda, producaoMensal, +cL(cv,precoVenda,producaoMensal).toFixed(2), +(cL(cv,precoVenda,producaoMensal)*12).toFixed(2)],
    ['Pessimista', precoVenda, Math.round(producaoMensal*(1-vP/2)), +cL(cv*(1+vP),precoVenda,producaoMensal*(1-vP/2)).toFixed(2), +(cL(cv*(1+vP),precoVenda,producaoMensal*(1-vP/2))*12).toFixed(2)],
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(cenariosData), 'Cenários');

  // Aba 4: Comparação (se houver)
  if (produtosComparados.length > 0) {
    const compData = [['Produto', 'Custo Unit.', 'Preço Venda', 'Qtd/mês', 'Lucro Unit.', 'Margem (%)', 'Lucro Mensal']];
    produtosComparados.forEach(p => {
      const lu = p.preco - p.custo;
      compData.push([p.nome, p.custo, p.preco, p.qtd, +lu.toFixed(2), +(lu/p.preco*100).toFixed(1), +(lu*p.qtd).toFixed(2)]);
    });
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(compData), 'Comparação');
  }

  XLSX.writeFile(wb, `LucroClaro_${nome.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.xlsx`);
});

// =========================================
// UTILS
// =========================================
function formatBRL(v) {
  return (v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatBRLShort(v) {
  if (Math.abs(v) >= 1000) return 'R$ ' + (v / 1000).toFixed(1).replace('.', ',') + 'k';
  return 'R$ ' + v.toFixed(0);
}

function alertaPremium(msg) {
  const el = document.createElement('div');
  el.style.cssText = `
    position: fixed; top: 80px; left: 50%; transform: translateX(-50%);
    background: #1C1C16; color: #FAC775; border: 1px solid rgba(186,117,23,.4);
    padding: .75rem 1.5rem; border-radius: 10px; font-size: .9rem;
    font-weight: 500; z-index: 9999; box-shadow: 0 8px 32px rgba(0,0,0,.4);
    font-family: 'DM Sans', sans-serif; max-width: 360px; text-align: center;
  `;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => { el.style.opacity='0'; el.style.transition='opacity .3s'; setTimeout(()=>el.remove(),300); }, 3000);
}

