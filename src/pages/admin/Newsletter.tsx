import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Mail, 
  Download, 
  Search, 
  Trash2, 
  TrendingUp,
  Users,
  Calendar,
  Filter,
  RefreshCw
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  status: string;
  source: string | null;
  subscribed_at: string;
  unsubscribed_at: string | null;
}

interface Stats {
  total: number;
  active: number;
  unsubscribed: number;
  thisMonth: number;
}

const Newsletter = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [stats, setStats] = useState<Stats>({
    total: 0,
    active: 0,
    unsubscribed: 0,
    thisMonth: 0,
  });

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .select("*")
      .order("subscribed_at", { ascending: false });

    if (error) {
      toast.error("Erro ao carregar assinantes");
      console.error(error);
    } else {
      setSubscribers(data || []);
      calculateStats(data || []);
    }
    setLoading(false);
  };

  const calculateStats = (data: Subscriber[]) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    setStats({
      total: data.length,
      active: data.filter((s) => s.status === "active").length,
      unsubscribed: data.filter((s) => s.status === "unsubscribed").length,
      thisMonth: data.filter(
        (s) => new Date(s.subscribed_at) >= startOfMonth
      ).length,
    });
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("newsletter_subscribers")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Erro ao excluir assinante");
    } else {
      toast.success("Assinante excluído com sucesso");
      fetchSubscribers();
    }
  };

  const handleUnsubscribe = async (id: string) => {
    const { error } = await supabase
      .from("newsletter_subscribers")
      .update({ 
        status: "unsubscribed", 
        unsubscribed_at: new Date().toISOString() 
      })
      .eq("id", id);

    if (error) {
      toast.error("Erro ao cancelar inscrição");
    } else {
      toast.success("Inscrição cancelada com sucesso");
      fetchSubscribers();
    }
  };

  const handleResubscribe = async (id: string) => {
    const { error } = await supabase
      .from("newsletter_subscribers")
      .update({ 
        status: "active", 
        unsubscribed_at: null 
      })
      .eq("id", id);

    if (error) {
      toast.error("Erro ao reativar inscrição");
    } else {
      toast.success("Inscrição reativada com sucesso");
      fetchSubscribers();
    }
  };

  const exportToCSV = () => {
    const activeSubscribers = subscribers.filter(s => s.status === "active");
    const headers = ["Email", "Nome", "Origem", "Data de Inscrição"];
    const csvContent = [
      headers.join(","),
      ...activeSubscribers.map((s) =>
        [
          s.email,
          s.name || "",
          s.source || "footer",
          new Date(s.subscribed_at).toLocaleDateString("pt-BR"),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `newsletter_subscribers_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    toast.success("Lista exportada com sucesso!");
  };

  const filteredSubscribers = subscribers.filter((s) => {
    const matchesSearch = 
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      (s.name && s.name.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    const matchesSource = sourceFilter === "all" || s.source === sourceFilter;
    return matchesSearch && matchesStatus && matchesSource;
  });

  const getSourceBadge = (source: string | null) => {
    const sourceMap: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
      footer: { label: "Rodapé", variant: "default" },
      popup: { label: "Pop-up", variant: "secondary" },
    };
    const config = sourceMap[source || "footer"] || { label: source || "Desconhecido", variant: "outline" as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const statCards = [
    { icon: Users, label: "Total de Assinantes", value: stats.total, color: "bg-blue-500" },
    { icon: Mail, label: "Ativos", value: stats.active, color: "bg-green-500" },
    { icon: TrendingUp, label: "Este Mês", value: stats.thisMonth, color: "bg-purple-500" },
    { icon: Calendar, label: "Cancelados", value: stats.unsubscribed, color: "bg-red-500" },
  ];

  return (
    <AdminLayout title="Newsletter">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-card rounded-2xl p-5 border border-border"
          >
            <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon className="h-5 w-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Actions Bar */}
      <div className="bg-card rounded-2xl border border-border p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por email ou nome..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Ativos</SelectItem>
                <SelectItem value="unsubscribed">Cancelados</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Origem" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="footer">Rodapé</SelectItem>
                <SelectItem value="popup">Pop-up</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={fetchSubscribers} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Atualizar
            </Button>
            <Button onClick={exportToCSV} className="bg-primary">
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Origem</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  <RefreshCw className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : filteredSubscribers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  Nenhum assinante encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredSubscribers.map((subscriber) => (
                <TableRow key={subscriber.id}>
                  <TableCell className="font-medium">{subscriber.email}</TableCell>
                  <TableCell>{subscriber.name || "-"}</TableCell>
                  <TableCell>{getSourceBadge(subscriber.source)}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={subscriber.status === "active" ? "default" : "destructive"}
                      className={subscriber.status === "active" ? "bg-green-500" : ""}
                    >
                      {subscriber.status === "active" ? "Ativo" : "Cancelado"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(subscriber.subscribed_at).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {subscriber.status === "active" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUnsubscribe(subscriber.id)}
                        >
                          Cancelar
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleResubscribe(subscriber.id)}
                        >
                          Reativar
                        </Button>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir assinante?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação não pode ser desfeita. O email {subscriber.email} será removido permanentemente.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(subscriber.id)}
                              className="bg-destructive text-destructive-foreground"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
};

export default Newsletter;
