import type OsuUserEventEpicFactor from '../../bindables/OsuUserEventEpicFactor';

export default interface IOsuUserEvent {
  display_html: string;
  beatmap_id: number;
  beatmap_set_id: number;
  date: Date;
  epic_factor: OsuUserEventEpicFactor;
}
