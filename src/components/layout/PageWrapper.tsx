import { motion } from "framer-motion";
import { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

interface PageWrapperProps {
  children: ReactNode;
}

export const PageWrapper = ({ children }: PageWrapperProps) => {
  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] text-zinc-50 font-sans selection:bg-zinc-800 relative">
      <div className="fixed inset-0 flex justify-center pointer-events-none z-0">
        <div className="w-full max-w-3xl border-x border-dashed border-zinc-800 h-full"></div>
      </div>
      <div className="relative z-10 flex flex-col">
        {children}
      </div>
    </div>
  );
};

export const Section = ({
  children,
  className = "",
  delay = 0,
  crosshair = false,
  bottomLabel = "",
  onBottomLabelClick,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  crosshair?: boolean;
  bottomLabel?: string;
  onBottomLabelClick?: () => void;
}) => {
  return (
    <section className="w-full flex justify-center border-b border-dashed border-zinc-800 relative">
      <div className={`w-full max-w-3xl border-x border-dashed border-zinc-800 relative ${className}`}>
        {crosshair && <PlusGrid />}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay, ease: "easeOut" }}
          className="w-full h-full"
        >
          {children}
        </motion.div>
        
        {bottomLabel && (
           <div className="absolute left-1/2 bottom-0 translate-y-1/2 -translate-x-1/2 bg-[#0a0a0a] px-3 z-10 flex">
             <button 
               onClick={onBottomLabelClick}
               className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-zinc-200 bg-zinc-950 rounded-md border border-zinc-800 hover:bg-zinc-900 transition-colors cursor-pointer"
             >
                {bottomLabel} <ArrowUpRight className="h-3 w-3" />
             </button>
           </div>
        )}
      </div>
    </section>
  );
};

export const PlusGrid = () => (
  <div 
    className="absolute inset-0 z-0 pointer-events-none" 
    style={{ 
      backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'24\' height=\'24\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M12 6v12M6 12h12\' stroke=\'%233f3f46\' stroke-width=\'1\'/%3E%3C/svg%3E")',
      backgroundPosition: 'center',
      opacity: 0.5
    }}
  />
);
