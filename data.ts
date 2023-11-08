import { DRINK_EVENT_EFFECT_ID } from "./lib/common";
import {
  TechnologyPrototype,
  CapsulePrototype,
  RecipePrototype,
} from "factorio:prototype";
import { PrototypeData, ActiveMods } from "factorio:common";

declare const data: PrototypeData;

const modBaseDirname = "__sode-e-pop__";

const sodaIconFilename = `${modBaseDirname}/graphics/icons/soda.png`;
const sodaTechnologyFilename = `${modBaseDirname}/graphics/icons/technology.png`;
const sodaGulpSound = `${modBaseDirname}/sound/gulp.wav`;

/**
 * Soda proto copied from:
 * @see https://github.com/wube/factorio-data/blob/398b61031c859f547da71ddf30ba3a1be65617ba/base/prototypes/item.lua#L462
 */
data.extend([
  {
    type: "technology",
    name: "sode-e-pop",
    icon_size: 256,
    icon_mipmaps: 4,
    icon: sodaTechnologyFilename,
    effects: [
      {
        type: "unlock-recipe",
        recipe: "sode-e-pop",
      },
    ],
    unit: {
      count: 10,
      ingredients: [["automation-science-pack", 1]],
      time: 15,
    },
  } satisfies TechnologyPrototype,

  {
    type: "capsule",
    name: "sode-e-pop",
    icon: sodaIconFilename,
    icon_size: 144,
    icon_mipmaps: 4,
    subgroup: "raw-resource",
    capsule_action: {
      type: "use-on-self",
      attack_parameters: {
        type: "projectile",
        activation_type: "consume",
        ammo_category: "capsule",
        cooldown: 5,
        range: 0,
        ammo_type: {
          category: "capsule",
          target_type: "position",
          action: {
            type: "direct",
            action_delivery: {
              type: "instant",
              target_effects: [
                {
                  type: "damage",
                  damage: { type: "physical", amount: -5 },
                },
                {
                  type: "script",
                  effect_id: DRINK_EVENT_EFFECT_ID,
                },
                {
                  type: "play-sound",
                  sound: {
                    filename: sodaGulpSound,
                    aggregation: {
                      max_count: 1,
                      remove: true,
                    },
                  },
                },
              ],
            },
          },
        },
      },
    },
    order: "h[sode-e-pop]",
    stack_size: 100,
  } satisfies CapsulePrototype,

  {
    type: "recipe",
    name: "sode-e-pop",
    category: "chemistry",
    enabled: false,
    energy_required: 1,
    ingredients: [
      { type: "fluid", name: "water", amount: 100 },
      { type: "item", name: "wood", amount: 5 },
      ["empty-barrel", 1],
    ],
    result: "sode-e-pop",
    subgroup: "fluid-recipes",
    crafting_machine_tint: {
      primary: { r: 0.8, g: 0.958, b: 0.0, a: 0.8 },
      secondary: { r: 0.8, g: 0.2, b: 0.172, a: 0.8 },
      tertiary: { r: 0.876, g: 0.869, b: 0.597, a: 0.8 },
      quaternary: { r: 0.6, g: 0.8, b: 0.019, a: 0.8 },
    },
  } satisfies RecipePrototype,
]);
