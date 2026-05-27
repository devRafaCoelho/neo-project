import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Button,
  Chip,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { useState } from 'react';

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

export default function GestaoSapPage() {
  const [tipo, setTipo] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [busca, setBusca] = useState('');
  const [resultados, setResultados] = useState(null);

  const handleBuscar = () => {
    const res = codigosMock.filter((c) => {
      const matchTipo = !tipo || c.tipo === tipo;
      const matchEmp = !empresa || c.empresa === empresa;
      const matchBusca =
        !busca
        || c.descricao.toLowerCase().includes(busca.toLowerCase())
        || c.codigo.toLowerCase().includes(busca.toLowerCase());
      return matchTipo && matchEmp && matchBusca;
    });
    setResultados(res);
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
              <MenuItem value="">Todos</MenuItem>
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
              <MenuItem value="">Todas</MenuItem>
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

          <Box sx={{ mt: 3 }}>
            <Button variant="contained" startIcon={<Search />} onClick={handleBuscar}>
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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {resultados.length === 0 ? (
                <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  Nenhum código encontrado.
                </Typography>
              ) : (
                resultados.map((r) => (
                  <Box
                    key={r.codigo}
                    sx={{
                      p: 2.5,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 3,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      flexWrap: 'wrap',
                      bgcolor: 'white',
                      '&:hover': { bgcolor: '#F0F7F3' },
                    }}
                  >
                    <Typography variant="body1" fontWeight={700} color="primary.dark" sx={{ minWidth: 90 }}>
                      {r.codigo}
                    </Typography>
                    <Typography variant="body2" sx={{ flex: 1, minWidth: 160 }}>
                      {r.descricao}
                    </Typography>
                    <Chip label={r.tipo} size="small" color={r.tipo === 'Serviço' ? 'secondary' : 'primary'} />
                    <Chip label={r.empresa} size="small" variant="outlined" sx={{ fontSize: '0.75rem' }} />
                    <Chip label={`Transação: ${r.transacao}`} size="small" sx={{ bgcolor: '#DCEBE1', fontSize: '0.75rem' }} />
                  </Box>
                ))
              )}
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
