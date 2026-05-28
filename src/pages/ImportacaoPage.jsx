import { useCallback, useState } from 'react';
import {
  Box, Card, CardContent, Typography, MenuItem, TextField,
  Button, Chip, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Alert,
} from '@mui/material';
import { CloudUpload, CheckCircle, Cancel } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { useSnackbar } from 'notistack';
import { importacaoPreview } from '../data/mockData';
import { SortableMuiHeadCell } from '../components/table/SortableTableHeadCell';
import { useTableSort } from '../hooks/useTableSort';

const IMPORT_SORT_COLUMNS = {
  fornecedor: { type: 'string' },
  servico: { type: 'string' },
  ppto26: { type: 'number' },
  rev1: { type: 'number' },
  real: { type: 'number' },
  desvio: { type: 'number' },
  justificativa: { type: 'string' },
};

const IMPORT_TABLE_COLUMNS = [
  { id: 'fornecedor', label: 'Fornecedor' },
  { id: 'servico', label: 'Serviço' },
  { id: 'ppto26', label: 'PPTO26 (R$K)' },
  { id: 'rev1', label: 'REV1 (R$K)' },
  { id: 'real', label: 'Real (R$K)' },
  { id: 'desvio', label: 'Desvio (R$K)' },
  { id: 'justificativa', label: 'Justificativa' },
];

const tipos = ['OPEX', 'CAPEX', 'IFRS16'];

const desvioColor = (val) => {
  if (val < 0) return 'error.main';
  if (val > 0) return 'success.main';
  return 'text.secondary';
};

export default function ImportacaoPage() {
  const [tipo, setTipo] = useState('');
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const { sortedRows: previewOrdenado, orderBy, order, requestSort } = useTableSort(
    previewData ?? [],
    IMPORT_SORT_COLUMNS,
  );

  const onDrop = useCallback((accepted) => {
    if (accepted.length > 0) {
      setFile(accepted[0]);
      setPreviewData(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
  });

  const handlePreview = () => {
    if (!tipo) {
      enqueueSnackbar('Selecione o tipo de importação antes de pré-visualizar.', { variant: 'warning' });
      return;
    }
    if (!file) {
      enqueueSnackbar('Selecione um arquivo antes de pré-visualizar.', { variant: 'warning' });
      return;
    }
    setPreviewData(importacaoPreview[tipo] || []);
  };

  const handleSalvar = () => {
    if (!previewData) {
      enqueueSnackbar('Clique em "Pré-visualizar" antes de salvar.', { variant: 'warning' });
      return;
    }
    enqueueSnackbar(`Importação de ${tipo} realizada com sucesso! ${previewData.length} registros importados.`, {
      variant: 'success',
      autoHideDuration: 4000,
    });
    setFile(null);
    setPreviewData(null);
    setTipo('');
  };

  const handleCancelar = () => {
    setFile(null);
    setPreviewData(null);
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} color="primary.dark">Importação</Typography>
        <Typography variant="body2" color="text.secondary">Importe planilhas de OPEX, CAPEX ou IFRS16</Typography>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={700} color="primary.dark" sx={{ mb: 3 }}>
            Configuração da Importação
          </Typography>

          <TextField
            label="Tipo de Importação"
            select
            value={tipo}
            onChange={(e) => { setTipo(e.target.value); setPreviewData(null); }}
            sx={{ minWidth: 250, mb: 3 }}
          >
            {tipos.map((t) => (
              <MenuItem key={t} value={t}>{t}</MenuItem>
            ))}
          </TextField>

          <Box
            {...getRootProps()}
            sx={{
              border: `2px dashed`,
              borderColor: isDragActive ? 'primary.main' : 'divider',
              borderRadius: 3,
              p: 5,
              textAlign: 'center',
              cursor: 'pointer',
              bgcolor: isDragActive ? 'brand.dragActive' : file ? 'brand.muted' : 'background.paper',
              transition: 'all 0.2s',
              '&:hover': { borderColor: 'primary.main', bgcolor: 'brand.accentSoft' },
            }}
          >
            <input {...getInputProps()} />
            {file ? (
              <Box>
                <CheckCircle sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                <Typography variant="body1" fontWeight={600} color="primary.main">{file.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {(file.size / 1024).toFixed(1)} KB — clique para trocar
                </Typography>
              </Box>
            ) : (
              <Box>
                <CloudUpload sx={{ fontSize: 56, color: 'text.secondary', mb: 1.5 }} />
                <Typography variant="body1" fontWeight={600} color="text.primary">
                  {isDragActive ? 'Solte o arquivo aqui' : 'Arraste e solte seu arquivo aqui'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  ou clique para selecionar
                </Typography>
                <Chip label=".xlsx  .xls  .csv" size="small" sx={{ mt: 1.5, bgcolor: 'brand.chip' }} />
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mt: 3, flexWrap: 'wrap' }}>
            <Button variant="outlined" onClick={handlePreview} disabled={!file || !tipo}>
              Pré-visualizar
            </Button>
          </Box>
        </CardContent>
      </Card>

      {previewData && (
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography variant="h6" fontWeight={700} color="primary.dark">
                  Pré-visualização — {tipo}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {previewData.length} registros encontrados
                </Typography>
              </Box>
              <Alert severity="info" sx={{ py: 0.5, borderRadius: 2 }}>
                Revise os dados antes de confirmar a importação
              </Alert>
            </Box>

            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {IMPORT_TABLE_COLUMNS.map((col) => (
                      <SortableMuiHeadCell
                        key={col.id}
                        columnId={col.id}
                        label={col.label}
                        active={orderBy === col.id}
                        direction={order}
                        onSort={requestSort}
                      />
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {previewOrdenado.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell sx={{ fontWeight: 600 }}>{row.fornecedor}</TableCell>
                      <TableCell>{row.servico}</TableCell>
                      <TableCell>{row.ppto26.toLocaleString('pt-BR')}</TableCell>
                      <TableCell>{row.rev1.toLocaleString('pt-BR')}</TableCell>
                      <TableCell>{row.real.toLocaleString('pt-BR')}</TableCell>
                      <TableCell sx={{ color: desvioColor(row.desvio), fontWeight: 700 }}>
                        {row.desvio > 0 ? '+' : ''}{row.desvio.toLocaleString('pt-BR')}
                      </TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontStyle: row.justificativa ? 'normal' : 'italic' }}>
                        {row.justificativa || '—'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Cancel />}
                onClick={handleCancelar}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                startIcon={<CheckCircle />}
                onClick={handleSalvar}
              >
                Confirmar Importação
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
