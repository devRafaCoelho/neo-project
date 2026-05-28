import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Button,
  Chip,
  FormControlLabel,
  Switch,
  Stack,
  TablePagination,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Search, SearchOff } from '@mui/icons-material';
import { useCallback, useState } from 'react';
import { SortableTableHeadCell } from '../components/table/SortableTableHeadCell';
import { useTableSort } from '../hooks/useTableSort';

const SAP_SORT_COLUMNS = {
  codigo: { type: 'string' },
  descricao: { type: 'string' },
  tipo: { type: 'string' },
  empresa: { type: 'string' },
  transacao: { type: 'string' },
};

const SAP_TABLE_COLUMNS = [
  { id: 'codigo', label: 'Código' },
  { id: 'descricao', label: 'Descrição' },
  { id: 'tipo', label: 'Tipo' },
  { id: 'empresa', label: 'Distribuidora' },
  { id: 'transacao', label: 'Transação' },
];

const tiposCodigo = ['Material / Telecom', 'Serviço'];
const distribuidoras = [
  'Neoenergia Coelba',
  'Neoenergia Pernambuco',
  'Neoenergia Cosern',
  'Neoenergia Brasília',
  'Neoenergia Elektro',
];

const codigosMock = [
  { codigo: 'MAT-001', descricao: 'Rádio 1+1 15GHz', tipo: 'Material / Telecom', empresa: 'Neoenergia Coelba', transacao: 'ZMM929' },
  { codigo: 'MAT-002', descricao: 'Switch L2 24P', tipo: 'Material / Telecom', empresa: 'Neoenergia Elektro', transacao: 'MM01' },
  { codigo: 'SRV-001', descricao: 'Suporte Administrativo', tipo: 'Serviço', empresa: 'Neoenergia Coelba', transacao: 'Portal BDA' },
  { codigo: 'SRV-002', descricao: 'Instalação de Fibra', tipo: 'Serviço', empresa: 'Neoenergia Pernambuco', transacao: 'Portal BDA' },
  { codigo: 'MAT-003', descricao: 'ONU GPON', tipo: 'Material / Telecom', empresa: 'Neoenergia Brasília', transacao: 'ZMM929' },
  { codigo: 'SRV-003', descricao: 'Manutenção Corretiva', tipo: 'Serviço', empresa: 'Neoenergia Cosern', transacao: 'Portal BDA' },
];

function ResultadosEmptyState({ onLimparFiltros }) {
  return (
    <Box
      sx={{
        textAlign: 'center',
        py: { xs: 5, sm: 6 },
        px: 2,
        borderRadius: 2,
        bgcolor: '#F7FCF9',
        border: '1px dashed',
        borderColor: 'divider',
      }}
    >
      <SearchOff sx={{ fontSize: 72, opacity: 0.35, mb: 2, color: 'primary.main' }} />
      <Typography variant="h6" fontWeight={700} color="primary.dark" gutterBottom>
        Nenhum código encontrado
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ maxWidth: 460, mx: 'auto', mb: 3 }}
      >
        Não há dados para os filtros selecionados. Tente alterar tipo, distribuidora
        ou termos de busca.
      </Typography>
      <Button variant="outlined" color="primary" onClick={onLimparFiltros}>
        Limpar filtros
      </Button>
    </Box>
  );
}

