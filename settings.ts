import { Data, Mods } from "typed-factorio/settings/types";

declare var data: Data;

data.extend([
  {
    type: "int-setting",
    name: "yoked-up-multiplier",
    default_value: 2,
    setting_type: "runtime-global",
  },
]);
