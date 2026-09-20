import { Chapter } from '../../types';

export const chapter3: Chapter = {
  id: 'ch3',
  slug: 'baptisms',
  title: 'Chapter 3: The Doctrine of Baptisms',
  order: 3,
  modules: [
    {
      id: 'm3_1',
      chapterId: 'ch3',
      slug: 'understanding-baptisms',
      title: 'Understanding Baptisms',
      description: 'Water baptism and the empowerment of the Holy Spirit.',
      order: 1,
      estimatedMinutes: 8,
      sections: [
        {
          id: 's3_1_1',
          title: 'Immersion & Empowerment',
          content: 'Water baptism symbolizes dying with Christ and rising into new life, while Holy Spirit baptism endues believers with supernatural power.',
          order: 1
        }
      ],
      reflections: [
        {
          id: 'r3_1_1',
          question: 'How has the baptism in the Holy Spirit empowered your personal Christian walk?',
          order: 1
        }
      ]
    }
  ]
};
