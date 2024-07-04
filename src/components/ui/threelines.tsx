interface ThreeLineProps {
    first: string;
    second: string;
    third: number;
}

export const ThreeLines = ({ first, second, third }: ThreeLineProps) => (
    <div className="flex flex-col items-start justify-center">
        <p className="text-cprimary font-bold">{first}</p>
        <p className=" font-bold text-xl">{second}</p>
        <p className={`${third >= 0 ? "text-green-400" : "text-red-400"}`}>
            {third}
        </p>
    </div>
);