export default function GestaoSapPage() {
  const theme = useTheme();
  const isTabletOrMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [tipo, setTipo] = useState('Todos');
  const [empresa, setEmpresa] = useState('Todas');
  const [busca, setBusca] = useState('');
  const [resultados, setResultados] = useState(null);
  const [modoLista, setModoLista] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [listVisibleCount, setListVisibleCount] = useState(3);

  const showTable = !isTabletOrMobile || !modoLista;
  const showList = isTabletOrMobile && modoLista;
  const lista = resultados ?? [];
  const resetPage = useCallback(() => setPage(0), []);
  const { sortedRows: listaOrdenada, orderBy, order, requestSort } = useTableSort(
    lista,
    SAP_SORT_COLUMNS,
    { onSortChange: resetPage },
  );
  const resultadosTabela = listaOrdenada.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  const resultadosLista = lista.slice(0, listVisibleCount);
  const hasMoreListItems = listVisibleCount < lista.length;

  const handleBuscar = () => {
    const res = codigosMock.filter((c) => {
      const matchTipo = tipo === 'Todos' || c.tipo === tipo;
      const matchEmp = empresa === 'Todas' || c.empresa === empresa;
      const matchBusca =
        !busca
        || c.descricao.toLowerCase().includes(busca.toLowerCase())
        || c.codigo.toLowerCase().includes(busca.toLowerCase());
      return matchTipo && matchEmp && matchBusca;
    });
    setResultados(res);
    setPage(0);
    setListVisibleCount(3);
  };

  const handleLimparFiltros = () => {
    setTipo('Todos');
    setEmpresa('Todas');
    setBusca('');
    setResultados(null);
    setListVisibleCount(3);
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} color="primary.dark">
          Gestão SAP
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Consulte e gerencie códigos SAP de materiais e serviços
        </Typography>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={700} color="primary.dark" sx={{ mb: 2 }}>
            Buscar Código SAP
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gap: 2.5,
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(3, minmax(0, 1fr))',
              },
            }}
          >
            <TextField
              label="Tipo"
              select
              fullWidth
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            >
              <MenuItem value="Todos">Todos</MenuItem>
              {tiposCodigo.map((t) => (
                <MenuItem key={t} value={t}>{t}</MenuItem>
              ))}
            </TextField>

            <TextField
              label="Distribuidora"
              select
              fullWidth
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
            >
              <MenuItem value="Todas">Todas</MenuItem>
              {distribuidoras.map((d) => (
                <MenuItem key={d} value={d}>{d}</MenuItem>
              ))}
            </TextField>

            <TextField
              label="Buscar por código ou descrição"
              fullWidth
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
            />
          </Box>

          <Box
            sx={{
              mt: 3,
              display: 'flex',
              justifyContent: { xs: 'stretch', sm: 'flex-start' },
            }}
          >
            <Button
              variant="contained"
              startIcon={<Search />}
              onClick={handleBuscar}
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              Buscar
            </Button>
          </Box>
        </CardContent>
      </Card>

      {resultados && (
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={700} color="primary.dark" sx={{ mb: 2 }}>
              Resultados — {resultados.length} registros
            </Typography>
            {resultados.length > 0 && isTabletOrMobile && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', mb: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={modoLista}
                      onChange={(e) => {
                        setModoLista(e.target.checked);
                        setPage(0);
                        setListVisibleCount(3);
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

            {resultados.length === 0 && (
              <ResultadosEmptyState onLimparFiltros={handleLimparFiltros} />
            )}

            {resultados.length > 0 && showList && (
              <Stack spacing={1.5}>
                {resultadosLista.map((r) => (
                  <Box
                    key={r.codigo}
                    sx={{
                      p: 2.5,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'stretch',
                      gap: 1.25,
                      bgcolor: 'white',
                      '&:hover': { bgcolor: '#F0F7F3' },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                      <Typography variant="subtitle2" fontWeight={700} color="primary.dark">
                        {r.codigo}
                      </Typography>
                      <Chip label={r.tipo} size="small" color={r.tipo === 'Serviço' ? 'secondary' : 'primary'} />
                    </Box>
                    <Typography variant="body2">{r.descricao}</Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip label={r.empresa} size="small" variant="outlined" sx={{ fontSize: '0.75rem' }} />
                      <Chip label={`Transação: ${r.transacao}`} size="small" sx={{ bgcolor: '#DCEBE1', fontSize: '0.75rem' }} />
                    </Box>
                  </Box>
                ))}
                {hasMoreListItems && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', pt: 0.5 }}>
                    <Button
                      variant="text"
                      onClick={() =>
                        setListVisibleCount((current) =>
                          Math.min(current + 3, lista.length)
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

            {resultados.length > 0 && showTable && (
              <>
                <Box sx={{ overflowX: 'auto', border: '1px solid', borderColor: 'divider', mb: 1 }}>
                  <Box
                    component="table"
                    sx={{
                      width: 'max-content',
                      minWidth: '100%',
                      borderCollapse: 'collapse',
                      tableLayout: 'auto',
                    }}
                  >
                    <Box component="thead">
                      <Box component="tr">
                        {SAP_TABLE_COLUMNS.map((col) => (
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
                      {resultadosTabela.map((r, i) => (
                        <Box
                          component="tr"
                          key={r.codigo}
                          sx={{
                            bgcolor: i % 2 === 0 ? 'white' : '#F0F7F3',
                            '&:hover': { bgcolor: '#DCEBE1' },
                          }}
                        >
                          <Box component="td" sx={{ p: '10px 16px', fontSize: '0.82rem', color: 'primary.dark', fontWeight: 700, whiteSpace: 'nowrap' }}>
                            {r.codigo}
                          </Box>
                          <Box component="td" sx={{ p: '10px 16px', fontSize: '0.82rem', minWidth: 240 }}>
                            {r.descricao}
                          </Box>
                          <Box component="td" sx={{ p: '10px 16px', whiteSpace: 'nowrap' }}>
                            <Chip label={r.tipo} size="small" color={r.tipo === 'Serviço' ? 'secondary' : 'primary'} />
                          </Box>
                          <Box component="td" sx={{ p: '10px 16px', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                            {r.empresa}
                          </Box>
                          <Box component="td" sx={{ p: '10px 16px', whiteSpace: 'nowrap' }}>
                            <Chip label={r.transacao} size="small" variant="outlined" />
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Box>
                <TablePagination
                  component="div"
                  count={resultados.length}
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
              </>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
