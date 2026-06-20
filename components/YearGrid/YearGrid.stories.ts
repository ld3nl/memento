import type { Meta, StoryObj } from '@storybook/nextjs'
import { YearGrid } from './YearGrid'

const weeks = Array.from({ length: 52 }, (_, i) => i + 1) as readonly number[]

const meta: Meta<typeof YearGrid> = {
  title: 'Components/YearGrid',
  component: YearGrid,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    yearsAlive: {
      control: { type: 'number', min: 0, max: 100 },
      description: 'Total years the person has lived',
    },
    currentDecadeYear: {
      control: { type: 'number', min: 1, max: 100 },
      description: 'The year this grid represents',
    },
    weeksFromLastBday: {
      control: { type: 'number', min: 0, max: 51 },
      description: 'Weeks elapsed since last birthday',
    },
    daysIntoCurrentWeek: {
      control: { type: 'number', min: 1, max: 7 },
      description: 'Days into the current week',
    },
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const CurrentYear: Story = {
  args: {
    weeks,
    yearsAlive: 25,
    currentDecadeYear: 26,
    weeksFromLastBday: 20,
    daysIntoCurrentWeek: 3,
  },
}

export const CompletedYear: Story = {
  args: {
    weeks,
    yearsAlive: 25,
    currentDecadeYear: 20,
    weeksFromLastBday: 10,
    daysIntoCurrentWeek: 1,
  },
}

export const FutureYear: Story = {
  args: {
    weeks,
    yearsAlive: 25,
    currentDecadeYear: 30,
    weeksFromLastBday: 10,
    daysIntoCurrentWeek: 1,
  },
}

export const FirstYear: Story = {
  args: {
    weeks,
    yearsAlive: 0,
    currentDecadeYear: 1,
    weeksFromLastBday: 5,
    daysIntoCurrentWeek: 2,
  },
}

export const MilestoneYear: Story = {
  args: {
    weeks,
    yearsAlive: 49,
    currentDecadeYear: 50,
    weeksFromLastBday: 26,
    daysIntoCurrentWeek: 4,
  },
}
