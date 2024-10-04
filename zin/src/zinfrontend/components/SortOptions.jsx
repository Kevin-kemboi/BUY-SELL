import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formUrlQuery } from "@/lib/utils";
import { useNavigate, useSearchParams } from "react-router-dom";

const SortOptions = ({ sortBy = [] }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const paramsFilter = searchParams.get("sortby");

  const handleUpdateParams = (value) => {
    if (value !== "") {
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "sortby",
        value,
      });
      navigate(newUrl);
    } else {
      // When sortby is '', remove the 'sortby' parameter and keep the others
      const newParams = new URLSearchParams(searchParams);

      // Delete the 'sortby' parameter
      newParams.delete("sortby");

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
      {sortBy.map((filter) => (
        <div key={filter.value} className="flex items-center justify-end space-x-1 ">
          <Label
            className=" cursor-pointer text-[10px] hover:underline underline-offset-1 transition-all max-sm:text-base "
            htmlFor={filter.name}
          >
            {filter.name}
          </Label>
          <RadioGroupItem
            value={filter.value}
            id={filter.name}
            className="cursor-pointer"
          />
        </div>
      ))}
    </RadioGroup>
  );
};

export default SortOptions;
