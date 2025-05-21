const ButtonBar = ({ count = 1, height, width }: { count?: number, height?: string, width?: string }) => {
    return (
        <>
            {Array.from({ length: count }, (_, i) => (
                <div key={i} className={`${height ?? 'p-6'} ${width ?? 'w-full'} animate-pulse rounded-lg bg-neutral-200`}></div>
            ))}
        </>
    )
}

export default ButtonBar;