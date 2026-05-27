import { useState } from 'react';
import {
  Box, Card, CardContent, Typography, TextField,
  MenuItem, Button, Chip, Collapse, FormControlLabel,
  Stack, Switch, useMediaQuery, useTheme,
} from '@mui/material';
import {
  Assessment, ExpandLess, ExpandMore, FileDownload, Search,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { empresas } from '../data/mockData';
import MonthPickerField from '../components/form/MonthPickerField';

const tiposRelatorio = ['OPEX', 'CAPEX', 'IFRS16'];
const statusOptions = ['Todos', 'Aprovada', 'Pendente', 'Rejeitada'];

const filterGridSx = {
  display: 'grid',
  gap: 2.5,
  gridTemplateColumns: {
    xs: '1fr',
    sm: 'repeat(2, minmax(0, 1fr))',
    lg: 'repeat(3, minmax(0, 1fr))',
    xl: 'repeat(5, minmax(0, 1fr))',
  },
};

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

function statusChipColor(status) {
  if (status === 'Aprovada') return 'success';
  if (status === 'Pendente') return 'warning';
  return 'error';
}

function tipoChipColor(tipo) {
  if (tipo === 'CAPEX') return 'primary';
  if (tipo === 'IFRS16') return 'secondary';
  return 'default';
}

function formatDesvio(desvio) {
  const formatted = desvio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  return `${desvio > 0 ? '+' : ''}${formatted}`;
}

function RelatorioListCard({ row, expanded, onToggle }) {
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
            {row.id}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {row.empresa}
          </Typography>
        </Box>
        <Chip
          label={row.status}
          size="small"
          color={statusChipColor(row.status)}
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
            ['Fornecedor', row.fornecedor],
            ['Tipo', row.tipo],
            ['Conta', row.conta],
            ['Mês', row.mes],
            [
              'Valor',
              row.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
            ],
            ['Desvio', formatDesvio(row.desvio)],
          ].map(([label, value]) => (
            <Box
              key={label}
              sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}
            >
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                {label}
              </Typography>
              <Typography
                variant="body2"
                fontWeight={label === 'Desvio' ? 700 : 500}
                textAlign="right"
                color={
                  label === 'Desvio'
                    ? row.desvio < 0
                      ? 'error.main'
                      : row.desvio > 0
                        ? 'success.main'
                        : 'text.primary'
                    : 'text.primary'
                }
              >
                {value}
              </Typography>
            </Box>
          ))}
        </Box>
      </Collapse>
    </Card>
  );
}

const TABLE_HEADERS = [
  'ID', 'Empresa', 'Fornecedor', 'Tipo', 'Conta', 'Mês', 'Valor (R$)', 'Desvio (R$)', 'Status',
];

