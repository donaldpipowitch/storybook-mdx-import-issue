import { Meta, StoryObj } from '@storybook/react';
import { FC } from 'react';

const Content: FC<{ label: string }> = ({ label }) => <div>{label}</div>;

const meta = {
  title: 'Pages/Components/Content',
  component: Content,
} as Meta<typeof Content>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Example: Story = {
  args: {
    label: 'Hello, World!',
  },
};
