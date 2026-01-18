import { memo } from 'react';
import Image from 'next/image';
import { LucideIcon } from 'lucide-react';

interface ToolCardProps {
    title: string;
    description: string;
    icon?: string | LucideIcon;
    className?: string;
}

const ToolCard = ({
    title,
    description,
    icon: Icon,
    className = '',
}: ToolCardProps) => {
    return (
        <div
            className={`
        group relative w-full bg-[#E5E5E5] dark:bg-zinc-800/50 
        rounded-xl border border-zinc-200/50 dark:border-zinc-700/50
        p-4 transition-all duration-300 hover:shadow-md
        ${className}
      `}
        >
            <div className="flex items-center gap-4">
                {/* Icon Container */}
                <div className="shrink-0 w-12 h-12 bg-black dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-black">
                    {Icon && (
                        typeof Icon === 'string' ? (
                            <Image
                                src={Icon}
                                alt={`${title} icon`}
                                width={24}
                                height={24}
                                className="object-contain"
                            />
                        ) : (
                            <Icon size={24} strokeWidth={2} />
                        )
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 leading-tight mb-0.5">
                        {title}
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium truncate">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default memo(ToolCard);