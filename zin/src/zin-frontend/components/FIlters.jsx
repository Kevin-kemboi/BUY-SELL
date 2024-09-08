import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formUrlQuery } from "@/lib/utils";
import { useNavigate, useSearchParams } from "react-router-dom";

const Filters = ({ filters = [] }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const paramsFilter = searchParams.get("filter");

    const handleUpdateParams = (value) => {
        const newUrl = formUrlQuery({
            params: searchParams.toString(),
            key: "filter",
            value,
        });
        navigate(newUrl)

    }


  return (
    <RadioGroup defaultValue={paramsFilter} onValueChange={handleUpdateParams}  className="gap-1">
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
