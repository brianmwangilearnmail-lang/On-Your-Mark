import { Book, Chapter, Module } from '../types';

export const chapter0: Chapter = {
  id: 'ch0',
  slug: 'introduction',
  title: 'Chapter 0: Introduction',
  order: 0,
  modules: [
    {
      id: 'm0_1',
      chapterId: 'ch0',
      slug: 'welcome-to-the-race',
      title: 'Welcome to the Race',
      description: 'Understanding the spiritual foundational race and setting your mark.',
      order: 1,
      estimatedMinutes: 5,
      sections: [
        {
          id: 's0_1_1',
          title: 'On Your Mark',
          content: 'Welcome to your journey through "ON YOUR MARK". Life in Christ is a purposeful, triumphant race designed for you to finish with joy and glory.',
          order: 1
        }
      ],
      reflections: [
        {
          id: 'r0_1_1',
          question: 'What are your expectations as you begin this foundational study?',
          order: 1
        }
      ]
    }
  ]
};
