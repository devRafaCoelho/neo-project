import { useCallback, useState } from "react";
import {
  AccountBalance,
  Description,
  Engineering,
  ExpandLess,
  ExpandMore,
  PendingActions,
  TrendingDown,
  TrendingUp,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Collapse,
  FormControlLabel,
  Stack,
  Switch,
  TablePagination,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  capexData,
  kpiDashboard,
  opexData,
  provisoesRecentes,
} from "../data/mockData";
import { SortableTableHeadCell } from "../components/table/SortableTableHeadCell";
import { useTableSort } from "../hooks/useTableSort";

const PROVISAO_SORT_COLUMNS = {
  id: { type: "string" },
  empresa: { type: "string" },
  fornecedor: { type: "string" },
  conta: { type: "string" },
  valor: { type: "number" },
  status: { type: "string" },
  data: { type: "date" },
};

const PROVISAO_TABLE_COLUMNS = [
  { id: "id", label: "ID" },
  { id: "empresa", label: "Empresa" },
  { id: "fornecedor", label: "Fornecedor" },
  { id: "conta", label: "Conta" },
  { id: "valor", label: "Valor" },
  { id: "status", label: "Status" },
  { id: "data", label: "Data" },
];

const formatMi = (v) =>
  v >= 1_000_000
    ? `R$ ${(v / 1_000_000).toFixed(1)} Mi`
    : `R$ ${(v / 1_000).toFixed(0)} K`;

function KpiCard({ icon, label, value, sub, trend, color }) {
  const isPositive = trend > 0;
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            minHeight: 48,
          }}
        >
          <Avatar sx={{ bgcolor: `${color}.main`, width: 48, height: 48 }}>
            {icon}
          </Avatar>
          {trend !== undefined && (
            <Chip
              size="small"
              icon={
                isPositive ? (
                  <TrendingUp fontSize="small" />
                ) : (
                  <TrendingDown fontSize="small" />
                )
              }
              label={`${isPositive ? "+" : ""}${trend}%`}
              color={isPositive ? "success" : "error"}
              sx={{ fontWeight: 700 }}
            />
          )}
        </Box>
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{ mt: 2, color: "text.primary" }}
        >
          {value}
        </Typography>
        <Typography variant="body2" fontWeight={600} color="text.primary">
          {label}
        </Typography>
        {sub && (
          <Typography variant="caption" color="text.secondary">
            {sub}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

function SectionTitle({ children }) {
  return (
    <Typography
      variant="h6"
      fontWeight={700}
      color="primary.dark"
      sx={{ mb: 2 }}
    >
      {children}
    </Typography>
  );
}

function statusChipColor(status) {
  if (status === "Aprovada") return "success";
  if (status === "Pendente") return "warning";
  return "error";
}

function ProvisaoListCard({ provisao, expanded, onToggle }) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderColor: expanded ? "primary.main" : "divider",
        bgcolor: expanded ? "#F7FCF9" : "background.paper",
        transition: "border-color 0.2s, background-color 0.2s",
      }}
    >
      <Box
        onClick={onToggle}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.5,
          p: 2,
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle2" fontWeight={700} color="primary.dark">
            {provisao.id}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {provisao.empresa}
          </Typography>
        </Box>
        <Chip
          label={provisao.status}
          size="small"
          color={statusChipColor(provisao.status)}
          sx={{ fontWeight: 600, fontSize: "0.75rem", flexShrink: 0 }}
        />
        {expanded ? (
          <ExpandLess color="primary" />
        ) : (
          <ExpandMore color="action" />
        )}
      </Box>
      <Collapse in={expanded}>
        <Box
          sx={{
            px: 2,
            pb: 2,
            pt: 2.5,
            display: "flex",
            flexDirection: "column",
            gap: 1.25,
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          {[
            ["Fornecedor", provisao.fornecedor],
            ["Conta", provisao.conta],
            [
              "Valor",
              provisao.valor.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              }),
            ],
            ["Data", new Date(provisao.data).toLocaleDateString("pt-BR")],
          ].map(([label, value]) => (
            <Box
              key={label}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
              >
                {label}
              </Typography>
              <Typography variant="body2" fontWeight={500} textAlign="right">
                {value}
              </Typography>
            </Box>
          ))}
        </Box>
      </Collapse>
    </Card>
  );
}

