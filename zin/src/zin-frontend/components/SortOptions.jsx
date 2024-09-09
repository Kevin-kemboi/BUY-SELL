import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formUrlQuery } from "@/lib/utils";
import { useNavigate, useSearchParams } from "react-router-dom";

const SortOptions = ({ sortBy = [] }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const paramsFilter = searchParams.get("sortby");

    const handleUpdateParams = (value) => {
        if(value !== ''){
            const newUrl = formUrlQuery({
            params: searchParams.toString(),
            key: "sortby",
            value,
        });
        navigate(newUrl)
    }else{
        navigate(`/allproducts`)
    }

    }


  return (
    <RadioGroup defaultValue={paramsFilter || ''} onValueChange={handleUpdateParams}  className="gap-1">
      {sortBy.map((filter) => (
        <div key={filter.value} className="flex items-center space-x-1 ">
          <RadioGroupItem value={filter.value} id={filter.name} className="cursor-pointer" />
          <Label className=" cursor-pointer text-[10px] hover:underline underline-offset-1 transition-all" htmlFor={filter.name}>{filter.name}</Label>
        </div>
      ))}
    </RadioGroup>
  );
};

export default SortOptions;
