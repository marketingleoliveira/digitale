import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function FabricLeads() {
  const { data: leads, isLoading } = useQuery({
    queryKey: ["fabric-leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fabric_leads")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const formatCnpj = (cnpj: string) => {
    if (cnpj.length === 14) {
      return `${cnpj.slice(0,2)}.${cnpj.slice(2,5)}.${cnpj.slice(5,8)}/${cnpj.slice(8,12)}-${cnpj.slice(12)}`;
    }
    return cnpj;
  };

  const formatWhatsapp = (num: string) => {
    if (num.length === 11) return `(${num.slice(0,2)}) ${num.slice(2,7)}-${num.slice(7)}`;
    if (num.length === 10) return `(${num.slice(0,2)}) ${num.slice(2,6)}-${num.slice(6)}`;
    return num;
  };

  return (
    <AdminLayout title="Leads Tecidos">
      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Tecido</TableHead>
              <TableHead>CNPJ</TableHead>
              <TableHead>WhatsApp</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-24" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : leads && leads.length > 0 ? (
              leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="text-sm whitespace-nowrap">
                    {format(new Date(lead.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                  </TableCell>
                  <TableCell className="font-medium">{lead.fabric_name}</TableCell>
                  <TableCell className="text-sm">{formatCnpj(lead.cnpj)}</TableCell>
                  <TableCell className="text-sm">
                    <a
                      href={`https://wa.me/55${lead.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline"
                    >
                      {formatWhatsapp(lead.whatsapp)}
                    </a>
                  </TableCell>
                  <TableCell className="text-sm">
                    <a href={`mailto:${lead.email}`} className="text-accent hover:underline">
                      {lead.email}
                    </a>
                  </TableCell>
                  <TableCell>
                    <Badge variant={lead.status === "new" ? "default" : "secondary"}>
                      {lead.status === "new" ? "Novo" : lead.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Nenhum lead recebido ainda.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}
