export default function Result() {
  return (
    <div className="bg-[#EFF2F6] border-[1px] border-[#EBEAEA] rounded-[12px] px-[0.75rem] py-[1rem] overflow-hidden mb-8">
      <div className="w-full flex items-start">
        <div className="w-2/3 flex flex-col">
          <label className="text-[#7D7D7D] text-[0.875rem] font-medium">
            Result
          </label>
          <div className="flex">
            <div className="text-[#212121] text-[2.5rem] font-bold">
              1,200<span className="text-[1.25rem] font-medium">cm</span>
            </div>
          </div>
        </div>
        <div className="w-1/3 text-center bg-[#ffffff] text-[#212121] text-[0.875rem] rounded-[16px] p-2">
          Centimeters
        </div>
      </div>
    </div>
  );
}
