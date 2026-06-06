"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useApp } from "@/context/app-context"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { createClient } from "@/lib/supabase"
import {
  calculateFinancialSummary,
  createFinancialEntry,
  getAdminFinancialEntries,
  type AdminFinancialEntry,
  type FinancialEntryType,
} from "@/lib/clinic-data"
import { Plus, DollarSign, TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react"

const categorias = [
  "Consultas",
  "Vacinas",
  "Cirurgias",
  "Exames",
  "Medicamentos",
  "Estética",
  "Aluguel",
  "Utilidades",
  "Salários",
  "Outros",
]

export default function FinanceiroPage() {
  const { addToast } = useApp()
  const { user, loading, refreshProfile } = useAuth()
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const [lancamentos, setLancamentos] = useState<AdminFinancialEntry[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    descricao: "",
    tipo: "entrada" as FinancialEntryType,
    valor: "",
    data: "",
    categoria: "",
  })

  useEffect(() => {
    async function loadFinancialData() {
      if (loading) return
      if (!user) {
        router.replace("/login?redirect=/financeiro")
        return
      }

      setIsLoadingData(true)
      setLoadError(null)
      await refreshProfile(user.id)

      try {
        setLancamentos(await getAdminFinancialEntries(supabase))
      } catch {
        setLoadError("Não foi possível carregar os lançamentos financeiros reais do Supabase.")
      } finally {
        setIsLoadingData(false)
      }
    }

    loadFinancialData()
  }, [loading, refreshProfile, router, supabase, user])

  const { receitaMes, despesasMes, lucroLiquido } = calculateFinancialSummary(lancamentos)
  const sortedLancamentos = [...lancamentos]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const valor = Number(formData.valor)
    if (!Number.isFinite(valor) || valor <= 0) {
      addToast("Informe um valor válido para o lançamento.", "error")
      return
    }

    setIsSaving(true)
    try {
      const newLancamento = await createFinancialEntry(supabase, {
        userId: user.id,
        descricao: formData.descricao.trim(),
        tipo: formData.tipo,
        valor,
        data: formData.data,
        categoria: formData.categoria,
      })
      setLancamentos((prev) => [newLancamento, ...prev])
      addToast("Lançamento registrado com sucesso!")
      setIsModalOpen(false)
      setFormData({
        descricao: "",
        tipo: "entrada",
        valor: "",
        data: "",
        categoria: "",
      })
    } catch {
      addToast("Não foi possível registrar o lançamento financeiro.", "error")
    } finally {
      setIsSaving(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + "T00:00:00")
    return date.toLocaleDateString("pt-BR")
  }

  if (loading || isLoadingData) {
    return (
      <div className="flex min-h-[360px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground font-serif">Controle Financeiro</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie as finanças da clínica
          </p>
          {loadError && <p className="mt-2 text-sm text-destructive">{loadError}</p>}
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Lançamento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="font-serif">Registrar Lançamento</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Input
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Ex: Consulta, compra de medicamentos..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo</Label>
                  <Select
                    value={formData.tipo}
                    onValueChange={(value: FinancialEntryType) =>
                      setFormData({ ...formData, tipo: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entrada">Entrada</SelectItem>
                      <SelectItem value="saida">Saída</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valor">Valor (R$)</Label>
                  <Input
                    id="valor"
                    type="number"
                    step="0.01"
                    value={formData.valor}
                    onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="data">Data</Label>
                  <Input
                    id="data"
                    type="date"
                    value={formData.data}
                    onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria</Label>
                  <Select
                    value={formData.categoria}
                    onValueChange={(value) => setFormData({ ...formData, categoria: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Registrando..." : "Registrar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Receita do Mês</p>
              <p className="text-2xl font-bold text-woofy-accent mt-1">
                {formatCurrency(receitaMes)}
              </p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-woofy-accent/20 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-woofy-accent" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Despesas do Mês</p>
              <p className="text-2xl font-bold text-destructive mt-1">
                {formatCurrency(despesasMes)}
              </p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-destructive/10 flex items-center justify-center">
              <TrendingDown className="h-6 w-6 text-destructive" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Lucro Líquido</p>
              <p
                className={`text-2xl font-bold mt-1 ${
                  lucroLiquido >= 0 ? "text-primary" : "text-destructive"
                }`}
              >
                {formatCurrency(lucroLiquido)}
              </p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {sortedLancamentos.length > 0 ? (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Categoria</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedLancamentos.map((lancamento) => (
                <TableRow key={lancamento.id}>
                  <TableCell className="font-medium">{lancamento.descricao}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        lancamento.tipo === "entrada"
                          ? "bg-woofy-accent/20 text-woofy-accent"
                          : "bg-destructive/10 text-destructive"
                      }
                    >
                      {lancamento.tipo === "entrada" ? (
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 mr-1" />
                      )}
                      {lancamento.tipo === "entrada" ? "Entrada" : "Saída"}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className={
                      lancamento.tipo === "entrada" ? "text-woofy-accent" : "text-destructive"
                    }
                  >
                    {lancamento.tipo === "entrada" ? "+" : "-"}
                    {formatCurrency(lancamento.valor)}
                  </TableCell>
                  <TableCell>{formatDate(lancamento.data)}</TableCell>
                  <TableCell>{lancamento.categoria}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-12">
          <DollarSign className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-foreground">Nenhum lançamento financeiro registrado.</h3>
          <p className="text-muted-foreground mt-1">
            Os totais permanecem zerados até que existam lançamentos reais.
          </p>
        </div>
      )}
    </div>
  )
}
