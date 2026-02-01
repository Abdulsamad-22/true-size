import { DIMENSIONS } from "../lib/units";

type DimensionId = "length" | "weight" | "volume" | "temperature";

interface DimensionProps {
  selectedDimension: DimensionId;
  selectedUnit: string;
  setSelectedDimension: (d: DimensionId) => void;
  setSelectedUnit: (u: string) => void;
}

export default function InputMeasurement({
  selectedDimension,
  selectedUnit,
  setSelectedUnit,
}: DimensionProps) {
  const units = DIMENSIONS[selectedDimension].units;
  return (
    <div className="bg-[#EEF6FF] border-[1px] border-[#C7D7F1] rounded-[12px] px-[0.75rem] py-[1rem] mb-8 overflow-hidden">
      <div className="w-full flex items-start justify-between">
        <div className="w-2/3 flex flex-col">
          <label className="text-[#2779FD] text-[0.875rem] font-medium">
            Input
          </label>
          <div className="flex">
            <input
              className="block text-[2.5rem] font-bold border-none outline-none focus:outline-none"
              placeholder="1,200"
            />
          </div>
        </div>
        <select
          value={selectedUnit}
          onChange={(e) => setSelectedUnit(e.target.value)}
          className="bg-[#2779f3] text-[#f3f3f3] focus:outline-none rounded-[16px] p-2"
        >
          {units.map((unit) => (
            <option key={unit.id} value={unit.id}>
              {unit.name}
            </option>
          ))}
        </select>

        {/* <div className="w-1/3 text-center bg-[#2779FD] text-[#f3f3f3] text-[0.875rem] rounded-[16px] p-2">
          Meters
        </div> */}
      </div>
    </div>
  );
}
