function repeat(n: number, value: any) {
  return Array(n).join(value);
}

function flatten(...args: any[]) {
  return [].concat.apply(null, args);
}

export const player = {
  'running-up': flatten(
    repeat(8, 'player_running_up_00'),
    repeat(8, 'player_running_up_01'),
    repeat(8, 'player_running_up_02'),
    repeat(8, 'player_running_up_03'),
  ),
  'running-right': flatten(
    repeat(8, 'player_running_right_00'),
    repeat(8, 'player_running_right_01'),
    repeat(8, 'player_running_right_02'),
    repeat(8, 'player_running_right_03'),
  ),
  'running-down': flatten(
    repeat(8, 'player_running_down_00'),
    repeat(8, 'player_running_down_01'),
    repeat(8, 'player_running_down_02'),
    repeat(8, 'player_running_down_03'),
  ),
  'running-left': flatten(
    repeat(8, 'player_running_left_00'),
    repeat(8, 'player_running_left_01'),
    repeat(8, 'player_running_left_02'),
    repeat(8, 'player_running_left_03'),
  )
}