export default function DashboardPage() {
  const theme = useTheme();
  const isTabletOrMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const [modoLista, setModoLista] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [listVisibleCount, setListVisibleCount] = useState(3);

  const showTable = !isTabletOrMobile || !modoLista;
  const showList = isTabletOrMobile && modoLista;
  const resetPage = useCallback(() => setPage(0), []);
  const { sortedRows: provisoesOrdenadas, orderBy, order, requestSort } = useTableSort(
    provisoesRecentes,
    PROVISAO_SORT_COLUMNS,
    { onSortChange: resetPage },
  );
  const tableRows = provisoesOrdenadas.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );
  const listRows = provisoesRecentes.slice(0, listVisibleCount);
  const hasMoreListItems = listVisibleCount < provisoesRecentes.length;

  const handleToggleCard = (id) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} color="primary.dark">
          Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Visão geral do Sistema SAI — Neoenergia Telecom
        </Typography>
      </Box>

      {/* KPIs */}
      <Box
        sx={{
          mb: 4,
          display: "grid",
          gap: 3,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            lg: "repeat(4, minmax(0, 1fr))",
          },
        }}
      >
        <Box>
          <KpiCard
            icon={<AccountBalance />}
            label="OPEX Total (YTD)"
            value={formatMi(kpiDashboard.opexTotal)}
            trend={kpiDashboard.desvioOpex}
            color="primary"
            sub="vs. Plano 2026"
          />
        </Box>
        <Box>
          <KpiCard
            icon={<Engineering />}
            label="CAPEX Total (YTD)"
            value={formatMi(kpiDashboard.capexTotal)}
            trend={kpiDashboard.desvioCapex}
            color="secondary"
            sub="vs. Plano 2026"
          />
        </Box>
        <Box>
          <KpiCard
            icon={<Description />}
            label="Contratos Ativos"
            value={kpiDashboard.contratosAtivos}
            color="primary"
            sub="Em 6 empresas"
          />
        </Box>
        <Box>
          <KpiCard
            icon={<PendingActions />}
            label="Provisões Pendentes"
            value={kpiDashboard.provisoesPendentes}
            color="warning"
            sub="Aguardando aprovação"
          />
        </Box>
      </Box>

      {/* Gráficos */}
      <Stack spacing={3} sx={{ mb: 4 }}>
        <Box>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <SectionTitle>OPEX — Plano vs REV1 vs Real (R$ mil)</SectionTitle>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={opexData}
                  margin={{ top: 5, right: 10, bottom: 5, left: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0EAE5" />
                  <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(v) => `R$ ${v.toLocaleString("pt-BR")} K`}
                  />
                  <Legend
                    align="center"
                    verticalAlign="bottom"
                    wrapperStyle={{ fontSize: 13 }}
                    iconSize={12}
                    formatter={(value) => (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          lineHeight: 1.2,
                        }}
                      >
                        {value}
                      </span>
                    )}
                  />
                  <Bar
                    dataKey="plano"
                    name="Plano"
                    fill="#004042"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="rev1"
                    name="REV1"
                    fill="#00A443"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="real"
                    name="Real"
                    fill="#5BD38C"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>

        <Box>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <SectionTitle>CAPEX — Planejado vs Realizado (R$ K)</SectionTitle>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart
                  data={capexData}
                  margin={{ top: 5, right: 10, bottom: 5, left: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0EAE5" />
                  <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(v) => `R$ ${v.toLocaleString("pt-BR")} K`}
                  />
                  <Legend
                    align="center"
                    verticalAlign="bottom"
                    wrapperStyle={{ fontSize: 13 }}
                    iconSize={12}
                    formatter={(value) => (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          lineHeight: 1.2,
                        }}
                      >
                        {value}
                      </span>
                    )}
                  />
                  <Line
                    type="monotone"
                    dataKey="planejado"
                    name="Planejado"
                    stroke="#004042"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="realizado"
                    name="Realizado"
                    stroke="#00A443"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>
      </Stack>

      {/* Provisões recentes */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <SectionTitle>Provisões Recentes</SectionTitle>

          {isTabletOrMobile && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
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
                      setPage(0);
                    }}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2" fontWeight={600}>
                    {modoLista ? "Modo lista" : "Modo tabela"}
                  </Typography>
                }
                labelPlacement="end"
                sx={{ m: 0 }}
              />
            </Box>
          )}

          {showList && (
            <Stack spacing={1.5}>
              {listRows.map((p) => (
                <ProvisaoListCard
                  key={p.id}
                  provisao={p}
                  expanded={expandedId === p.id}
                  onToggle={() => handleToggleCard(p.id)}
                />
              ))}
              {hasMoreListItems && (
                <Box
                  sx={{ display: "flex", justifyContent: "center", pt: 0.5 }}
                >
                  <Button
                    variant="text"
                    onClick={() =>
                      setListVisibleCount((current) =>
                        Math.min(current + 3, provisoesRecentes.length),
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

          {showTable && (
            <Box sx={{ overflowX: "auto" }}>
              <Box
                component="table"
                sx={{
                  width: "max-content",
                  minWidth: "100%",
                  borderCollapse: "collapse",
                  tableLayout: "auto",
                }}
              >
                <Box component="thead">
                  <Box component="tr">
                    {PROVISAO_TABLE_COLUMNS.map((col) => (
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
                  {tableRows.map((p, i) => (
                    <Box
                      component="tr"
                      key={p.id}
                      sx={{
                        bgcolor: i % 2 === 0 ? "white" : "#F0F7F3",
                        "&:hover": { bgcolor: "#DCEBE1" },
                      }}
                    >
                      <Box
                        component="td"
                        sx={{
                          p: "10px 16px",
                          fontSize: "0.82rem",
                          color: "primary.dark",
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {p.id}
                      </Box>
                      <Box
                        component="td"
                        sx={{
                          p: "10px 16px",
                          fontSize: "0.82rem",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {p.empresa}
                      </Box>
                      <Box
                        component="td"
                        sx={{
                          p: "10px 16px",
                          fontSize: "0.82rem",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {p.fornecedor}
                      </Box>
                      <Box
                        component="td"
                        sx={{
                          p: "10px 16px",
                          fontSize: "0.82rem",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {p.conta}
                      </Box>
                      <Box
                        component="td"
                        sx={{
                          p: "10px 16px",
                          fontSize: "0.82rem",
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {p.valor.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </Box>
                      <Box
                        component="td"
                        sx={{ p: "10px 16px", whiteSpace: "nowrap" }}
                      >
                        <Chip
                          label={p.status}
                          size="small"
                          color={statusChipColor(p.status)}
                          sx={{ fontWeight: 600, fontSize: "0.75rem" }}
                        />
                      </Box>
                      <Box
                        component="td"
                        sx={{
                          p: "10px 16px",
                          fontSize: "0.82rem",
                          color: "text.secondary",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {new Date(p.data).toLocaleDateString("pt-BR")}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          )}
          {showTable && (
            <TablePagination
              component="div"
              count={provisoesRecentes.length}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 25]}
              labelRowsPerPage="Linhas por página:"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}–${to} de ${count}`
              }
              sx={{
                "& .MuiTablePagination-toolbar": {
                  px: { xs: 1, sm: 2 },
                  display: { xs: "grid", sm: "flex" },
                  gridTemplateColumns: { xs: "auto auto 1fr auto", sm: "none" },
                  gridTemplateAreas: {
                    xs: '"label input . rows" ". . . actions"',
                    sm: "none",
                  },
                  alignItems: "center",
                  columnGap: { xs: 1, sm: 0 },
                  rowGap: { xs: 0.75, sm: 0 },
                },
                "& .MuiTablePagination-spacer": {
                  display: { xs: "none", sm: "block" },
                },
                "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                  {
                    margin: 0,
                  },
                "& .MuiTablePagination-selectLabel": {
                  gridArea: { xs: "label", sm: "auto" },
                  justifySelf: { xs: "start", sm: "auto" },
                },
                "& .MuiTablePagination-input": {
                  gridArea: { xs: "input", sm: "auto" },
                  justifySelf: { xs: "start", sm: "auto" },
                },
                "& .MuiTablePagination-displayedRows": {
                  gridArea: { xs: "rows", sm: "auto" },
                  justifySelf: { xs: "center", sm: "auto" },
                  textAlign: { xs: "center", sm: "inherit" },
                },
                "& .MuiTablePagination-actions": {
                  gridArea: { xs: "actions", sm: "auto" },
                  justifySelf: { xs: "center", sm: "auto" },
                  marginLeft: { xs: 0, sm: "auto" },
                },
                "& .MuiTablePagination-actions .MuiIconButton-root": {
                  color: "text.secondary",
                },
                "& .MuiTablePagination-actions .MuiIconButton-root.Mui-disabled":
                  {
                    color: "text.disabled",
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
