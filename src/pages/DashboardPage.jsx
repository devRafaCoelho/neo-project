import {
  AccountBalance,
  Description,
  Engineering,
  PendingActions,
  TrendingDown,
  TrendingUp,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
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

export default function DashboardPage() {
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
          <Box sx={{ overflowX: "auto" }}>
            <Box
              component="table"
              sx={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}
            >
              <Box component="thead">
                <Box component="tr">
                  {[
                    "ID",
                    "Empresa",
                    "Fornecedor",
                    "Conta",
                    "Valor",
                    "Status",
                    "Data",
                  ].map((h) => (
                    <Box
                      component="th"
                      key={h}
                      sx={{
                        p: "12px 16px",
                        textAlign: "left",
                        bgcolor: "primary.dark",
                        color: "white",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                      }}
                    >
                      {h}
                    </Box>
                  ))}
                </Box>
              </Box>
              <Box component="tbody">
                {provisoesRecentes.map((p, i) => (
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
                      }}
                    >
                      {p.id}
                    </Box>
                    <Box
                      component="td"
                      sx={{ p: "10px 16px", fontSize: "0.82rem" }}
                    >
                      {p.empresa}
                    </Box>
                    <Box
                      component="td"
                      sx={{ p: "10px 16px", fontSize: "0.82rem" }}
                    >
                      {p.fornecedor}
                    </Box>
                    <Box
                      component="td"
                      sx={{ p: "10px 16px", fontSize: "0.82rem" }}
                    >
                      {p.conta}
                    </Box>
                    <Box
                      component="td"
                      sx={{
                        p: "10px 16px",
                        fontSize: "0.82rem",
                        fontWeight: 600,
                      }}
                    >
                      {p.valor.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </Box>
                    <Box component="td" sx={{ p: "10px 16px" }}>
                      <Chip
                        label={p.status}
                        size="small"
                        color={
                          p.status === "Aprovada"
                            ? "success"
                            : p.status === "Pendente"
                              ? "warning"
                              : "error"
                        }
                        sx={{ fontWeight: 600, fontSize: "0.75rem" }}
                      />
                    </Box>
                    <Box
                      component="td"
                      sx={{
                        p: "10px 16px",
                        fontSize: "0.82rem",
                        color: "text.secondary",
                      }}
                    >
                      {new Date(p.data).toLocaleDateString("pt-BR")}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
