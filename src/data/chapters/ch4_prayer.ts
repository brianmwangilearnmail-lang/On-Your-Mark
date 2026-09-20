import { Chapter } from '../../types';

export const chapter4: Chapter = {
  id: 'ch4',
  slug: 'prayer',
  title: 'Chapter 4: The Art of Prayer',
  order: 4,
  modules: [
    {
      id: 'm4_1',
      chapterId: 'ch4',
      slug: 'communion-with-god',
      title: 'Communion with God',
      description: 'Developing a dynamic and effective prayer life.',
      order: 1,
      estimatedMinutes: 6,
      sections: [
        {
          id: 's4_1_1',
          title: 'Fellowship & Authority',
          content: 'Prayer is vital two-way communion with the Father and exercising your spiritual authority in Jesus name.',
          order: 1
        }
      ],
      reflections: [
        {
          id: 'r4_1_1',
          question: 'What time of day helps you focus best during personal prayer?',
          order: 1
        }
      ]
    }
  ]
};
