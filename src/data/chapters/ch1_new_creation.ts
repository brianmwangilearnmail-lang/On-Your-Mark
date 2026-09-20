import { Chapter } from '../../types';

export const chapter1: Chapter = {
  id: 'ch1',
  slug: 'new-creation',
  title: 'Chapter 1: The New Creation',
  order: 1,
  modules: [
    {
      id: 'm1_1',
      chapterId: 'ch1',
      slug: 'who-you-are-in-christ',
      title: 'Who You Are in Christ',
      description: 'Understanding your identity and nature as a brand new creation in Jesus.',
      order: 1,
      estimatedMinutes: 7,
      sections: [
        {
          id: 's1_1_1',
          title: 'Old Things Passed Away',
          content: 'Therefore, if anyone is in Christ, he is a new creation; old things have passed away; behold, all things have become new (2 Corinthians 5:17).',
          order: 1
        }
      ],
      reflections: [
        {
          id: 'r1_1_1',
          question: 'How does knowing you are completely new change how you view past mistakes?',
          order: 1
        }
      ]
    }
  ]
};
