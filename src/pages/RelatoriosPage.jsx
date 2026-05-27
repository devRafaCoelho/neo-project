import { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, TextField,
  MenuItem, Button, Chip, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper,
} from '@mui/material';
import { Assessment, FileDownload, Search } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { empresas, contratos } from '../data/mockData';

const tiposRelatorio = ['OPEX', 'CAPEX', 'IFRS16'];
const statusOptions = ['Todos', 'Aprovada', 'Pendente', 'Rejeitada'];

const gerarDados = (tipo, empresa) => {
  const base = [
    { id: 'R-001', empresa: 'Neoenergia Coelba', fornecedor: 'JR Teletrica', conta: '230L', tipo: 'OPEX', valor: 1100, desvio: -300, status: 'Aprovada', mes: 'Mai/26' },
    { id: 'R-002', empresa: 'Neoenergia Elektro', fornecedor: 'Mgitech', conta: '220M', tipo: 'CAPEX', valor: 45000, desvio: 0, status: 'Pendente', mes: 'Mai/26' },
    { id: 'R-003', empresa: 'Neoenergia Pernambuco', fornecedor: 'Telespazio', conta: '230D', tipo: 'OPEX', valor: 8500, desvio: -200, status: 'Aprovada', mes: 'Abr/26' },
    { id: 'R-004', empresa: 'Neoenergia Brasília', fornecedor: 'Telefônica', conta: '2311', tipo: 'IFRS16', valor: 48000, desvio: 0, status: 'Aprovada', mes: 'Abr/26' },
    { id: 'R-005', empresa: 'Neoenergia Coelba', fornecedor: 'Ericsson', conta: '2393', tipo: 'CAPEX', valor: 380000, desvio: -50000, status: 'Pendente', mes: 'Mai/26' },
    { id: 'R-006', empresa: 'Neoenergia Cosern', fornecedor: 'Nokia', conta: '230L', tipo: 'OPEX', valor: 7200, desvio: 800, status: 'Aprovada', mes: 'Mar/26' },
    { id: 'R-007', empresa: 'Neoenergia Pernambuco', fornecedor: 'Huawei', conta: '220M', tipo: 'CAPEX', valor: 128000, desvio: -12000, status: 'Rejeitada', mes: 'Mar/26' },
    { id: 'R-008', empresa: 'Neoenergia Brasília', fornecedor: 'Digitech', conta: '230D', tipo: 'OPEX', valor: 3400, desvio: 0, status: 'Aprovada', mes: 'Fev/26' },
  ];
  return base.filter((r) => {
    const matchTipo = !tipo || r.tipo === tipo;
    const matchEmp = !empresa || r.empresa === empresa;
    return matchTipo && matchEmp;
  });
};

export default function RelatoriosPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [tipo, setTipo] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [status, setStatus] = useState('Todos');
  const [mesInicio, setMesInicio] = useState('');
  const [mesFim, setMesFim] = useState('');
  const [dados, setDados] = useState(null);

  const handleFiltrar = () => {
    const resultado = gerarDados(tipo, empresa).filter(
      (r) => status === 'Todos' || r.status === status,
    );
    setDados(resultado);
  };

  const handleExportar = () => {
    if (!dados || dados.length === 0) {
      enqueueSnackbar('Filtre os dados antes de exportar.', { variant: 'warning' });
      return;
    }
    enqueueSnackbar(`Relatório exportado com sucesso! ${dados.length} registros.`, {
      variant: 'success',
      autoHideDuration: 4000,
    });
  };

  const totalValor = dados?.reduce((s, r) => s + r.valor, 0) ?? 0;
  const totalDesvio = dados?.reduce((s, r) => s + r.desvio, 0) ?? 0;

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} color="primary.dark">Relatórios</Typography>
        <Typography variant="body2" color="text.secondary">Consulte e exporte relatórios de OPEX, CAPEX e IFRS16</Typography>
      </Box>

      {/* Filtros */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={700} color="primary.dark" sx={{ mb: 2 }}>Filtros</Typography>
          <Grid container spacing={2.5} alignItems="flex-end">
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Tipo"
                select
                fullWidth
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                {tiposRelatorio.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Empresa"
                select
                fullWidth
                value={empresa}
                onChange={(e) => setEmpresa(e.target.value)}
              >
                <MenuItem value="">Todas</MenuItem>
                {empresas.map((e) => <MenuItem key={e.id} value={e.nome}>{e.nome}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                label="Status"
                select
                fullWidth
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {statusOptions.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={3} md={2}>
              <TextField
                label="Mês Início"
                type="month"
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
                value={mesInicio}
                onChange={(e) => setMesInicio(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={3} md={2}>
              <TextField
                label="Mês Fim"
                type="month"
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
                value={mesFim}
                onChange={(e) => setMesFim(e.target.value)}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', gap: 2, mt: 3, flexWrap: 'wrap' }}>
            <Button variant="contained" startIcon={<Search />} onClick={handleFiltrar}>
              Filtrar
            </Button>
            {dados && (
              <Button variant="outlined" startIcon={<FileDownload />} onClick={handleExportar}>
                Exportar Excel
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Resultados */}
      {dados && (
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 2 }}>
              <Typography variant="h6" fontWeight={700} color="primary.dark">
                Resultados — {dados.length} registros
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Chip
                  label={`Total: ${totalValor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`}
                  color="primary"
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
                <Chip
                  label={`Desvio: ${totalDesvio >= 0 ? '+' : ''}${totalDesvio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`}
                  color={totalDesvio < 0 ? 'error' : totalDesvio > 0 ? 'success' : 'default'}
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
              </Box>
            </Box>

            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {['ID', 'Empresa', 'Fornecedor', 'Tipo', 'Conta', 'Mês', 'Valor (R$)', 'Desvio (R$)', 'Status'].map((h) => (
                      <TableCell key={h}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dados.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                        Nenhum registro encontrado para os filtros selecionados.
                      </TableCell>
                    </TableRow>
                  ) : (
                    dados.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell sx={{ fontWeight: 600, color: 'primary.dark' }}>{row.id}</TableCell>
                        <TableCell>{row.empresa}</TableCell>
                        <TableCell>{row.fornecedor}</TableCell>
                        <TableCell>
                          <Chip label={row.tipo} size="small" color={row.tipo === 'OPEX' ? 'default' : row.tipo === 'CAPEX' ? 'primary' : 'secondary'} />
                        </TableCell>
                        <TableCell>{row.conta}</TableCell>
                        <TableCell>{row.mes}</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>
                          {row.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: 700, color: row.desvio < 0 ? 'error.main' : row.desvio > 0 ? 'success.main' : 'text.secondary' }}
                        >
                          {row.desvio > 0 ? '+' : ''}{row.desvio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={row.status}
                            size="small"
                            color={row.status === 'Aprovada' ? 'success' : row.status === 'Pendente' ? 'warning' : 'error'}
                            sx={{ fontWeight: 600 }}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {!dados && (
        <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
          <Assessment sx={{ fontSize: 80, opacity: 0.2, mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Selecione os filtros e clique em Filtrar
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Os resultados aparecerão aqui
          </Typography>
        </Box>
      )}
    </Box>
  );
}
