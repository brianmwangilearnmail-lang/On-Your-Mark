import { Chapter } from '../../types';

export const chapter2: Chapter = {
  id: 'ch2',
  slug: 'eternal-security',
  title: 'Chapter 2: Eternal Security',
  order: 2,
  modules: [
    {
      id: 'm2_1',
      chapterId: 'ch2',
      slug: 'anchored-in-grace',
      title: 'Anchored in Grace',
      description: 'Discovering the solid rock assurance of your salvation.',
      order: 1,
      estimatedMinutes: 6,
      sections: [
        {
          id: 's2_1_1',
          title: 'Unshakable Foundation',
          content: 'My sheep hear My voice, and I know them, and they follow Me. And I give them eternal life, and they shall never perish; neither shall anyone snatch them out of My hand.',
          order: 1
        }
      ],
      reflections: [
        {
          id: 'r2_1_1',
          question: 'What gives you confidence in God\'s promise of eternal security?',
          order: 1
        }
      ]
    }
  ]
};
