"use client"

import { useState } from "react"
import { useApp } from "@/context/app-context"
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
import { Plus, DollarSign, TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react"
import type { Lancamento } from "@/lib/mock-data"

const categorias = [
  "Consultas",
  "Vacinas",
  "Cirurgias",
  "Exames",
  "Medicamentos",
  "Estetica",
  "Aluguel",
  "Utilidades",
  "Salarios",
  "Outros",
]

export default function FinanceiroPage() {
  const { lancamentos, setLancamentos, addToast } = useApp()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    descricao: "",
    tipo: "entrada" as "entrada" | "saida",
    valor: "",
    data: "",
    categoria: "",
  })

  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const lancamentosMes = lancamentos.filter((l) => {
    const data = new Date(l.data)
    return data.getMonth() === currentMonth && data.getFullYear() === currentYear
  })

  const receitaTotal = lancamentosMes
    .filter((l) => l.tipo === "entrada")
    .reduce((acc, l) => acc + l.valor, 0)

  const despesasTotal = lancamentosMes
    .filter((l) => l.tipo === "saida")
    .reduce((acc, l) => acc + l.valor, 0)

  const lucroLiquido = receitaTotal - despesasTotal

  const sortedLancamentos = [...lancamentos].sort(
    (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newLancamento: Lancamento = {
      id: Math.random().toString(36).substring(7),
      descricao: formData.descricao,
      tipo: formData.tipo,
      valor: parseFloat(formData.valor),
      data: formData.data,
      categoria: formData.categoria,
    }

    setLancamentos((prev) => [...prev, newLancamento])
    addToast("Lancamento registrado com sucesso!")
    setIsModalOpen(false)
    setFormData({
      descricao: "",
      tipo: "entrada",
      valor: "",
      data: "",
      categoria: "",
    })
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + "T00:00:00")
    return date.toLocaleDateString("pt-BR")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground font-serif">Controle Financeiro</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie as financas da clinica
          </p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Lancamento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="font-serif">Registrar Lancamento</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="descricao">Descricao</Label>
                <Input
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Ex: Consulta - Thor, Compra de medicamentos..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo</Label>
                  <Select
                    value={formData.tipo}
                    onValueChange={(value: "entrada" | "saida") =>
                      setFormData({ ...formData, tipo: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entrada">Entrada</SelectItem>
                      <SelectItem value="saida">Saida</SelectItem>
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
                <Button type="submit">Registrar</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Receita do Mes</p>
              <p className="text-2xl font-bold text-woofy-accent mt-1">
                {formatCurrency(receitaTotal)}
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
              <p className="text-sm text-muted-foreground">Despesas do Mes</p>
              <p className="text-2xl font-bold text-destructive mt-1">
                {formatCurrency(despesasTotal)}
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
              <p className="text-sm text-muted-foreground">Lucro Liquido</p>
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
                <TableHead>Descricao</TableHead>
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
                      {lancamento.tipo === "entrada" ? "Entrada" : "Saida"}
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
          <h3 className="text-lg font-medium text-foreground">Nenhum lancamento registrado</h3>
          <p className="text-muted-foreground mt-1">
            Comece registrando o primeiro lancamento financeiro
          </p>
        </div>
      )}
    </div>
  )
}
