import { useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { Skycons } from 'skycons-ts';
import { activeThemeAtom } from '../../../../state/theme';
import { IconMapping, TimeOfDay } from './IconMapping';

interface Props {
  weatherStatusCode: number;
  isDay: number;
}

export const WeatherIcon = (props: Props): JSX.Element => {
  const activeTheme = useAtomValue(activeThemeAtom);

  const icon = props.isDay
    ? new IconMapping().mapIcon(props.weatherStatusCode, TimeOfDay.day)
    : new IconMapping().mapIcon(props.weatherStatusCode, TimeOfDay.night);

  useEffect(() => {
    const delay = setTimeout(() => {
      const skycons = new Skycons({ color: activeTheme.colors.accent });
      skycons.add(`weather-icon`, icon);
      skycons.play();
    }, 1);

    return () => {
      clearTimeout(delay);
    };
  }, [props.weatherStatusCode, icon, activeTheme.colors.accent]);

  return <canvas id={`weather-icon`} width="50" height="50"></canvas>;
};
