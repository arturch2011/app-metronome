import numeral from "numeral";

export interface MetricProps {
  title: string;
  typeValue: "CURRENCY" | "PERCENT"
  value: number;
  percent: number;
}

export const Metric = ({ title, typeValue, value, percent }: MetricProps) => (
  <div className="flex flex-col items-start justify-center">
    <p className="text-cprimary font-bold">{title}</p>
    <p className=" font-bold text-xl">
      { typeValue == "CURRENCY" 
        ? `$${numeral(value).format("0,0.0")}` 
        : `${value}%`
      }
    </p>
    <p className={`${percent >= 0 ? "text-green-400" : "text-red-400"}`}>
      {percent}%
    </p>
  </div>
);
