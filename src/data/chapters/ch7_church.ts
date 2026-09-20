import { Chapter } from '../../types';

export const chapter7: Chapter = {
  id: 'ch7',
  slug: 'the-local-church',
  title: 'Chapter 7: The Local Church & Kingdom Community',
  order: 7,
  modules: [
    {
      id: 'm7_1',
      chapterId: 'ch7',
      slug: 'planted-in-the-house',
      title: 'Planted in the House',
      description: 'The importance of local fellowship and spiritual family.',
      order: 1,
      estimatedMinutes: 5,
      sections: [
        {
          id: 's7_1_1',
          title: 'Flourishing Together',
          content: 'Those who are planted in the house of the Lord shall flourish in the courts of our God (Psalm 92:13).',
          order: 1
        }
      ],
      reflections: [
        {
          id: 'r7_1_1',
          question: 'In what ways does your local church community strengthen your spiritual walk?',
          order: 1
        }
      ]
    }
  ]
};
