import { SettingsData } from "factorio:common";
import { IntSettingDefinition } from "factorio:settings";

declare const data: SettingsData;

const setting: IntSettingDefinition = {
  type: "int-setting",
  name: "yoked-up-multiplier",
  default_value: 2,
  setting_type: "runtime-global",
} satisfies IntSettingDefinition;

data.extend([setting]);
