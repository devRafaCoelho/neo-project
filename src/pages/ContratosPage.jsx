import { useCallback, useState } from 'react';
import {
  Box, Card, CardContent, Typography, TextField,
  MenuItem, Chip, Collapse, FormControlLabel,
  Stack, Switch, LinearProgress, Tooltip, Button,
  TablePagination, useMediaQuery, useTheme,
} from '@mui/material';
import {
  Description, Warning, AccessTime, AttachMoney,
  ExpandLess, ExpandMore,
} from '@mui/icons-material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartTooltip,
  ResponsiveContainer,
} from 'recharts';
import { contratos, contratosPorStatus, vencimentosPorMes } from '../data/mockData';
import { SortableTableHeadCell } from '../components/table/SortableTableHeadCell';
import { useTableSort } from '../hooks/useTableSort';

const CONTRATO_SORT_COLUMNS = {
  id: { type: 'string' },
  fornecedor: { type: 'string' },
  empresa: { type: 'string' },
  objeto: { type: 'string' },
  status: { type: 'string' },
  estrategia: { type: 'string' },
  saldo: { type: 'number' },
  percentualUtilizado: { type: 'number' },
  vencimento: { type: 'date' },
  responsavel: { type: 'string' },
};

const CONTRATO_TABLE_COLUMNS = [
  { id: 'id', label: 'ID' },
  { id: 'fornecedor', label: 'Fornecedor' },
  { id: 'empresa', label: 'Empresa' },
  { id: 'objeto', label: 'Objeto' },
  { id: 'status', label: 'Status' },
  { id: 'estrategia', label: 'Estratégia' },
  { id: 'saldo', label: 'Saldo Disp.' },
  { id: 'percentualUtilizado', label: '% Utilizado' },
  { id: 'vencimento', label: 'Vencimento' },
  { id: 'responsavel', label: 'Responsável' },
];

const kpiGridSx = {
  display: 'grid',
  gap: 3,
  gridTemplateColumns: {
    xs: '1fr',
    sm: 'repeat(2, minmax(0, 1fr))',
    lg: 'repeat(4, minmax(0, 1fr))',
  },
};

const filterGridSx = {
  display: 'grid',
  gap: 2,
  mb: 3,
  gridTemplateColumns: {
    xs: '1fr',
    sm: 'repeat(2, minmax(0, 1fr))',
  },
};

const tableTdSx = {
  p: '10px 16px',
  fontSize: '0.82rem',
  whiteSpace: 'nowrap',
};

const statusColor = (s) => {
  if (s === 'Ativo') return 'success';
  if (s === 'Em Alerta') return 'warning';
  if (s === 'A Vencer') return 'error';
  return 'default';
};

const progressBarColor = (percentual) => {
  if (percentual > 80) return '#E3850D';
  if (percentual > 60) return '#00A443';
  return '#26BF64';
};

function KpiCard({ icon, label, value, sub, color }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
          <Box sx={{ bgcolor: `${color}.main`, borderRadius: 2, p: 1, display: 'flex', color: 'white' }}>
            {icon}
          </Box>
          <Typography variant="h4" fontWeight={800}>{value}</Typography>
        </Box>
        <Typography variant="body2" fontWeight={600}>{label}</Typography>
        {sub && <Typography variant="caption" color="text.secondary">{sub}</Typography>}
      </CardContent>
    </Card>
  );
}

function SectionTitle({ children }) {
  return (
    <Typography variant="h6" fontWeight={700} color="primary.dark" sx={{ mb: 2 }}>
      {children}
    </Typography>
  );
}

function UtilizadoBar({ percentual }) {
  return (
    <Tooltip title={`${percentual}% utilizado`}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 100 }}>
        <LinearProgress
          variant="determinate"
          value={percentual}
          sx={{
            flex: 1,
            height: 8,
            borderRadius: 4,
            bgcolor: '#DCEBE1',
            '& .MuiLinearProgress-bar': {
              bgcolor: progressBarColor(percentual),
            },
          }}
        />
        <Typography variant="caption" sx={{ whiteSpace: 'nowrap', fontWeight: 700, minWidth: 32 }}>
          {percentual}%
        </Typography>
      </Box>
    </Tooltip>
  );
}

