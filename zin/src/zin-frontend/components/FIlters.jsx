import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const Filters = ({ filters }) => {
  return (
    <RadioGroup defaultValue={``}>
      {filters.map((filter) => (
        <div key={filter.value} className="flex items-center space-x-2">
          <RadioGroupItem value={filter.value} id={filter.name} />
          <Label htmlFor={filter.name}>{filter.name}</Label>
        </div>
      ))}
    </RadioGroup>
  );
};

export default Filters;