export default function RelatoriosPage() {
  const theme = useTheme();
  const isTabletOrMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const { enqueueSnackbar } = useSnackbar();
  const [tipo, setTipo] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [status, setStatus] = useState('Todos');
  const [mesInicio, setMesInicio] = useState('');
  const [mesFim, setMesFim] = useState('');
  const [dados, setDados] = useState(null);
  const [modoLista, setModoLista] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const showTable = !isTabletOrMobile || !modoLista;
  const showList = isTabletOrMobile && modoLista;

  const handleFiltrar = () => {
    const resultado = gerarDados(tipo, empresa).filter(
      (r) => status === 'Todos' || r.status === status,
    );
    setDados(resultado);
    setExpandedId(null);
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

  const handleToggleCard = (id) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  const totalValor = dados?.reduce((s, r) => s + r.valor, 0) ?? 0;
  const totalDesvio = dados?.reduce((s, r) => s + r.desvio, 0) ?? 0;

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} color="primary.dark">Relatórios</Typography>
        <Typography variant="body2" color="text.secondary">Consulte e exporte relatórios de OPEX, CAPEX e IFRS16</Typography>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={700} color="primary.dark" sx={{ mb: 2 }}>Filtros</Typography>

          <Box sx={filterGridSx}>
            <TextField
              label="Tipo"
              select
              fullWidth
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              {tiposRelatorio.map((t) => (
                <MenuItem key={t} value={t}>{t}</MenuItem>
              ))}
            </TextField>

            <TextField
              label="Empresa"
              select
              fullWidth
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
            >
              <MenuItem value="">Todas</MenuItem>
              {empresas.map((e) => (
                <MenuItem key={e.id} value={e.nome}>{e.nome}</MenuItem>
              ))}
            </TextField>

            <TextField
              label="Status"
              select
              fullWidth
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {statusOptions.map((s) => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </TextField>

            <MonthPickerField
              label="Mês Início"
              value={mesInicio}
              onChange={setMesInicio}
            />

            <MonthPickerField
              label="Mês Fim"
              value={mesFim}
              onChange={setMesFim}
            />
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              mt: 3,
              flexWrap: 'wrap',
              '& .MuiButton-root': {
                width: { xs: '100%', sm: 'auto' },
              },
            }}
          >
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

      {dados && (
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 2 }}>
              <Typography variant="h6" fontWeight={700} color="primary.dark">
                Resultados — {dados.length} registros
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
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

            {isTabletOrMobile && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={modoLista}
                      onChange={(e) => {
                        setModoLista(e.target.checked);
                        setExpandedId(null);
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

            {dados.length === 0 && (
              <Typography align="center" sx={{ py: 4, color: 'text.secondary' }}>
                Nenhum registro encontrado para os filtros selecionados.
              </Typography>
            )}

            {dados.length > 0 && showList && (
              <Stack spacing={1.5}>
                {dados.map((row) => (
                  <RelatorioListCard
                    key={row.id}
                    row={row}
                    expanded={expandedId === row.id}
                    onToggle={() => handleToggleCard(row.id)}
                  />
                ))}
              </Stack>
            )}

            {dados.length > 0 && showTable && (
              <Box sx={{ overflowX: 'auto', border: '1px solid', borderColor: 'divider' }}>
                <Box
                  component="table"
                  sx={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}
                >
                  <Box component="thead">
                    <Box component="tr">
                      {TABLE_HEADERS.map((h) => (
                        <Box
                          component="th"
                          key={h}
                          sx={{
                            p: '12px 16px',
                            textAlign: 'left',
                            bgcolor: 'primary.dark',
                            color: 'white',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            borderRadius: 0,
                          }}
                        >
                          {h}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                  <Box component="tbody">
                    {dados.map((row, i) => (
                      <Box
                        component="tr"
                        key={row.id}
                        sx={{
                          bgcolor: i % 2 === 0 ? 'white' : '#F0F7F3',
                          '&:hover': { bgcolor: '#DCEBE1' },
                        }}
                      >
                        <Box
                          component="td"
                          sx={{
                            p: '10px 16px',
                            fontSize: '0.82rem',
                            color: 'primary.dark',
                            fontWeight: 600,
                          }}
                        >
                          {row.id}
                        </Box>
                        <Box component="td" sx={{ p: '10px 16px', fontSize: '0.82rem' }}>
                          {row.empresa}
                        </Box>
                        <Box component="td" sx={{ p: '10px 16px', fontSize: '0.82rem' }}>
                          {row.fornecedor}
                        </Box>
                        <Box component="td" sx={{ p: '10px 16px' }}>
                          <Chip
                            label={row.tipo}
                            size="small"
                            color={tipoChipColor(row.tipo)}
                            sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                          />
                        </Box>
                        <Box component="td" sx={{ p: '10px 16px', fontSize: '0.82rem' }}>
                          {row.conta}
                        </Box>
                        <Box component="td" sx={{ p: '10px 16px', fontSize: '0.82rem' }}>
                          {row.mes}
                        </Box>
                        <Box
                          component="td"
                          sx={{ p: '10px 16px', fontSize: '0.82rem', fontWeight: 600 }}
                        >
                          {row.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </Box>
                        <Box
                          component="td"
                          sx={{
                            p: '10px 16px',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            color: row.desvio < 0 ? 'error.main' : row.desvio > 0 ? 'success.main' : 'text.secondary',
                          }}
                        >
                          {formatDesvio(row.desvio)}
                        </Box>
                        <Box component="td" sx={{ p: '10px 16px' }}>
                          <Chip
                            label={row.status}
                            size="small"
                            color={statusChipColor(row.status)}
                            sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                          />
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            )}
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
