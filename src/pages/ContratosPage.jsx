import { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, TextField,
  MenuItem, Button, Chip, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper,
  TablePagination, LinearProgress, Tooltip,
} from '@mui/material';
import { Description, Warning, AccessTime, AttachMoney } from '@mui/icons-material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartTooltip,
  Legend, ResponsiveContainer,
} from 'recharts';
import { contratos, contratosPorStatus, vencimentosPorMes } from '../data/mockData';
import { useSnackbar } from 'notistack';

const statusColor = (s) => {
  if (s === 'Ativo') return 'success';
  if (s === 'Em Alerta') return 'warning';
  if (s === 'A Vencer') return 'error';
  return 'default';
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

export default function ContratosPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filtroStatus, setFiltroStatus] = useState('');
  const [filtroEmpresa, setFiltroEmpresa] = useState('');

  const filtrados = contratos.filter((c) => {
    const matchStatus = !filtroStatus || c.status === filtroStatus;
    const matchEmp = !filtroEmpresa || c.empresa.includes(filtroEmpresa);
    return matchStatus && matchEmp;
  });

  const paginados = filtrados.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const totalFixo = contratos.reduce((s, c) => s + c.valorFixo, 0);
  const totalVariavel = contratos.reduce((s, c) => s + c.valorVariavel, 0);
  const percMedio = Math.round(contratos.reduce((s, c) => s + c.percentualUtilizado, 0) / contratos.length);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} color="primary.dark">Gestão de Contratos</Typography>
        <Typography variant="body2" color="text.secondary">Acompanhe o status e saldo dos contratos Neoenergia Telecom</Typography>
      </Box>

      {/* KPIs */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard icon={<Description />} label="Contratos Ativos" value={271} sub="Em todas as empresas" color="primary" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard icon={<Warning />} label="Saldo Alto Consumo (>70%)" value={58} sub="Necessitam atenção" color="warning" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard icon={<AccessTime />} label="A Vencer (1–3 meses)" value={43} sub="Aguardam renovação" color="error" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            icon={<AttachMoney />}
            label="Valor Total Fixo"
            value={`R$ ${(totalFixo / 1_000_000).toFixed(1)} Mi`}
            sub={`Variável: R$ ${(totalVariavel / 1_000_000).toFixed(1)} Mi`}
            color="secondary"
          />
        </Grid>
      </Grid>

      {/* Gráficos */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} color="primary.dark" sx={{ mb: 2 }}>
                Contratos por Status
              </Typography>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={contratosPorStatus} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="status" tick={{ fontSize: 12 }} width={90} />
                  <RechartTooltip />
                  <Bar dataKey="quantidade" name="Qtd" fill="#00A443" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} color="primary.dark" sx={{ mb: 2 }}>
                Vencimentos por Mês
              </Typography>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={vencimentosPorMes} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0EAE5" />
                  <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <RechartTooltip />
                  <Bar dataKey="quantidade" name="Contratos" fill="#E3850D" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabela de Contratos */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={700} color="primary.dark" sx={{ mb: 2 }}>
            Contratos Detalhados
          </Typography>

          {/* Filtros da tabela */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Filtrar por Status"
                select
                size="small"
                fullWidth
                value={filtroStatus}
                onChange={(e) => { setFiltroStatus(e.target.value); setPage(0); }}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="Ativo">Ativo</MenuItem>
                <MenuItem value="Em Alerta">Em Alerta</MenuItem>
                <MenuItem value="A Vencer">A Vencer</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Filtrar por Empresa"
                size="small"
                fullWidth
                value={filtroEmpresa}
                onChange={(e) => { setFiltroEmpresa(e.target.value); setPage(0); }}
                placeholder="Digite o nome da empresa"
              />
            </Grid>
          </Grid>

          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {['ID', 'Fornecedor', 'Empresa', 'Objeto', 'Status', 'Estratégia', 'Saldo Disp.', '% Utilizado', 'Vencimento', 'Responsável'].map((h) => (
                    <TableCell key={h} sx={{ whiteSpace: 'nowrap' }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      Nenhum contrato encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginados.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell sx={{ fontWeight: 700, color: 'primary.dark', whiteSpace: 'nowrap' }}>{c.id}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>{c.fornecedor}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap', fontSize: '0.78rem' }}>{c.empresa}</TableCell>
                      <TableCell sx={{ maxWidth: 180 }}>{c.objeto}</TableCell>
                      <TableCell>
                        <Chip label={c.status} size="small" color={statusColor(c.status)} sx={{ fontWeight: 600 }} />
                      </TableCell>
                      <TableCell>
                        <Chip label={c.estrategia} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 600 }}>
                        {c.saldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </TableCell>
                      <TableCell sx={{ minWidth: 110 }}>
                        <Tooltip title={`${c.percentualUtilizado}% utilizado`}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={c.percentualUtilizado}
                              sx={{
                                flex: 1,
                                height: 8,
                                borderRadius: 4,
                                bgcolor: '#DCEBE1',
                                '& .MuiLinearProgress-bar': {
                                  bgcolor: c.percentualUtilizado > 80 ? '#E3850D' : c.percentualUtilizado > 60 ? '#00A443' : '#26BF64',
                                },
                              }}
                            />
                            <Typography variant="caption" sx={{ whiteSpace: 'nowrap', fontWeight: 700, minWidth: 32 }}>
                              {c.percentualUtilizado}%
                            </Typography>
                          </Box>
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap', color: 'text.secondary', fontSize: '0.82rem' }}>
                        {new Date(c.vencimento).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap', fontSize: '0.82rem' }}>{c.responsavel}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filtrados.length}
            page={page}
            onPageChange={(_, p) => setPage(p)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage="Linhas por página:"
            labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
          />
        </CardContent>
      </Card>
    </Box>
  );
}
