import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

/**
 * Hook centralizado para invalidar cache do React Query.
 * Garante que todas as queries relacionadas sejam atualizadas após mutações no admin.
 */
export function useInvalidateCache() {
  const queryClient = useQueryClient();

  /**
   * Invalida queries de tecidos (admin + homepage)
   */
  const invalidateFabrics = useCallback(() => {
    return Promise.all([
      queryClient.invalidateQueries({ queryKey: ["admin-fabrics"], refetchType: "active" }),
      queryClient.invalidateQueries({ queryKey: ["featured-fabrics-home"], refetchType: "active" }),
      queryClient.invalidateQueries({ queryKey: ["fabrics"], refetchType: "active" }),
      queryClient.invalidateQueries({ queryKey: ["fabric"], refetchType: "active" }),
    ]);
  }, [queryClient]);

  /**
   * Invalida queries de estampas (admin + homepage)
   */
  const invalidatePrints = useCallback(() => {
    return Promise.all([
      queryClient.invalidateQueries({ queryKey: ["admin-prints"], refetchType: "active" }),
      queryClient.invalidateQueries({ queryKey: ["latest-prints-home"], refetchType: "active" }),
      queryClient.invalidateQueries({ queryKey: ["prints"], refetchType: "active" }),
      queryClient.invalidateQueries({ queryKey: ["print-categories"], refetchType: "active" }),
    ]);
  }, [queryClient]);

  /**
   * Invalida queries de carrossel (admin + homepage)
   */
  const invalidateCarousel = useCallback(() => {
    return Promise.all([
      queryClient.invalidateQueries({ queryKey: ["admin-carousel-slides"], refetchType: "active" }),
      queryClient.invalidateQueries({ queryKey: ["carousel-slides"], refetchType: "active" }),
    ]);
  }, [queryClient]);

  /**
   * Invalida queries de depoimentos (admin + homepage)
   */
  const invalidateTestimonials = useCallback(() => {
    return Promise.all([
      queryClient.invalidateQueries({ queryKey: ["admin-testimonials"], refetchType: "active" }),
      queryClient.invalidateQueries({ queryKey: ["testimonials"], refetchType: "active" }),
    ]);
  }, [queryClient]);

  /**
   * Invalida queries de segmentos (admin + páginas públicas)
   */
  const invalidateSegments = useCallback(() => {
    return Promise.all([
      queryClient.invalidateQueries({ queryKey: ["admin-segments"], refetchType: "active" }),
      queryClient.invalidateQueries({ queryKey: ["segments"], refetchType: "active" }),
      queryClient.invalidateQueries({ queryKey: ["segment"], refetchType: "active" }),
    ]);
  }, [queryClient]);

  /**
   * Invalida TODAS as queries públicas - útil após múltiplas alterações
   */
  const invalidateAllPublic = useCallback(() => {
    return Promise.all([
      invalidateFabrics(),
      invalidatePrints(),
      invalidateCarousel(),
      invalidateTestimonials(),
      invalidateSegments(),
    ]);
  }, [invalidateFabrics, invalidatePrints, invalidateCarousel, invalidateTestimonials, invalidateSegments]);

  /**
   * Força refetch imediato de todas as queries ativas
   */
  const refetchAllActive = useCallback(() => {
    return queryClient.refetchQueries({ type: "active" });
  }, [queryClient]);

  /**
   * Limpa cache completamente e refaz todas as queries
   */
  const clearAndRefetch = useCallback(async () => {
    queryClient.clear();
    await queryClient.refetchQueries();
  }, [queryClient]);

  return {
    invalidateFabrics,
    invalidatePrints,
    invalidateCarousel,
    invalidateTestimonials,
    invalidateSegments,
    invalidateAllPublic,
    refetchAllActive,
    clearAndRefetch,
  };
}
