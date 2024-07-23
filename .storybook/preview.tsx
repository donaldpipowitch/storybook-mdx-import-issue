export const parameters = {
  layout: 'centered',
  backgrounds: {
    default: 'transparent',
    values: [
      {
        name: 'transparent',
        value:
          'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAJElEQVQoU2P8+vXrfwYkwM3NzYjMZ6SDAmT7QGx0K1EcRBsFABvvH4ERaEIJAAAAAElFTkSuQmCC)',
      },
      { name: 'brand', value: '#00378b' },
      { name: 'white', value: 'white' },
    ],
  },
  a11y: {
    options: {
      restoreScroll: true,
    },
  },
  docs: {
    source: { type: 'dynamic' },
  },
  stages: { disable: true },
};

export const decorators = [];
