import { ReactElement } from "react";

function NoMatch(): ReactElement {
    return (
        <div className="h-screen w-screen bg-zinc-800 text-white gap-6 flex flex-1 flex-col items-center justify-center">
            <h2 className="text-2xl font-medium">Nothing to see here</h2>
            <p className="font-extrabold text-green-300">
              Hands on the work!
            </p>
        </div>
    );
}

export { NoMatch }
