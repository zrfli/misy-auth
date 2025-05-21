interface Props {
    className: string;
}

const AvatarCardSkeleton = ({ className }: Props) => {
    return (
        <div className="flex items-center animate-pulse">
            <div className={`${className} bg-neutral-300 dark:bg-neutral-600 border border-neutral-300 dark:border-neutral-600`}></div>
        </div>
    );
};

export default AvatarCardSkeleton;