function ContratoListCard({ contrato, expanded, onToggle }) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderColor: expanded ? 'primary.main' : 'divider',
        bgcolor: expanded ? '#F7FCF9' : 'background.paper',
        transition: 'border-color 0.2s, background-color 0.2s',
      }}
    >
      <Box
        onClick={onToggle}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1.5,
          p: 2,
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle2" fontWeight={700} color="primary.dark">
            {contrato.id}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {contrato.fornecedor} — {contrato.empresa}
          </Typography>
        </Box>
        <Chip
          label={contrato.status}
          size="small"
          color={statusColor(contrato.status)}
          sx={{ fontWeight: 600, fontSize: '0.75rem', flexShrink: 0 }}
        />
        {expanded ? <ExpandLess color="primary" /> : <ExpandMore color="action" />}
      </Box>
      <Collapse in={expanded}>
        <Box
          sx={{
            px: 2,
            pb: 2,
            pt: 2.5,
            display: 'flex',
            flexDirection: 'column',
            gap: 1.25,
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          {[
            ['Objeto', contrato.objeto],
            ['Estratégia', contrato.estrategia],
            [
              'Saldo disponível',
              contrato.saldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
            ],
            ['Responsável', contrato.responsavel],
            [
              'Vencimento',
              new Date(contrato.vencimento).toLocaleDateString('pt-BR'),
            ],
          ].map(([label, value]) => (
            <Box
              key={label}
              sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}
            >
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                {label}
              </Typography>
              <Typography variant="body2" fontWeight={500} textAlign="right">
                {value}
              </Typography>
            </Box>
          ))}
          <Box sx={{ pt: 0.5 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 0.5, display: 'block' }}>
              % Utilizado
            </Typography>
            <UtilizadoBar percentual={contrato.percentualUtilizado} />
          </Box>
        </Box>
      </Collapse>
    </Card>
  );
}

