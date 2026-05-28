import { yupResolver } from "@hookform/resolvers/yup";
import {
  Cancel,
  Edit,
  Lock,
  Save,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useAuth } from "../context/AuthContext";

const senhaSchema = yup.object({
  senhaAtual: yup.string().required("Senha atual obrigatória"),
  novaSenha: yup
    .string()
    .min(8, "Mínimo 8 caracteres")
    .matches(/[A-Z]/, "Deve conter ao menos uma maiúscula")
    .matches(/[0-9]/, "Deve conter ao menos um número")
    .matches(/[^a-zA-Z0-9]/, "Deve conter ao menos um caractere especial")
    .required("Nova senha obrigatória"),
  confirmarSenha: yup
    .string()
    .oneOf([yup.ref("novaSenha")], "As senhas não coincidem")
    .required("Confirmação obrigatória"),
});

export default function PerfilPage() {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [editando, setEditando] = useState(false);
  const [modalSenha, setModalSenha] = useState(false);
  const [showAtual, setShowAtual] = useState(false);
  const [showNova, setShowNova] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(senhaSchema) });

  const handleSalvarPerfil = async () => {
    await new Promise((r) => setTimeout(r, 600));
    enqueueSnackbar("Perfil atualizado com sucesso!", { variant: "success" });
    setEditando(false);
  };

  const handleAlterarSenha = async () => {
    await new Promise((r) => setTimeout(r, 700));
    enqueueSnackbar("Senha alterada com sucesso!", {
      variant: "success",
      autoHideDuration: 4000,
    });
    reset();
    setModalSenha(false);
  };

  const handleCancelarSenha = () => {
    reset();
    setModalSenha(false);
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} color="primary.dark">
          Meu Perfil
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Gerencie seus dados e configurações de acesso
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: {
            xs: "1fr",
            lg: "minmax(280px, 380px) minmax(0, 1fr)",
          },
          alignItems: "start",
        }}
      >
        {/* Card do perfil */}
        <Box sx={{ width: "100%", minWidth: 0 }}>
          <Card sx={{ textAlign: "center", height: "100%" }}>
            <CardContent sx={{ p: 4 }}>
              <Avatar
                sx={{
                  width: 96,
                  height: 96,
                  bgcolor: "primary.main",
                  fontSize: "2rem",
                  fontWeight: 700,
                  mx: "auto",
                  mb: 2,
                  background:
                    "linear-gradient(135deg, #00A443 0%, #004042 100%)",
                  boxShadow: "0 4px 20px rgba(0,164,67,0.35)",
                }}
              >
                {user?.initials}
              </Avatar>
              <Typography variant="h6" fontWeight={700}>
                {user?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
              <Chip
                label={user?.role}
                color="primary"
                sx={{ mt: 1.5, fontWeight: 600 }}
              />

              <Divider sx={{ my: 3 }} />

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                  textAlign: "left",
                }}
              >
                {[
                  ["Departamento", user?.department],
                  ["Empresa", user?.company],
                ].map(([label, value]) => (
                  <Box key={label}>
                    <Typography
                      variant="caption"
                      sx={{ color: "#5E6871" }}
                      fontWeight={600}
                    >
                      {label}
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {value}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Button
                variant="outlined"
                startIcon={<Lock />}
                fullWidth
                sx={{ mt: 3 }}
                onClick={() => setModalSenha(true)}
              >
                Alterar Senha
              </Button>
            </CardContent>
          </Card>
        </Box>

        {/* Dados do perfil */}
        <Box sx={{ width: "100%", minWidth: 0 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "space-between",
                  alignItems: { xs: "flex-start", sm: "center" },
                  gap: { xs: 1.5, sm: 0 },
                  mb: 3,
                }}
              >
                <Typography variant="h6" fontWeight={700} color="primary.dark">
                  Dados do Usuário
                </Typography>
                {!editando ? (
                  <Button
                    variant="outlined"
                    startIcon={<Edit />}
                    onClick={() => setEditando(true)}
                    size="small"
                    sx={{ alignSelf: { xs: "stretch", sm: "auto" }, whiteSpace: "nowrap" }}
                  >
                    Editar
                  </Button>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      width: { xs: "100%", sm: "auto" },
                      flexWrap: "nowrap",
                      justifyContent: { xs: "space-between", sm: "flex-start" },
                      "& .MuiButton-root": {
                        whiteSpace: "nowrap",
                        minHeight: 36,
                        flex: { xs: 1, sm: "initial" },
                      },
                    }}
                  >
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Cancel />}
                      size="small"
                      onClick={() => setEditando(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<Save />}
                      size="small"
                      onClick={handleSalvarPerfil}
                    >
                      Salvar
                    </Button>
                  </Box>
                )}
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gap: 2.5,
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, minmax(0, 1fr))",
                  },
                }}
              >
                <TextField
                  label="Nome"
                  fullWidth
                  defaultValue={user?.name?.split(" ")[0]}
                  disabled={!editando}
                />
                <TextField
                  label="Sobrenome"
                  fullWidth
                  defaultValue={user?.name?.split(" ").slice(1).join(" ")}
                  disabled={!editando}
                />
                <TextField
                  label="E-mail"
                  fullWidth
                  defaultValue={user?.email}
                  disabled
                  helperText="O e-mail não pode ser alterado"
                  sx={{ gridColumn: { xs: "1", sm: "1 / -1" } }}
                />
                <TextField
                  label="Cargo"
                  fullWidth
                  defaultValue="Analista Telecom"
                  disabled={!editando}
                />
                <TextField
                  label="Departamento"
                  fullWidth
                  defaultValue={user?.department}
                  disabled={!editando}
                />
                <TextField
                  label="Empresa"
                  fullWidth
                  defaultValue={user?.company}
                  disabled={!editando}
                  sx={{ gridColumn: { xs: "1", sm: "1 / -1" } }}
                />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Modal de Alteração de Senha */}
      <Dialog
        open={modalSenha}
        onClose={handleCancelarSenha}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: "primary.dark" }}>
          Alterar Senha
        </DialogTitle>
        <DialogContent>
          <Box
            component="form"
            noValidate
            sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}
          >
            <TextField
              label="Senha Atual *"
              type={showAtual ? "text" : "password"}
              fullWidth
              {...register("senhaAtual")}
              error={!!errors.senhaAtual}
              helperText={errors.senhaAtual?.message}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowAtual((p) => !p)}
                        edge="end"
                      >
                        {showAtual ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              label="Nova Senha *"
              type={showNova ? "text" : "password"}
              fullWidth
              {...register("novaSenha")}
              error={!!errors.novaSenha}
              helperText={errors.novaSenha?.message}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowNova((p) => !p)}
                        edge="end"
                      >
                        {showNova ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              label="Confirmar Nova Senha *"
              type={showConfirmar ? "text" : "password"}
              fullWidth
              {...register("confirmarSenha")}
              error={!!errors.confirmarSenha}
              helperText={errors.confirmarSenha?.message}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmar((p) => !p)}
                        edge="end"
                      >
                        {showConfirmar ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1, flexWrap: "nowrap" }}>
          <Button
            variant="outlined"
            color="error"
            onClick={handleCancelarSenha}
            fullWidth
            sx={{ whiteSpace: "nowrap", minHeight: 44 }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit(handleAlterarSenha)}
            fullWidth
            sx={{ whiteSpace: "nowrap", minHeight: 44 }}
          >
            Salvar Senha
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
