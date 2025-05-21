const Unauthenticated = () => {
    return (
        <div className="flex py-20 w-full items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-black dark:text-white">Unauthenticated</h1>
            </div>
        </div>
    );
};

const Authenticating = () => {
    return (
        <div className="flex py-20 w-full items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-black dark:text-white">Authenticating</h1>
            </div>
        </div>
    );
};

export { Authenticating, Unauthenticated };