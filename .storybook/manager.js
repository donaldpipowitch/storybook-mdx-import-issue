import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming/create';

const theme = create({ brandTitle: 'EXAMPLE' });

addons.setConfig({
  theme,
});