function ContratoTableRow({ contrato, index }) {
  return (
    <Box
      component="tr"
      sx={{
        bgcolor: index % 2 === 0 ? 'white' : '#F0F7F3',
        '&:hover': { bgcolor: '#DCEBE1' },
      }}
    >
      <Box component="td" sx={{ ...tableTdSx, color: 'primary.dark', fontWeight: 700 }}>
        {contrato.id}
      </Box>
      <Box component="td" sx={tableTdSx}>{contrato.fornecedor}</Box>
      <Box component="td" sx={{ ...tableTdSx, fontSize: '0.78rem' }}>{contrato.empresa}</Box>
      <Box component="td" sx={{ ...tableTdSx, whiteSpace: 'normal', maxWidth: 200 }}>
        {contrato.objeto}
      </Box>
      <Box component="td" sx={tableTdSx}>
        <Chip label={contrato.status} size="small" color={statusColor(contrato.status)} sx={{ fontWeight: 600 }} />
      </Box>
      <Box component="td" sx={tableTdSx}>
        <Chip label={contrato.estrategia} size="small" variant="outlined" />
      </Box>
      <Box component="td" sx={{ ...tableTdSx, fontWeight: 600 }}>
        {contrato.saldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
      </Box>
      <Box component="td" sx={{ ...tableTdSx, minWidth: 120 }}>
        <UtilizadoBar percentual={contrato.percentualUtilizado} />
      </Box>
      <Box component="td" sx={{ ...tableTdSx, color: 'text.secondary' }}>
        {new Date(contrato.vencimento).toLocaleDateString('pt-BR')}
      </Box>
      <Box component="td" sx={tableTdSx}>{contrato.responsavel}</Box>
    </Box>
  );
}

export default function ContratosPage() {
  const theme = useTheme();
  const isTabletOrMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [listVisibleCount, setListVisibleCount] = useState(3);
  const [filtroStatus, setFiltroStatus] = useState('Todos');
  const [filtroEmpresa, setFiltroEmpresa] = useState('');
  const [modoLista, setModoLista] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const showTable = !isTabletOrMobile || !modoLista;
  const showList = isTabletOrMobile && modoLista;

  const filtrados = contratos.filter((c) => {
    const matchStatus = filtroStatus === 'Todos' || c.status === filtroStatus;
    const matchEmp = !filtroEmpresa || c.empresa.toLowerCase().includes(filtroEmpresa.toLowerCase());
    return matchStatus && matchEmp;
  });

  const resetPage = useCallback(() => setPage(0), []);
  const { sortedRows: filtradosOrdenados, orderBy, order, requestSort } = useTableSort(
    filtrados,
    CONTRATO_SORT_COLUMNS,
    { onSortChange: resetPage },
  );

  const paginados = filtradosOrdenados.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const listaFiltrada = filtrados.slice(0, listVisibleCount);
  const hasMoreListItems = listVisibleCount < filtrados.length;

  const handleToggleCard = (id) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  const totalFixo = contratos.reduce((s, c) => s + c.valorFixo, 0);
  const totalVariavel = contratos.reduce((s, c) => s + c.valorVariavel, 0);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} color="primary.dark">Gestão de Contratos</Typography>
        <Typography variant="body2" color="text.secondary">
          Acompanhe o status e saldo dos contratos Neoenergia Telecom
        </Typography>
      </Box>

      {/* KPIs */}
      <Box sx={{ ...kpiGridSx, mb: 4 }}>
        <KpiCard icon={<Description />} label="Contratos Ativos" value={271} sub="Em todas as empresas" color="primary" />
        <KpiCard icon={<Warning />} label="Saldo Alto Consumo (>70%)" value={58} sub="Necessitam atenção" color="warning" />
        <KpiCard icon={<AccessTime />} label="A Vencer (1–3 meses)" value={43} sub="Aguardam renovação" color="error" />
        <KpiCard
          icon={<AttachMoney />}
          label="Valor Total Fixo"
          value={`R$ ${(totalFixo / 1_000_000).toFixed(1)} Mi`}
          sub={`Variável: R$ ${(totalVariavel / 1_000_000).toFixed(1)} Mi`}
          color="secondary"
        />
      </Box>

      {/* Gráficos — largura total */}
      <Stack spacing={3} sx={{ mb: 4 }}>
        <Card>
          <CardContent sx={{ p: 3 }}>
            <SectionTitle>Contratos por Status</SectionTitle>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={contratosPorStatus} layout="vertical" margin={{ left: 10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E0EAE5" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="status" tick={{ fontSize: 12 }} width={90} />
                <RechartTooltip />
                <Bar dataKey="quantidade" name="Qtd" fill="#00A443" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ p: 3 }}>
            <SectionTitle>Vencimentos por Mês</SectionTitle>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={vencimentosPorMes} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0EAE5" />
                <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <RechartTooltip />
                <Bar dataKey="quantidade" name="Contratos" fill="#E3850D" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Stack>

      {/* Contratos detalhados */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <SectionTitle>Contratos Detalhados</SectionTitle>

          <Box sx={filterGridSx}>
            <TextField
              label="Filtrar por Status"
              select
              size="small"
              fullWidth
              value={filtroStatus}
              onChange={(e) => {
                setFiltroStatus(e.target.value);
                setPage(0);
                setListVisibleCount(3);
                setExpandedId(null);
              }}
            >
              <MenuItem value="Todos">Todos</MenuItem>
              <MenuItem value="Ativo">Ativo</MenuItem>
              <MenuItem value="Em Alerta">Em Alerta</MenuItem>
              <MenuItem value="A Vencer">A Vencer</MenuItem>
            </TextField>
            <TextField
              label="Filtrar por Empresa"
              size="small"
              fullWidth
              value={filtroEmpresa}
              onChange={(e) => {
                setFiltroEmpresa(e.target.value);
                setPage(0);
                setListVisibleCount(3);
                setExpandedId(null);
              }}
              placeholder="Digite o nome da empresa"
            />
          </Box>

          {isTabletOrMobile && filtrados.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', mb: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={modoLista}
                    onChange={(e) => {
                      setModoLista(e.target.checked);
                      setExpandedId(null);
                      setPage(0);
                    }}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2" fontWeight={600}>
                    {modoLista ? 'Modo lista' : 'Modo tabela'}
                  </Typography>
                }
                labelPlacement="end"
                sx={{ m: 0 }}
              />
            </Box>
          )}

          {filtrados.length === 0 && (
            <Typography align="center" sx={{ py: 4, color: 'text.secondary' }}>
              Nenhum contrato encontrado.
            </Typography>
          )}

          {filtrados.length > 0 && showList && (
            <Stack spacing={1.5} sx={{ mb: 2 }}>
              {listaFiltrada.map((c) => (
                <ContratoListCard
                  key={c.id}
                  contrato={c}
                  expanded={expandedId === c.id}
                  onToggle={() => handleToggleCard(c.id)}
                />
              ))}
              {hasMoreListItems && (
                <Box sx={{ display: 'flex', justifyContent: 'center', pt: 0.5 }}>
                  <Button
                    variant="text"
                    onClick={() =>
                      setListVisibleCount((current) =>
                        Math.min(current + 3, filtrados.length)
                      )
                    }
                    sx={{ fontWeight: 700 }}
                  >
                    Mostrar mais
                  </Button>
                </Box>
              )}
            </Stack>
          )}

          {filtrados.length > 0 && showTable && (
            <Box sx={{ overflowX: 'auto', border: '1px solid', borderColor: 'divider', mb: 1 }}>
              <Box
                component="table"
                sx={{
                  width: 'max-content',
                  minWidth: '100%',
                  borderCollapse: 'collapse',
                }}
              >
                <Box component="thead">
                  <Box component="tr">
                    {CONTRATO_TABLE_COLUMNS.map((col) => (
                      <SortableTableHeadCell
                        key={col.id}
                        columnId={col.id}
                        label={col.label}
                        active={orderBy === col.id}
                        direction={order}
                        onSort={requestSort}
                      />
                    ))}
                  </Box>
                </Box>
                <Box component="tbody">
                  {paginados.map((c, i) => (
                    <ContratoTableRow key={c.id} contrato={c} index={i} />
                  ))}
                </Box>
              </Box>
            </Box>
          )}

          {filtrados.length > 0 && showTable && (
            <TablePagination
              component="div"
              count={filtrados.length}
              page={page}
              onPageChange={(_, p) => setPage(p)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 25]}
              labelRowsPerPage="Linhas por página:"
              labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
              sx={{
                '& .MuiTablePagination-toolbar': {
                  px: { xs: 1, sm: 2 },
                  display: { xs: 'grid', sm: 'flex' },
                  gridTemplateColumns: { xs: 'auto auto 1fr auto', sm: 'none' },
                  gridTemplateAreas: {
                    xs: '"label input . rows" ". . . actions"',
                    sm: 'none',
                  },
                  alignItems: 'center',
                  columnGap: { xs: 1, sm: 0 },
                  rowGap: { xs: 0.75, sm: 0 },
                },
                '& .MuiTablePagination-spacer': {
                  display: { xs: 'none', sm: 'block' },
                },
                '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                  margin: 0,
                },
                '& .MuiTablePagination-selectLabel': {
                  gridArea: { xs: 'label', sm: 'auto' },
                  justifySelf: { xs: 'start', sm: 'auto' },
                },
                '& .MuiTablePagination-input': {
                  gridArea: { xs: 'input', sm: 'auto' },
                  justifySelf: { xs: 'start', sm: 'auto' },
                },
                '& .MuiTablePagination-displayedRows': {
                  gridArea: { xs: 'rows', sm: 'auto' },
                  justifySelf: { xs: 'center', sm: 'auto' },
                  textAlign: { xs: 'center', sm: 'inherit' },
                },
                '& .MuiTablePagination-actions': {
                  gridArea: { xs: 'actions', sm: 'auto' },
                  justifySelf: { xs: 'center', sm: 'auto' },
                  marginLeft: { xs: 0, sm: 'auto' },
                },
                '& .MuiTablePagination-actions .MuiIconButton-root': {
                  color: 'text.secondary',
                },
                '& .MuiTablePagination-actions .MuiIconButton-root.Mui-disabled': {
                  color: 'text.disabled',
                  opacity: 0.75,
                },
              }}
            />
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
