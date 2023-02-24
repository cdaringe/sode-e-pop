/** @noSelfInFile **/
import { DRINK_EVENT_EFFECT_ID } from "./lib/common";
const LOGGING_ENABLED = false;

declare const global: {
  sodeStateByPlayerIndex: Record<
    number,
    {
      endTick: number;
    }
  >;
};

const log = (player: { print: (this: void, p: any) => void }, msg: any) => {
  if (LOGGING_ENABLED) {
    player.print(serpent.line(msg));
  }
};

const totalTicks = 60 * 30;
const sodeStartSpeedBuff = 2;
const sodeEndSpeedBuff = 0.5;
const buffPerRemTick = (sodeStartSpeedBuff - sodeEndSpeedBuff) / totalTicks;

function onPositionChange(evt: OnPlayerChangedPositionEvent) {
  const player = game.get_player(evt.player_index);
  if (!player) return;
  try {
    const sodeState = global.sodeStateByPlayerIndex[player.index];
    if (!sodeState) {
      return;
    }
    const remainingTicks = sodeState.endTick - game.tick;
    if (remainingTicks <= 0) {
      player.character_running_speed_modifier = 0;
      delete global.sodeStateByPlayerIndex[player.index];
      log(player, "buff expired");
    } else {
      const next = sodeEndSpeedBuff + buffPerRemTick * remainingTicks;
      log(player, {
        current: player.character_running_speed_modifier,
        next,
        remaining_s: Math.floor((sodeState.endTick - game.tick) / 60),
      });
      player.character_running_speed_modifier = next;
    }
  } catch (err) {
    log(player, err + "\n");
  }
}

script.on_event(defines.events.on_player_left_game, (evt) => {
  delete global.sodeStateByPlayerIndex[evt.player_index];
});

script.on_event(defines.events.on_script_trigger_effect, function (event) {
  if (event.effect_id == DRINK_EVENT_EFFECT_ID) {
    const index = event.source_entity?.player?.index;
    if (index) {
      const player = game.get_player(index);
      if (!player) return;
      const payload = {
        endTick: event.tick + totalTicks,
      };
      log(player, payload);
      global.sodeStateByPlayerIndex[index] = payload;
      player.character_running_speed_modifier = sodeStartSpeedBuff;
    }
  }
});

function clearSpeeds() {
  Object.entries<LuaForce>(game.players).forEach(([playerIndex, player]) => {
    player.character_running_speed_modifier = 0;
  });
}

script.on_load(() => {
  global.sodeStateByPlayerIndex = {};
});
script.on_init(() => {
  clearSpeeds();
  global.sodeStateByPlayerIndex = {};
});
script.on_event(defines.events.on_player_changed_position, onPositionChange);
