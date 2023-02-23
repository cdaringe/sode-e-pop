import { Data, Mods } from "typed-factorio/data/types";

declare var data: Data;

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
  },

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
  },

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
  },
]);
