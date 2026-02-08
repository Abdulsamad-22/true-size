import { DIMENSIONS } from "../lib/units";
import { useConversion } from "./context/useConversion";

type DimensionId = "length" | "weight" | "volume" | "temperature";

interface DimensionProps {
  selectedDimension: DimensionId;
  selectedUnit: string;
  setSelectedDimension: (d: DimensionId) => void;
  setSelectedUnit: (u: string) => void;
  inputValue: string;
  setInputValue: (v: string) => void;
}

export default function InputMeasurement() {
  const {
    selectedDimension,
    selectedUnit,
    setSelectedUnit,
    inputValue,
    setInputValue,
  } = useConversion();
  const units = DIMENSIONS[selectedDimension].units;
  return (
    <div className="bg-[#EEF6FF] border-[1px] border-[#C7D7F1] rounded-[12px] px-[0.75rem] py-[1rem] mb-8">
      <div className="w-full flex items-start justify-between">
        <div className="w-2/3 flex flex-col gap-3">
          <label className="text-[#2779FD] text-[0.875rem] font-medium">
            Input
          </label>
          <div className="flex">
            <textarea
              value={inputValue}
              rows={1}
              placeholder={`1,200${selectedUnit}`}
              onChange={(e) => {
                const value = e.target.value;
                if (/^[0-9]*\.?[0-9]*$/.test(value)) {
                  setInputValue(value);
                }
              }}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = "auto";

                const lineHeight = 48;
                const maxHeight = lineHeight * 2;
                el.style.height = Math.min(el.scrollHeight, maxHeight) + "px";
              }}
              className="
    w-full
    max-w-[369px]
    bg-transparent
    text-[2.5rem]
    font-bold
    border-none
    outline-none
    resize-none
    leading-[48px]
    overflow-hidden
    break-words
    whitespace-pre-wrap
  "
            />
          </div>
        </div>
        <select
          value={selectedUnit}
          onChange={(e) => setSelectedUnit(e.target.value)}
          className="bg-[#2779fd] text-[#f3f3f3] focus:outline-none rounded-[16px] p-2"
        >
          {units.map((unit) => (
            <option key={unit.id} value={unit.id}>
              {unit.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
