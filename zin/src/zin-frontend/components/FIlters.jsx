import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const Filters = ({ filters = [] }) => {
  return (
    <RadioGroup defaultValue={``} className="gap-1">
      {filters.map((filter) => (
        <div key={filter.value} className="flex items-center space-x-1">
          <RadioGroupItem value={filter.value} id={filter.name} />
          <Label className=" text-xs" htmlFor={filter.name}>{filter.name}</Label>
        </div>
      ))}
    </RadioGroup>
  );
};

export default Filters;
