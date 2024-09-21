import Autocomplete from "@mui/material/Autocomplete";
import {useQuery} from "react-query";
import API from "../../APIs/API";

export function FieldShowPaypointDesc({
                                        name,
                                        value,
                                        onChange,
                                        adminLocationId,
                                        accountNoDesc,
                                      }) {
  const {data: paypointDescList = []} = useQuery({
    queryFn: async () => {
      const result = await new API().getPaypointDescList(adminLocationId, accountNoDesc);
      if (result) {
        return result["data"];
      }
      return [];
    }
  });

  return (
    <div className="form-outline">
      <label className="form-label" htmlFor={name}>
        <b>Paypoint desc</b>
      </label>
      <br/>
      <Autocomplete
        id={name}
        disablePortal
        options={paypointDescList}
        fullWidth
        name={name}
        renderInput={(params) => (
          <div ref={params.InputProps.ref}>
            <input
              type="text"
              {...params.inputProps}
              required
              className="form-control"
            />
          </div>
        )}
        onChange={(_, v) => onChange(name, v === "All" ? "" : v)}
        defaultValue=""
        disableClearable
        value={value}
      />
    </div>
  );
}
