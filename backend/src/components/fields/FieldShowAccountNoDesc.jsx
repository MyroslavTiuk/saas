import Autocomplete from "@mui/material/Autocomplete";
import {useQuery} from "react-query";
import API from "../../APIs/API";

export function FieldShowAccountNoDesc({
                                         name,
                                         value,
                                         onChange,
                                         adminLocationId,
                                       }) {
  const {data: accountNoDescList = []} = useQuery({
    queryFn: async () => {
      const result = await new API().getAccountNoDescList(adminLocationId);
      if (result) {
        return result["data"];
      }
      return [];
    }
  });

  return (
    <div className="form-outline">
      <label className="form-label" htmlFor="account_no_desc">
        <b>Account no desc</b>
      </label>
      <br/>
      <Autocomplete
        id="account_no_desc"
        disablePortal
        options={accountNoDescList}
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
