/** @noSelfInFile **/
import {
  LuaPlayer,
  OnPlayerChangedPositionEvent,
  OnTickEvent,
  PlayerIndex,
} from "factorio:runtime";
import { DRINK_EVENT_EFFECT_ID } from "./lib/common";
import { color } from "util";

const LOGGING_ENABLED = false;
const STAMINA_SCALE = 0.15;
const STAMINA_OFFSET = [0, -2.1] as const;

interface SodeState {
  staminaSpriteId?: number;
  lastPosition: { x: number; y: number };
  endTick: number;
}
declare const global: {
  sodeStateByPlayerIndex: Record<number, SodeState>;
};

global.sodeStateByPlayerIndex = {};

const log = (player: { print: (this: void, p: any) => void }, msg: any) => {
  if (LOGGING_ENABLED) {
    player.print(serpent.line(msg));
  }
};

const numStamFrames = 60;
const maxStamFrameIdx = numStamFrames - 1;
const totalTicks = 60 * 30; // 60s * 30 tick/s
const sodeStartSpeedBuff = 2;
const sodeEndSpeedBuff = 0.5;
const sodeBuffRange = sodeStartSpeedBuff - sodeEndSpeedBuff;
const buffPerRemTick = sodeBuffRange / totalTicks;

const drawStamWheel = (player: LuaPlayer, state: SodeState, tick: number) => {
  // clear old state
  const prevStaminaSpriteId = state.staminaSpriteId;
  if (prevStaminaSpriteId) rendering.destroy(prevStaminaSpriteId);

  // load new state
  const remainingTicks = state.endTick - tick;
  const percentBuffApplied = (remainingTicks * buffPerRemTick) / sodeBuffRange;
  const wheelIdx = 60 - Math.floor(60 * percentBuffApplied);
  if (wheelIdx > maxStamFrameIdx) {
    return;
  }
  state.staminaSpriteId = rendering.draw_sprite({
    sprite: `stamina_wheel_${wheelIdx}`,
    target: player.character!,
    target_offset: STAMINA_OFFSET,
    surface: player.surface,
    // x_scale: STAMINA_SCALE,
    // y_scale: STAMINA_SCALE,
  });
};

const withState = (
  idx: PlayerIndex,
  fn: (player: LuaPlayer, state: SodeState) => void
) => {
  const player = game.get_player(idx);
  if (!player) return;
  const sodeState = global.sodeStateByPlayerIndex;
  const playerState = sodeState?.[player.index];
  if (!playerState) return;
  fn(player, playerState);
};

const onPositionChange = (evt: OnPlayerChangedPositionEvent) =>
  withState(evt.player_index, (player, playerState) => {
    try {
      const remainingTicks = playerState.endTick - game.tick;
      if (remainingTicks > 0) {
        if (!playerState.staminaSpriteId) {
          drawStamWheel(player, playerState, evt.tick);
        }
        const next = sodeEndSpeedBuff + buffPerRemTick * remainingTicks;
        // log(player, {
        //   current: player.character_running_speed_modifier,
        //   next,
        //   remaining_s: Math.floor((playerState.endTick - game.tick) / 60),
        // });
        player.character_running_speed_modifier = next;
      }
    } catch (err) {
      log(player, err);
    } finally {
      playerState.lastPosition = player.position;
    }
  });

const onBuffExpired = (player: LuaPlayer, playerState: SodeState) => {
  player.character_running_speed_modifier = 0;
  if (playerState.staminaSpriteId) {
    rendering.destroy(playerState.staminaSpriteId);
  }
  delete global.sodeStateByPlayerIndex[player.index];
  log(player, "buff expired");
};

const onPlayerTick = (
  player: LuaPlayer,
  playerState: SodeState,
  evt: OnTickEvent
) => {
  const remainingTicks = playerState.endTick - game.tick;
  if (remainingTicks <= 0) {
    onBuffExpired(player, playerState);
  } else {
    drawStamWheel(player, playerState, evt.tick);
  }
};

const onTick = (evt: OnTickEvent) => {
  for (const id in global.sodeStateByPlayerIndex) {
    const player = game.get_player(id);
    if (!player) continue;
    withState(player.index, (p, s) => onPlayerTick(p, s, evt));
  }
};

script.on_event(defines.events.on_player_changed_position, onPositionChange);
script.on_event(defines.events.on_tick, onTick);
script.on_event(defines.events.on_player_left_game, (evt) => {
  delete global.sodeStateByPlayerIndex[evt.player_index];
});
script.on_event(defines.events.on_script_trigger_effect, function (event) {
  if (event.effect_id == DRINK_EVENT_EFFECT_ID) {
    const index = event.source_entity?.player?.index;
    if (index) {
      const player = game.get_player(index);
      if (!player) return;
      const lastState = global.sodeStateByPlayerIndex[player.index];
      if (lastState != null) onBuffExpired(player, lastState);
      const payload: SodeState = {
        endTick: event.tick + totalTicks,
        lastPosition: player.position,
      };
      log(player, payload);

      global.sodeStateByPlayerIndex = global.sodeStateByPlayerIndex || {};
      global.sodeStateByPlayerIndex[index] = payload;
      player.character_running_speed_modifier = sodeStartSpeedBuff;
    }
  }
});
