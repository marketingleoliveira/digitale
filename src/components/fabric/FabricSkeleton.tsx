import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

interface FabricSkeletonGridProps {
  count?: number;
}

export function FabricSkeletonGrid({ count = 6 }: FabricSkeletonGridProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="space-y-4"
        >
          <Skeleton className="aspect-[4/3] rounded-2xl" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

interface LoadingMoreSkeletonProps {
  count?: number;
}

export function LoadingMoreSkeleton({ count = 3 }: LoadingMoreSkeletonProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={`loading-${i}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            delay: i * 0.1,
            duration: 0.3,
          }}
          className="space-y-4"
        >
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-secondary">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-background/20 to-transparent"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "linear",
              }}
            />
          </div>
          <div className="space-y-3">
            <div className="h-8 bg-secondary rounded-lg w-3/4 relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-background/20 to-transparent"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "linear",
                  delay: 0.2,
                }}
              />
            </div>
            <div className="h-4 bg-secondary rounded w-full relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-background/20 to-transparent"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "linear",
                  delay: 0.4,
                }}
              />
            </div>
            <div className="flex gap-2">
              {[1, 2, 3].map((j) => (
                <div 
                  key={j} 
                  className="h-6 bg-secondary rounded-full relative overflow-hidden"
                  style={{ width: `${60 + j * 10}px` }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-background/20 to-transparent"
                    animate={{
                      x: ["-100%", "100%"],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      ease: "linear",
                      delay: 0.1 * j,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
