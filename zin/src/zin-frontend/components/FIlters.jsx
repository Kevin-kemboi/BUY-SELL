import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formUrlQuery } from "@/lib/utils";
import { useNavigate, useSearchParams } from "react-router-dom";

const Filters = ({ filters = [] }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const paramsFilter = searchParams.get("filter");

  const handleUpdateParams = (value) => {
    if (value !== "") {
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value,
      });
      navigate(newUrl);
    } else {
      // When sortby is '', remove the 'sortby' parameter and keep the others
      const newParams = new URLSearchParams(searchParams);

      // Delete the 'sortby' parameter
      newParams.delete("filter");

      // Generate the new URL without 'sortby'
      const newUrlWithoutSort = `/allproducts?${newParams.toString()}`;
      navigate(newUrlWithoutSort);
    }
  };

  return (
    <RadioGroup
      defaultValue={paramsFilter || ""}
      onValueChange={handleUpdateParams}
      className="gap-1"
    >
      {filters.map((filter) => (
        <div key={filter.value} className="flex items-center space-x-1 ">
          <RadioGroupItem
            value={filter.value}
            id={filter.name}
            className="cursor-pointer"
          />
          <Label
            className=" cursor-pointer text-xs hover:underline underline-offset-1 transition-all"
            htmlFor={filter.name}
          >
            {filter.name}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};

export default Filters;
