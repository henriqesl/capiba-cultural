const UsuarioService = require('./src/services/UsuarioService');
const CaravanaService = require('./src/services/CaravanaService');
const EventoService = require('./src/services/EventoService');
const GrupoService = require('./src/services/GrupoService');
const ReporteService = require('./src/services/ReporteService');

const usuarioService = new UsuarioService();
const caravanaService = new CaravanaService();
const eventoService = new EventoService();
const grupoService = new GrupoService();
const reporteService = new ReporteService(eventoService);

console.log('=== USUÁRIOS ===');
const lucas = usuarioService.criarUsuario('Lucas', 'lucas@email.com', '123456');
const ana = usuarioService.criarUsuario('Ana', 'ana@email.com', 'abcdef');

usuarioService.listarUsuarios().forEach(u => {
    console.log(`ID: ${u.id}, Nome: ${u.nome}, Saldo: ${u.saldoMoedaCapiba}`);
});

console.log('\n=== EVENTOS ===');
const eventoCapiba = eventoService.criarEvento(
    'Festival Capiba',
    'Recife Antigo',
    '2025-11-20',
    'Celebração cultural com apresentações e oficinas'
);

const eventoTalentos = eventoService.criarEvento(
    'Mostra de Talentos',
    'Olinda',
    '2025-12-10',
    'Apresentações artísticas e culturais'
);

console.log('Eventos cadastrados:');
eventoService.listarEventos().forEach(e => {
    console.log(`ID: ${e.id}, Nome: ${e.nome}, Local: ${e.local}, Data: ${e.data.toISOString().slice(0,10)}, Oficial: ${e.reportadoPorUsuario ? '❌' : '✅'}`);
});

console.log('\n=== CARAVANA ===');
const caravanaRecife = caravanaService.criarCaravana('Caravana Recife', eventoCapiba);
caravanaService.adicionarMembro(caravanaRecife.id, lucas);
caravanaService.adicionarMembro(caravanaRecife.id, ana);

console.log(`Caravana criada: ${caravanaRecife.nome}`);
console.log(`Evento destino: ${caravanaRecife.eventoDestino?.nome || 'Nenhum'}`);
console.log('Membros:');
caravanaRecife.membros.forEach(u => console.log(`- ${u.nome}`));

console.log('\n=== GRUPOS DE COMPETIÇÃO ===');
const grupo1 = grupoService.criarGrupo('Desafio Cultural', '2025-10-01', '2025-11-30');
grupoService.adicionarMembro(grupo1.id, lucas);
grupoService.adicionarMembro(grupo1.id, ana);

console.log(`Grupo criado: ${grupo1.nome}`);
console.log('Membros:');
grupo1.membros.forEach(u => console.log(`- ${u.nome}`));

console.log('\n=== ATUALIZANDO PONTUAÇÃO ===');
usuarioService.adicionarMoedas(lucas.id, 300);
usuarioService.adicionarMoedas(ana.id, 150);

grupoService.atualizarPontuacoes();
console.log(`Pontuação total do grupo "${grupo1.nome}": ${grupo1.pontuacaoTotal}`);

console.log('\n=== ENCERRANDO GRUPO ===');
const resultado = grupoService.encerrarGrupo(grupo1.id);
console.log('Grupo encerrado com sucesso:');
console.log(`Nome: ${resultado.nome}`);
console.log(`Pontuação Total: ${resultado.pontuacaoTotal}`);
console.log(`Vencedor: ${resultado.vencedor?.nome || '---'}`);

console.log('\n=== REPORTES ===');

// Lucas reporta evento oficial
console.log(reporteService.criarOuConfirmarReporte(lucas, { id: eventoCapiba.id }, 'Evento ao vivo!').mensagem);

// Ana confirma o mesmo evento
console.log(reporteService.criarOuConfirmarReporte(ana, { id: eventoCapiba.id }).mensagem);

// Usuário reporta evento novo (não oficial)
console.log(reporteService.criarOuConfirmarReporte(lucas, { nome: 'Festival Alternativo', local: 'Recife' }).mensagem);

console.log('\nLista de reportes:');
reporteService.listarReportes().forEach(r => {
    console.log(`Evento: ${r.evento.nome}, Oficial: ${r.evento.reportadoPorUsuario ? '❌' : '✅'}, Confirmações: ${r.qtdConfirmacoes}`);
});

console.log('\n=== RESUMO FINAL ===');

console.log('Usuários:');
usuarioService.listarUsuarios().forEach(u => console.log(`- ${u.nome}, Moedas: ${u.saldoMoedaCapiba}`));

console.log('\nGrupos:');
grupoService.listarGrupos().forEach(g => console.log(`- ${g.nome}, Encerrado: ${g.encerrado}, Vencedor: ${g.vencedor?.nome || '---'}`));

console.log('\nEventos:');
eventoService.listarEventos().forEach(e => {
    console.log(`- ${e.nome}, Local: ${e.local}, Oficial: ${e.reportadoPorUsuario ? '❌' : '✅'}`);
});

console.log('\nCaravanas:');
caravanaService.listarCaravanas().forEach(c => {
    console.log(`- ${c.nome}, Evento: ${c.eventoDestino?.nome || '---'}`);
});