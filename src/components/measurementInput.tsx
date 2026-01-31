import { useEffect } from "react";
import { DIMENSIONS } from "../lib/units";

interface DimensionProps {
  setSelectedDimension: (value: string) => void;
  selectedDimension: string;
  setSelectedUnit: (value: string) => [];
  selectedUnit: string;
}

export default function InputMeasurement({
  selectedDimension,
  setSelectedDimension,
  setSelectedUnit,
  selectedUnit,
}: DimensionProps) {
  useEffect(() => {
    const dimension = DIMENSIONS[selectedDimension];
    setSelectedUnit(dimension.units[0].name);
    // setTargetUnit(dimension.units[1].id);
  }, [selectedDimension]);
  return (
    <div className="bg-[#EEF6FF] border-[1px] border-[#C7D7F1] rounded-[12px] px-[0.75rem] py-[1rem] mb-8 overflow-hidden">
      <div className="w-full flex items-start">
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
        <select className="w-1/3 bg-[#2779FD] text-[#f3f3f3] text-[0.875rem] p-2 rounded-[16px]">
          <option>{selectedUnit}</option>
        </select>

        {/* <div className="w-1/3 text-center bg-[#2779FD] text-[#f3f3f3] text-[0.875rem] rounded-[16px] p-2">
          Meters
        </div> */}
      </div>
    </div>
  );
}
