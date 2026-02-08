import { Unit } from "../types";
import { useConversion } from "./context/useConversion";
import formattedValue from "./utils/FormatValues";

export default function Result() {
  const { targetUnits, targetResult, setTargetResult, convertedValue } =
    useConversion();
  const formattedResult = formattedValue(convertedValue);

  return (
    <div className="bg-[#EFF2F6] border-[1px] border-[#EBEAEA] rounded-[12px] px-[0.75rem] py-[1rem] mb-8">
      <div className="w-full flex items-start">
        <div className="w-2/3 flex flex-col">
          <label className="text-[#7D7D7D] text-[0.875rem] font-medium">
            Result
          </label>

          <div
            className="
            w-full
    text-[#212121]
    text-[2.5rem]
    font-bold
    whitespace-normal
    break-all
    line-clamp-2
  "
          >
            {formattedResult}
            {<span className="text-[1.25rem] font-medium">{targetResult}</span>}
          </div>
        </div>
        <select
          value={targetResult}
          onChange={(e) => setTargetResult(e.target.value)}
          className="bg-[#ffffff] text-[#212121] focus:outline-none rounded-[16px] p-2"
        >
          {targetUnits.map((unit) => (
            <option key={unit.id} value={unit.id}>
              {unit.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
